import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  BOOKSHELF_CAMERA_POSITION,
  BOOKSHELF_FOV,
  BOOKSHELF_LOOK_AT,
  CORKBOARD_CAMERA_POSITION,
  CORKBOARD_FOV,
  CORKBOARD_LOOK_AT,
  CAMERA_ANGLE_EPSILON,
  CAMERA_FOV_EPSILON,
  CAMERA_POSITION_EPSILON,
  CAMERA_TRANSITION_DURATION,
  DISPLAY_CAMERA_POSITION,
  DISPLAY_FOV,
  DISPLAY_LOOK_AT,
  ROOM_CAMERA_POSITION,
  ROOM_FOV,
  ROOM_LOOK_AT,
  WINDOW_CAMERA_POSITION,
  WINDOW_FOV,
  WINDOW_LOOK_AT,
} from "../../model/scene-config";
import type { StudioPhase } from "../../model/studio-state";

type CameraRigProps = {
  phase: StudioPhase;
  onDisplayReached: () => void;
  onBookshelfReached: () => void;
  onCorkboardReached: () => void;
  onWindowReached: () => void;
  onRoomRestored: () => void;
};

/**
 * studio配下のコンポーネントで付与したnameを使い、既存オブジェクトを参照する。
 */
const WINDOW_RECESS_COLORS = new Set(["cdb393", "d4bd9d"]);

function getStandardMaterial(object: THREE.Object3D) {
  if (!(object instanceof THREE.Mesh)) return null;
  const material = Array.isArray(object.material)
    ? object.material[0]
    : object.material;
  return material instanceof THREE.MeshStandardMaterial ? material : null;
}

/**
 * CameraRig内で後付けする小物用の共通Box生成関数。
 * ここで作ったgeometry/materialは、effectのcleanup時に必ずdisposeする。
 */
function createBoxMesh(
  scale: [number, number, number],
  color: string,
  roughness = 0.93,
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...scale),
    new THREE.MeshStandardMaterial({ color, roughness }),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * 元のvisible値を保存してから非表示にする。
 * 単純に visible = false だけにすると、HMRや再マウント時に元へ戻せなくなる。
 */
function hideObject(
  object: THREE.Object3D,
  restoredVisibility: Map<THREE.Object3D, boolean>,
) {
  if (!restoredVisibility.has(object))
    restoredVisibility.set(object, object.visible);
  object.visible = false;
}

// CameraRigが追加したObject3Dだけを破棄するためのcleanup用ヘルパー。
function disposeObjectTree(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => material.dispose());
  });
}

/**
 * 以下の createXxx 関数は StudioScene.tsx の既存モデルを直接書き換えず、
 * CameraRigのeffect内で追加する「見た目の差し替えパーツ」を生成する。
 *
 * 配置値は親groupのローカル座標。家具全体を動かす場合は、親側の座標も考慮すること。
 */
/**
 * 元のWindow group配下を非表示にしたあと、同じ親groupへ追加される差し替え窓。
 * 親group自体のposition/rotationはStudioScene.tsx側にある。
 * 窓全体を移動したい場合は、ここではなく親groupとscene-config.tsを確認する。
 */
function createSquareWindow() {
  const window = new THREE.Group();
  window.name = "studio-square-window";
  window.position.set(0, 0, 0.22);

  const glass = createBoxMesh([1.12, 1.12, 0.07], "#d7e0d6", 0.78);
  glass.position.z = 0.08;

  const frameColor = "#a77f56";
  const frameDepth = 0.12;
  const frameZ = 0.17;
  const frameThickness = 0.16;
  const frameSize = 1.52;
  const left = createBoxMesh(
    [frameThickness, frameSize, frameDepth],
    frameColor,
    0.92,
  );
  left.position.set(-0.68, 0, frameZ);
  const right = createBoxMesh(
    [frameThickness, frameSize, frameDepth],
    frameColor,
    0.92,
  );
  right.position.set(0.68, 0, frameZ);
  const top = createBoxMesh(
    [frameSize, frameThickness, frameDepth],
    frameColor,
    0.92,
  );
  top.position.set(0, 0.68, frameZ);
  const bottom = createBoxMesh(
    [frameSize, frameThickness, frameDepth],
    frameColor,
    0.92,
  );
  bottom.position.set(0, -0.68, frameZ);

  const verticalBar = createBoxMesh([0.08, 1.12, 0.08], "#eee5ce", 0.94);
  verticalBar.position.z = 0.2;
  const horizontalBar = createBoxMesh([1.12, 0.08, 0.08], "#eee5ce", 0.94);
  horizontalBar.position.z = 0.2;

  window.add(glass, left, right, top, bottom, verticalBar, horizontalBar);
  return window;
}

// 左壁の窓周辺を埋める補助パネル。窓の位置を変えるときはこの座標も要確認。
function createWindowWallPanel() {
  const panel = createBoxMesh([0.25, 4.62, 2.42], "#e6d8c2", 0.95);
  panel.name = "studio-window-wall-panel";
  panel.position.set(-4.075, 2.29, 0.55);
  return panel;
}

// 上段床の奥に見える隙間を塞ぐための補助形状。
// カメラ遷移の進み方。位置や向きではなく、移動の緩急だけを決める。
function easeDisplayTransition(progress: number) {
  if (progress <= 0 || progress >= 1) return progress <= 0 ? 0 : 1;
  const sampleCurve = (time: number, point1: number, point2: number) =>
    3 * (1 - time) * (1 - time) * time * point1 +
    3 * (1 - time) * time * time * point2 +
    time * time * time;
  let lower = 0;
  let upper = 1;
  for (let index = 0; index < 14; index += 1) {
    const time = (lower + upper) / 2;
    if (sampleCurve(time, 0.16, 0.3) < progress) lower = time;
    else upper = time;
  }
  return sampleCurve((lower + upper) / 2, 1, 1);
}

export function CameraRig({
  phase,
  onDisplayReached,
  onBookshelfReached,
  onCorkboardReached,
  onWindowReached,
  onRoomRestored,
}: CameraRigProps) {
  const { camera, scene } = useThree();
  const targetCamera = useMemo(() => new THREE.PerspectiveCamera(), []);
  const settledPhase = useRef<StudioPhase | null>(null);

  // phaseが変わった瞬間のカメラ状態を保存し、そこから目的地まで補間する。
  const transition = useRef<{
    phase: StudioPhase;
    startedAt: number;
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    fov: number;
  } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 同じphaseで到着callbackが複数回発火しないよう、phase変更時だけリセットする。
    settledPhase.current = null;
  }, [phase]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  /**
   * StudioScene.tsxで宣言されたシーンを一度走査し、見た目を補正するeffect。
   *
   * 処理の流れ:
   * 1. 明示的なnameから対象groupを見つける
   * 2. 元の色やvisibleを保存する
   * 3. 不要な元オブジェクトを非表示にする
   * 4. 差し替えパーツを追加する
   * 5. cleanupで元の状態へ戻し、追加パーツをdisposeする
   *
   * 見た目が二重になった・差し替えが消えた場合は、各コンポーネントのnameを確認する。
   */
  useEffect(() => {
    const restoredVisibility = new Map<THREE.Object3D, boolean>();
    const addedObjects: THREE.Object3D[] = [];
    const roomGroup = scene.getObjectByName("studio-room");
    const windowGroup = scene.getObjectByName("studio-window");

    scene.traverse((object) => {
      const material = getStandardMaterial(object);
      if (material) {
        const colorHex = material.color.getHexString();

        // 旧窓のくぼみを非表示にする。
        if (WINDOW_RECESS_COLORS.has(colorHex)) {
          hideObject(object, restoredVisibility);
        }
      }
    });

    // Windowのクリック可能な親groupは残し、見た目のmeshだけを差し替える。
    if (windowGroup) {
      windowGroup.traverse((object) => {
        if (object instanceof THREE.Mesh)
          hideObject(object, restoredVisibility);
      });
      const squareWindow = createSquareWindow();
      windowGroup.add(squareWindow);
      addedObjects.push(squareWindow);
      const wallPanel = createWindowWallPanel();
      roomGroup?.add(wallPanel);
      addedObjects.push(wallPanel);
    }

    return () => {
      // Strict Mode、HMR、Canvas再マウント時に元のシーンへ戻せるよう必ず復元する。
      restoredVisibility.forEach((visible, object) => {
        object.visible = visible;
      });
      addedObjects.forEach((object) => {
        object.removeFromParent();
        disposeObjectTree(object);
      });
    };
  }, [scene]);

  /**
   * カメラのposition・quaternion・FOVを毎フレーム補間する。
   * 目的地の数値は scene-config.ts に集約している。
   * 家具を移動してズーム先がずれた場合は、まずそちらを調整する。
   */
  // R3F camera transforms are intentionally updated inside its render loop.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((state) => {
    const isDisplayView =
      phase === "zooming-to-display" || phase === "projects";
    const isBookshelfView =
      phase === "zooming-to-bookshelf" || phase === "bookshelf-projects";
    const isCorkboardView =
      phase === "zooming-to-corkboard" || phase === "corkboard-projects";
    const isWindowView =
      phase === "zooming-to-window" || phase === "window-projects";
    const targetPosition = isDisplayView
      ? DISPLAY_CAMERA_POSITION
      : isBookshelfView
        ? BOOKSHELF_CAMERA_POSITION
        : isCorkboardView
          ? CORKBOARD_CAMERA_POSITION
          : isWindowView
            ? WINDOW_CAMERA_POSITION
            : ROOM_CAMERA_POSITION;
    const targetLookAt = isDisplayView
      ? DISPLAY_LOOK_AT
      : isBookshelfView
        ? BOOKSHELF_LOOK_AT
        : isCorkboardView
          ? CORKBOARD_LOOK_AT
          : isWindowView
            ? WINDOW_LOOK_AT
            : ROOM_LOOK_AT;
    const targetFov = isDisplayView
      ? DISPLAY_FOV
      : isBookshelfView
        ? BOOKSHELF_FOV
        : isCorkboardView
          ? CORKBOARD_FOV
          : isWindowView
            ? WINDOW_FOV
            : ROOM_FOV;

    targetCamera.position.copy(targetPosition);
    targetCamera.lookAt(targetLookAt);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    // phaseが変わったフレームだけ、補間の始点を現在のカメラ状態で作り直す。
    if (!transition.current || transition.current.phase !== phase) {
      transition.current = {
        phase,
        startedAt: state.clock.elapsedTime,
        position: camera.position.clone(),
        quaternion: camera.quaternion.clone(),
        fov: perspectiveCamera.fov,
      };
    }

    const elapsed = state.clock.elapsedTime - transition.current.startedAt;
    const progress = prefersReducedMotion
      ? 1
      : Math.min(elapsed / CAMERA_TRANSITION_DURATION, 1);
    const easedProgress = easeDisplayTransition(progress);

    camera.position.lerpVectors(
      transition.current.position,
      targetPosition,
      easedProgress,
    );
    camera.quaternion.slerpQuaternions(
      transition.current.quaternion,
      targetCamera.quaternion,
      easedProgress,
    );
    // eslint-disable-next-line react-hooks/immutability
    perspectiveCamera.fov = THREE.MathUtils.lerp(
      transition.current.fov,
      targetFov,
      easedProgress,
    );
    perspectiveCamera.updateProjectionMatrix();

    // 位置・FOV・角度の3条件が揃った時点で、画面側へ「到着」を通知する。
    const hasReachedTarget =
      camera.position.distanceTo(targetPosition) < CAMERA_POSITION_EPSILON &&
      Math.abs(perspectiveCamera.fov - targetFov) < CAMERA_FOV_EPSILON &&
      camera.quaternion.angleTo(targetCamera.quaternion) < CAMERA_ANGLE_EPSILON;
    if (!hasReachedTarget || settledPhase.current === phase) return;

    settledPhase.current = phase;
    if (phase === "zooming-to-display") onDisplayReached();
    if (phase === "zooming-to-bookshelf") onBookshelfReached();
    if (phase === "zooming-to-corkboard") onCorkboardReached();
    if (phase === "zooming-to-window") onWindowReached();
    if (
      [
        "returning-to-room",
        "returning-from-bookshelf",
        "returning-from-corkboard",
        "returning-from-window",
      ].includes(phase)
    ) {
      onRoomRestored();
    }
  });

  return null;
}
