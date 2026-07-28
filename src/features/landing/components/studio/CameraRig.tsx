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

const WALL_SOURCE_COLORS = new Set(["b3bba4", "eadbc4", "d8a08c", "aab59e", "dbc29e"]);
const WALL_COLOR = new THREE.Color("#e6d8c2");

function createWallArtwork() {
  const artwork = new THREE.Group();
  artwork.name = "studio-wall-artwork";
  artwork.position.set(-4.22, 2.66, -1.43);
  artwork.rotation.set(0, Math.PI / 2, 0);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: "#a98d6d",
    roughness: 0.92,
  });
  const canvasMaterial = new THREE.MeshStandardMaterial({
    color: "#eee2ca",
    roughness: 0.96,
  });
  const shapeMaterial = new THREE.MeshStandardMaterial({
    color: "#7f9a83",
    roughness: 0.95,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: "#cc8b72",
    roughness: 0.95,
  });

  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.88, 0.12), frameMaterial);
  frame.castShadow = true;
  frame.receiveShadow = true;

  const canvas = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.64, 0.07), canvasMaterial);
  canvas.position.z = 0.08;

  const shape = new THREE.Mesh(new THREE.CircleGeometry(0.18, 20), shapeMaterial);
  shape.position.set(-0.16, 0.08, 0.125);

  const accent = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.025), accentMaterial);
  accent.position.set(0.17, -0.13, 0.13);
  accent.rotation.z = -0.18;

  artwork.add(frame, canvas, shape, accent);
  return artwork;
}

function easeDisplayTransition(progress: number) {
  if (progress <= 0 || progress >= 1) {
    return progress <= 0 ? 0 : 1;
  }

  const sampleCurve = (time: number, point1: number, point2: number) =>
    3 * (1 - time) * (1 - time) * time * point1 +
    3 * (1 - time) * time * time * point2 +
    time * time * time;
  let lower = 0;
  let upper = 1;

  for (let index = 0; index < 14; index += 1) {
    const time = (lower + upper) / 2;
    if (sampleCurve(time, 0.16, 0.3) < progress) {
      lower = time;
    } else {
      upper = time;
    }
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
  const transition = useRef<{
    phase: StudioPhase;
    startedAt: number;
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    fov: number;
  } | null>(null);
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

  useEffect(() => {
    const restoredColors = new Map<THREE.MeshStandardMaterial, THREE.Color>();
    const roomGroupRef: { current: THREE.Object3D | null } = { current: null };
    const pendantGroupRef: { current: THREE.Object3D | null } = { current: null };

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (!(material instanceof THREE.MeshStandardMaterial)) {
            return;
          }

          const colorHex = material.color.getHexString();
          if (!WALL_SOURCE_COLORS.has(colorHex)) {
            return;
          }

          restoredColors.set(material, material.color.clone());
          material.color.copy(WALL_COLOR);
          material.needsUpdate = true;
        });
      }

      const { x, y, z } = object.position;
      const isPendantRoot =
        Math.abs(x - 3.35) < 0.01 &&
        Math.abs(y - 4.07) < 0.03 &&
        Math.abs(z + 2.82) < 0.01;

      if (isPendantRoot) {
        pendantGroupRef.current = object;
        roomGroupRef.current = object.parent;
      }
    });

    const pendantGroup = pendantGroupRef.current;
    const roomGroup = roomGroupRef.current;

    if (pendantGroup) {
      pendantGroup.visible = false;
    }

    const artwork = createWallArtwork();
    roomGroup?.add(artwork);

    return () => {
      restoredColors.forEach((color, material) => {
        material.color.copy(color);
        material.needsUpdate = true;
      });

      if (pendantGroup) {
        pendantGroup.visible = true;
      }

      artwork.removeFromParent();
      artwork.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
    };
  }, [scene]);

  // R3F camera transforms are intentionally updated inside its render loop.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((state) => {
    const isDisplayView = phase === "zooming-to-display" || phase === "projects";
    const isBookshelfView =
      phase === "zooming-to-bookshelf" || phase === "bookshelf-projects";
    const isCorkboardView =
      phase === "zooming-to-corkboard" || phase === "corkboard-projects";
    const isWindowView = phase === "zooming-to-window" || phase === "window-projects";
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

    camera.position.lerpVectors(transition.current.position, targetPosition, easedProgress);
    camera.quaternion.slerpQuaternions(
      transition.current.quaternion,
      targetCamera.quaternion,
      easedProgress
    );
    // eslint-disable-next-line react-hooks/immutability
    perspectiveCamera.fov = THREE.MathUtils.lerp(
      transition.current.fov,
      targetFov,
      easedProgress
    );
    perspectiveCamera.updateProjectionMatrix();

    const hasReachedTarget =
      camera.position.distanceTo(targetPosition) < CAMERA_POSITION_EPSILON &&
      Math.abs(perspectiveCamera.fov - targetFov) < CAMERA_FOV_EPSILON &&
      camera.quaternion.angleTo(targetCamera.quaternion) < CAMERA_ANGLE_EPSILON;

    if (!hasReachedTarget || settledPhase.current === phase) {
      return;
    }

    settledPhase.current = phase;
    if (phase === "zooming-to-display") {
      onDisplayReached();
    }
    if (phase === "zooming-to-bookshelf") {
      onBookshelfReached();
    }
    if (phase === "zooming-to-corkboard") {
      onCorkboardReached();
    }
    if (phase === "zooming-to-window") {
      onWindowReached();
    }
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
