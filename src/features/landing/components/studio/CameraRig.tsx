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
const WALL_SOURCE_COLORS = new Set([
  "b3bba4",
  "eadbc4",
  "d8a08c",
  "aab59e",
  "dbc29e",
]);
const WALL_COLOR = new THREE.Color("#e6d8c2");
const STRAY_ACCENT_COLORS = new Set(["91a18d", "c98672"]);
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
function createWallArtwork() {
  const artwork = new THREE.Group();
  artwork.name = "studio-wall-artwork";
  artwork.position.set(-4.22, 2.66, -1.43);
  artwork.rotation.set(0, Math.PI / 2, 0);

  const frame = createBoxMesh([1.08, 0.88, 0.12], "#a98d6d", 0.92);
  const canvas = createBoxMesh([0.84, 0.64, 0.07], "#eee2ca", 0.96);
  canvas.position.z = 0.08;
  const shape = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 20),
    new THREE.MeshStandardMaterial({ color: "#7f9a83", roughness: 0.95 }),
  );
  shape.position.set(-0.16, 0.08, 0.125);
  const accent = createBoxMesh([0.3, 0.12, 0.025], "#cc8b72", 0.95);
  accent.position.set(0.17, -0.13, 0.13);
  accent.rotation.z = -0.18;
  artwork.add(frame, canvas, shape, accent);
  return artwork;
}

function createDeskLegs() {
  const legs = new THREE.Group();
  legs.name = "studio-light-desk-legs";

  // Desk groupを原点として、天板の四隅に細い脚を置く。
  const positions: Array<[number, number, number]> = [
    [-1.4, 0.54, -0.56],
    [1.34, 0.54, -0.56],
    [-1.4, 0.54, 0.56],
    [1.34, 0.54, 0.56],
  ];
  positions.forEach((position) => {
    const leg = createBoxMesh([0.16, 1.06, 0.16], "#4f5f86");
    leg.position.set(...position);
    legs.add(leg);
  });
  return legs;
}

function createBookshelfDetails() {
  const details = new THREE.Group();
  details.name = "studio-bookshelf-details";
  const storageBox = createBoxMesh([0.82, 0.48, 0.52], "#c7aa80", 0.95);
  storageBox.position.set(0.45, 1.03, 0.02);
  const storageLabel = createBoxMesh([0.34, 0.12, 0.03], "#eee2ca", 0.96);
  storageLabel.position.set(0.45, 1.05, 0.3);
  const frame = createBoxMesh([0.72, 0.54, 0.12], "#a98d6d", 0.93);
  frame.position.set(0, 1.82, 0.02);
  const frameCanvas = createBoxMesh([0.52, 0.34, 0.08], "#e8ddc7", 0.96);
  frameCanvas.position.set(0, 1.82, 0.1);
  const frameShape = createBoxMesh([0.22, 0.1, 0.025], "#7f9a83", 0.95);
  frameShape.position.set(-0.08, 1.86, 0.155);
  frameShape.rotation.z = 0.16;
  details.add(storageBox, storageLabel, frame, frameCanvas, frameShape);
  return details;
}

function createCorkboardDetails() {
  const details = new THREE.Group();
  details.name = "studio-corkboard-details";

  // position/sizeはコルクボードgroup内のローカル座標。
  const notes = [
    {
      position: [-0.52, 0.28, 0.2] as const,
      size: [0.42, 0.58] as const,
      color: "#eee0c4",
      rotation: -0.08,
      pinColor: "#80584b",
    },
    {
      position: [0.02, 0.34, 0.205] as const,
      size: [0.56, 0.38] as const,
      color: "#dfe7dc",
      rotation: 0.05,
      pinColor: "#718474",
    },
    {
      position: [0.52, 0.12, 0.2] as const,
      size: [0.38, 0.52] as const,
      color: "#d8dce6",
      rotation: 0.09,
      pinColor: "#775e54",
    },
    {
      position: [-0.25, -0.3, 0.21] as const,
      size: [0.58, 0.32] as const,
      color: "#e7cfaa",
      rotation: -0.04,
      pinColor: "#806253",
    },
    {
      position: [0.4, -0.34, 0.215] as const,
      size: [0.3, 0.26] as const,
      color: "#ece5d2",
      rotation: 0.08,
      pinColor: "#6f7f72",
    },
  ];

  notes.forEach(({ position, size, color, rotation, pinColor }) => {
    const note = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshStandardMaterial({ color, roughness: 0.96 }),
    );
    note.position.set(position[0], position[1], position[2]);
    note.rotation.z = rotation;
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 10, 8),
      new THREE.MeshStandardMaterial({ color: pinColor, roughness: 0.9 }),
    );
    pin.position.set(
      position[0],
      position[1] + size[1] / 2 - 0.045,
      position[2] + 0.035,
    );
    pin.castShadow = true;
    details.add(note, pin);
  });
  return details;
}

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
function createUpperBackFiller() {
  const group = new THREE.Group();
  group.name = "studio-upper-back-filler";

  const left = createBoxMesh([6.9, 0.89, 0.5], "#d8c3a2", 0.93);
  left.position.set(-0.65, 0.435, -3.68);
  const right = createBoxMesh([2.55, 0.89, 0.5], "#d8c3a2", 0.93);
  right.position.set(2.6, 0.435, -3.43);

  const leftTopCover = createBoxMesh([6.9, 0.05, 0.72], "#d8c3a2", 0.93);
  leftTopCover.position.set(-0.65, 0.865, -3.57);
  const rightTopCover = createBoxMesh([2.55, 0.05, 0.7], "#d8c3a2", 0.93);
  rightTopCover.position.set(2.6, 0.865, -3.3);

  group.add(left, right, leftTopCover, rightTopCover);
  return group;
}

/**
 * StudioScene.tsxの旧階段を非表示にしたあと追加する、均一な3段階段。
 * fromY/toYは床の高さと連動しているため、床高を変えた場合は同時に修正する。
 */
function createUniformStairs() {
  const stairs = new THREE.Group();
  stairs.name = "studio-uniform-stairs";
  stairs.position.set(1.85, 0, -1.05);

  const fromY = -0.01;
  const toY = 0.88;
  const stepCount = 3;
  const rise = (toY - fromY) / stepCount;
  const treadDepth = 0.38;
  const depthOffset = ((stepCount - 1) * treadDepth) / 2;

  for (let index = 0; index < stepCount; index += 1) {
    const step = createBoxMesh([1.18, rise, treadDepth], "#d7c2a2", 0.93);
    step.position.set(
      0,
      fromY + rise * (index + 0.5),
      depthOffset - index * treadDepth,
    );
    stairs.add(step);
  }

  // 最上段と上段床の間に隙間が出ないよう、薄い橋を足している。
  const landingBridge = createBoxMesh([1.18, 0.06, 0.34], "#d7c2a2", 0.93);
  landingBridge.position.set(0, toY - 0.03, -0.63);
  stairs.add(landingBridge);
  return stairs;
}

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
    const restoredColors = new Map<THREE.MeshStandardMaterial, THREE.Color>();
    const restoredVisibility = new Map<THREE.Object3D, boolean>();
    const addedObjects: THREE.Object3D[] = [];
    const roomGroup = scene.getObjectByName("studio-room");
    const pendantGroup = scene.getObjectByName("studio-pendant-lamp");
    const deskGroup = scene.getObjectByName("studio-desk");
    const bookshelfGroup = scene.getObjectByName("studio-bookshelf");
    const corkboardGroup = scene.getObjectByName("studio-corkboard");
    const windowGroup = scene.getObjectByName("studio-window");
    const windowPlant = scene.getObjectByName("studio-window-plant");

    scene.traverse((object) => {
      const material = getStandardMaterial(object);
      if (material) {
        const colorHex = material.color.getHexString();

        // 複数色で作られていた壁を、現在のクリーム色へ統一する。
        if (WALL_SOURCE_COLORS.has(colorHex)) {
          restoredColors.set(material, material.color.clone());
          material.color.copy(WALL_COLOR);
          material.needsUpdate = true;
        }

        // 旧アクセント、旧窓のくぼみ、旧階段を非表示にする。
        if (
          STRAY_ACCENT_COLORS.has(colorHex) ||
          WINDOW_RECESS_COLORS.has(colorHex) ||
          colorHex === "d7c2a2"
        ) {
          hideObject(object, restoredVisibility);
        }
      }
    });

    if (pendantGroup) hideObject(pendantGroup, restoredVisibility);
    if (windowPlant) hideObject(windowPlant, restoredVisibility);

    // room直下へ追加する補助オブジェクト。
    const artwork = createWallArtwork();
    roomGroup?.add(artwork);
    addedObjects.push(artwork);

    const upperBackFiller = createUpperBackFiller();
    roomGroup?.add(upperBackFiller);
    addedObjects.push(upperBackFiller);

    const uniformStairs = createUniformStairs();
    roomGroup?.add(uniformStairs);
    addedObjects.push(uniformStairs);

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

    // 机の箱型収納を隠し、軽い4本脚へ差し替える。モニターは変更しない。
    if (deskGroup) {
      deskGroup.traverse((object) => {
        const isLeftCabinet = object.name === "studio-desk-left-cabinet";
        const isRightCabinet = object.name === "studio-desk-right-cabinet";
        const isDrawerHandle = object.name.startsWith(
          "studio-desk-drawer-handle-",
        );
        if (isLeftCabinet || isRightCabinet || isDrawerHandle) {
          hideObject(object, restoredVisibility);
        }
      });
      const deskLegs = createDeskLegs();
      deskGroup.add(deskLegs);
      addedObjects.push(deskLegs);
    }

    // 本棚上の植物と一部の本を隠し、収納箱と小さな額へ置き換える。
    if (bookshelfGroup) {
      bookshelfGroup.traverse((object) => {
        if (
          object.name === "studio-bookshelf-top-plant" ||
          object.name === "studio-bookshelf-top-plant-pot" ||
          object.name.startsWith("studio-bookshelf-replaced-book-")
        ) {
          hideObject(object, restoredVisibility);
        }
      });
      const bookshelfDetails = createBookshelfDetails();
      bookshelfGroup.add(bookshelfDetails);
      addedObjects.push(bookshelfDetails);
    }

    // 旧3枚メモを隠し、サイズと角度にばらつきのあるメモへ差し替える。
    if (corkboardGroup) {
      corkboardGroup.traverse((object) => {
        if (object.name.startsWith("studio-corkboard-old-note-")) {
          hideObject(object, restoredVisibility);
        }
      });
      const corkboardDetails = createCorkboardDetails();
      corkboardGroup.add(corkboardDetails);
      addedObjects.push(corkboardDetails);
    }

    return () => {
      // Strict Mode、HMR、Canvas再マウント時に元のシーンへ戻せるよう必ず復元する。
      restoredColors.forEach((color, material) => {
        material.color.copy(color);
        material.needsUpdate = true;
      });
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
