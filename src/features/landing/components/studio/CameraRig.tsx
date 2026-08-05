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

export type MobileViewport = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CameraRigProps = {
  phase: StudioPhase;
  isMobile: boolean;
  mobileViewport: MobileViewport | null;
  onDisplayReached: () => void;
  onBookshelfReached: () => void;
  onCorkboardReached: () => void;
  onWindowReached: () => void;
  onRoomRestored: () => void;
};

type CameraTransition = {
  phase: StudioPhase;
  startedAt: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  fov: number;
  viewport: MobileViewport | null;
};

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

function interpolateViewport(
  from: MobileViewport,
  to: MobileViewport,
  progress: number,
): MobileViewport {
  return {
    left: THREE.MathUtils.lerp(from.left, to.left, progress),
    top: THREE.MathUtils.lerp(from.top, to.top, progress),
    width: THREE.MathUtils.lerp(from.width, to.width, progress),
    height: THREE.MathUtils.lerp(from.height, to.height, progress),
  };
}

function phaseUsesExpandedViewport(phase: StudioPhase) {
  return [
    "zooming-to-display",
    "projects",
    "zooming-to-bookshelf",
    "bookshelf-projects",
    "zooming-to-corkboard",
    "corkboard-projects",
    "zooming-to-window",
    "window-projects",
  ].includes(phase);
}

export function CameraRig({
  phase,
  isMobile,
  mobileViewport,
  onDisplayReached,
  onBookshelfReached,
  onCorkboardReached,
  onWindowReached,
  onRoomRestored,
}: CameraRigProps) {
  const { camera } = useThree();
  const targetCamera = useMemo(() => new THREE.PerspectiveCamera(), []);
  const settledPhase = useRef<StudioPhase | null>(null);
  const transition = useRef<CameraTransition | null>(null);
  const currentViewport = useRef<MobileViewport | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    settledPhase.current = null;
  }, [phase]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

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
    const fullViewport: MobileViewport = {
      left: 0,
      top: 0,
      width: state.size.width,
      height: state.size.height,
    };
    const targetViewport =
      isMobile && mobileViewport && !phaseUsesExpandedViewport(phase)
        ? mobileViewport
        : fullViewport;

    if (!transition.current || transition.current.phase !== phase) {
      transition.current = {
        phase,
        startedAt: state.clock.elapsedTime,
        position: camera.position.clone(),
        quaternion: camera.quaternion.clone(),
        fov: perspectiveCamera.fov,
        viewport: currentViewport.current
          ? { ...currentViewport.current }
          : isMobile && mobileViewport
            ? { ...mobileViewport }
            : { ...fullViewport },
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
    perspectiveCamera.fov = THREE.MathUtils.lerp(
      transition.current.fov,
      targetFov,
      easedProgress,
    );

    if (isMobile && transition.current.viewport) {
      const viewport = interpolateViewport(
        transition.current.viewport,
        targetViewport,
        easedProgress,
      );
      currentViewport.current = viewport;

      perspectiveCamera.aspect = viewport.width / viewport.height;
      perspectiveCamera.setViewOffset(
        viewport.width,
        viewport.height,
        0,
        -viewport.top,
        state.size.width,
        state.size.height,
      );
    } else {
      currentViewport.current = null;
      perspectiveCamera.clearViewOffset();
      perspectiveCamera.aspect = state.size.width / state.size.height;
    }
    perspectiveCamera.updateProjectionMatrix();

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
