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
  isMobile: boolean;
  onDisplayReached: () => void;
  onBookshelfReached: () => void;
  onCorkboardReached: () => void;
  onWindowReached: () => void;
  onRoomRestored: () => void;
};

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
  isMobile,
  onDisplayReached,
  onBookshelfReached,
  onCorkboardReached,
  onWindowReached,
  onRoomRestored,
}: CameraRigProps) {
  const { camera } = useThree();
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

    if (!isMobile) {
      // eslint-disable-next-line react-hooks/immutability
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        transition.current.fov,
        targetFov,
        easedProgress,
      );
      perspectiveCamera.updateProjectionMatrix();
    }

    // 位置・FOV・角度の3条件が揃った時点で、画面側へ「到着」を通知する。
    const hasReachedTarget =
      camera.position.distanceTo(targetPosition) < CAMERA_POSITION_EPSILON &&
      (isMobile ||
        Math.abs(perspectiveCamera.fov - targetFov) < CAMERA_FOV_EPSILON) &&
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
