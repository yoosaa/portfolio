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
const BOOK_COLORS = new Set(["c78976", "d3b56f", "89a28a", "91a5b7", "dac79b"]);
const OLD_CORK_NOTE_COLORS = new Set(["eee0c4", "dfe7dc", "d8dce6"]);

function roughly(value: number, target: number, epsilon = 0.035) {
  return Math.abs(value - target) < epsilon;
}

function matchesScale(object: THREE.Object3D, x: number, y: number, z: number, epsilon = 0.05) {
  return (
    roughly(object.scale.x, x, epsilon) &&
    roughly(object.scale.y, y, epsilon) &&
    roughly(object.scale.z, z, epsilon)
  );
}

function getStandardMaterial(object: THREE.Object3D) {
  if (!(object instanceof THREE.Mesh)) return null;
  const material = Array.isArray(object.material) ? object.material[0] : object.material;
  return material instanceof THREE.MeshStandardMaterial ? material : null;
}

function createBoxMesh(scale: [number, number, number], color: string, roughness = 0.93) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...scale),
    new THREE.MeshStandardMaterial({ color, roughness })
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function hideObject(object: THREE.Object3D, restoredVisibility: Map<THREE.Object3D, boolean>) {
  if (!restoredVisibility.has(object)) restoredVisibility.set(object, object.visible);
  object.visible = false;
}

function disposeObjectTree(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => material.dispose());
  });
}

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
    new THREE.MeshStandardMaterial({ color: "#7f9a83", roughness: 0.95 })
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
  const shelf = createBoxMesh([1.76, 0.12, 0.3], "#a85f52", 0.94);
  shelf.position.set(0, -0.92, 0.23);
  const shelfLip = createBoxMesh([1.76, 0.08, 0.1], "#965448", 0.94);
  shelfLip.position.set(0, -0.84, 0.36);

  const notes: Array<{
    position: [number, number, number];
    size: [number, number];
    color: string;
    rotation: number;
    pinColor: string;
  }> = [
    { position: [-0.52, 0.28, 0.2], size: [0.42, 0.58], color: "#eee0c4", rotation: -0.08, pinColor: "#80584b" },
    { position: [0.02, 0.34, 0.205], size: [0.56, 0.38], color: "#dfe7dc", rotation: 0.05, pinColor: "#718474" },
    { position: [0.52, 0.12, 0.2], size: [0.38, 0.52], color: "#d8dce6", rotation: 0.09, pinColor: "#775e54" },
    { position: [-0.25, -0.3, 0.21], size: [0.58, 0.32], color: "#e7cfaa", rotation: -0.04, pinColor: "#806253" },
    { position: [0.4, -0.34, 0.215], size: [0.3, 0.26], color: "#ece5d2", rotation: 0.08, pinColor: "#6f7f72" },
  ];

  notes.forEach(({ position, size, color, rotation, pinColor }) => {
    const note = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshStandardMaterial({ color, roughness: 0.96 })
    );
    note.position.set(...position);
    note.rotation.z = rotation;
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 10, 8),
      new THREE.MeshStandardMaterial({ color: pinColor, roughness: 0.9 })
    );
    pin.position.set(position[0], position[1] + size[1] / 2 - 0.045, position[2] + 0.035);
    pin.castShadow = true;
    details.add(note, pin);
  });

  details.add(shelf, shelfLip);
  return details;
}

function createSquareWindow() {
  const window = new THREE.Group();
  window.name = "studio-square-window";
  window.position.set(0, 0, 0.3);

  const frame = createBoxMesh([1.42, 1.42, 0.12], "#c7ab82", 0.93);
  const glass = createBoxMesh([1.12, 1.12, 0.07], "#d7e0d6", 0.78);
  glass.position.z = 0.08;
  const verticalBar = createBoxMesh([0.08, 1.12, 0.07], "#eee5ce", 0.94);
  verticalBar.position.z = 0.14;
  const horizontalBar = createBoxMesh([1.12, 0.08, 0.07], "#eee5ce", 0.94);
  horizontalBar.position.z = 0.14;

  window.add(frame, glass, verticalBar, horizontalBar);
  return window;
}

function createWindowWallPanel() {
  const panel = createBoxMesh([0.28, 4.6, 2.3], "#e6d8c2", 0.95);
  panel.name = "studio-window-wall-panel";
  panel.position.set(-4.22, 2.29, 0.55);
  return panel;
}

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
    const restoredVisibility = new Map<THREE.Object3D, boolean>();
    const addedObjects: THREE.Object3D[] = [];
    const roomGroupRef: { current: THREE.Object3D | null } = { current: null };
    const pendantGroupRef: { current: THREE.Object3D | null } = { current: null };
    const deskGroupRef: { current: THREE.Object3D | null } = { current: null };
    const bookshelfGroupRef: { current: THREE.Object3D | null } = { current: null };
    const corkboardGroupRef: { current: THREE.Object3D | null } = { current: null };
    const windowGroupRef: { current: THREE.Object3D | null } = { current: null };
    const windowPlantRef: { current: THREE.Object3D | null } = { current: null };

    scene.traverse((object) => {
      const material = getStandardMaterial(object);
      if (material) {
        const colorHex = material.color.getHexString();
        if (WALL_SOURCE_COLORS.has(colorHex)) {
          restoredColors.set(material, material.color.clone());
          material.color.copy(WALL_COLOR);
          material.needsUpdate = true;
        }
        if (colorHex === "6176bd" && matchesScale(object, 3.42, 0.3, 1.58)) deskGroupRef.current = object.parent;
        if (colorHex === "70927f" && matchesScale(object, 2.02, 2.98, 0.12)) bookshelfGroupRef.current = object.parent;
        if (colorHex === "b96d5d" && matchesScale(object, 2.08, 1.58, 0.16)) corkboardGroupRef.current = object.parent;
        if (colorHex === "d5c09f" && matchesScale(object, 1.86, 1.68, 0.16)) windowGroupRef.current = object.parent;
      }

      const { x, y, z } = object.position;
      const isPendantRoot = roughly(x, 3.35, 0.01) && roughly(y, 4.07, 0.03) && roughly(z, -2.82, 0.01);
      const isWindowPlantRoot =
        !(object instanceof THREE.Mesh) &&
        roughly(x, -4.02, 0.02) &&
        roughly(y, 1.92, 0.02) &&
        roughly(z, 0.95, 0.02) &&
        roughly(object.scale.x, 0.45, 0.02);
      if (isPendantRoot) {
        pendantGroupRef.current = object;
        roomGroupRef.current = object.parent;
      }
      if (isWindowPlantRoot) windowPlantRef.current = object;
    });

    if (pendantGroupRef.current) hideObject(pendantGroupRef.current, restoredVisibility);
    if (windowPlantRef.current) hideObject(windowPlantRef.current, restoredVisibility);

    const artwork = createWallArtwork();
    roomGroupRef.current?.add(artwork);
    addedObjects.push(artwork);

    if (windowGroupRef.current) {
      windowGroupRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) hideObject(object, restoredVisibility);
      });
      const squareWindow = createSquareWindow();
      windowGroupRef.current.add(squareWindow);
      addedObjects.push(squareWindow);
      const wallPanel = createWindowWallPanel();
      roomGroupRef.current?.add(wallPanel);
      addedObjects.push(wallPanel);
    }

    if (deskGroupRef.current) {
      deskGroupRef.current.traverse((object) => {
        const material = getStandardMaterial(object);
        if (!material) return;
        const colorHex = material.color.getHexString();
        const isLeftCabinet = colorHex === "4f5f86" && matchesScale(object, 0.25, 1.35, 1.2);
        const isRightCabinet = colorHex === "53668f" && matchesScale(object, 0.66, 1.16, 1.22);
        const isDrawerHandle = colorHex === "7e8cb1" && matchesScale(object, 0.48, 0.1, 0.05);
        if (isLeftCabinet || isRightCabinet || isDrawerHandle) hideObject(object, restoredVisibility);
      });
      const deskLegs = createDeskLegs();
      deskGroupRef.current.add(deskLegs);
      addedObjects.push(deskLegs);
    }

    if (bookshelfGroupRef.current) {
      bookshelfGroupRef.current.traverse((object) => {
        const material = getStandardMaterial(object);
        const { x, y, z } = object.position;
        const isTopPlantGroup = !(object instanceof THREE.Mesh) && roughly(x, 0.58) && roughly(y, 3.5) && roughly(z, 0);
        const isTopPlantPot =
          object instanceof THREE.Mesh &&
          object.geometry instanceof THREE.CylinderGeometry &&
          roughly(x, 0.58) &&
          roughly(y, 3.36) &&
          roughly(z, 0);
        if (isTopPlantGroup || isTopPlantPot) {
          hideObject(object, restoredVisibility);
          return;
        }
        if (!material || !BOOK_COLORS.has(material.color.getHexString()) || !roughly(z, 0.04)) return;
        const isLowerRightBook = y < 1.3 && x > 0;
        const isMiddleCenterBook = y > 1.65 && y < 2.05 && x > -0.4 && x < 0.4;
        if (isLowerRightBook || isMiddleCenterBook) hideObject(object, restoredVisibility);
      });
      const bookshelfDetails = createBookshelfDetails();
      bookshelfGroupRef.current.add(bookshelfDetails);
      addedObjects.push(bookshelfDetails);
    }

    if (corkboardGroupRef.current) {
      corkboardGroupRef.current.traverse((object) => {
        const material = getStandardMaterial(object);
        if (
          object instanceof THREE.Mesh &&
          object.geometry instanceof THREE.PlaneGeometry &&
          material &&
          OLD_CORK_NOTE_COLORS.has(material.color.getHexString())
        ) {
          hideObject(object, restoredVisibility);
        }
      });
      const corkboardDetails = createCorkboardDetails();
      corkboardGroupRef.current.add(corkboardDetails);
      addedObjects.push(corkboardDetails);
    }

    return () => {
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

  // R3F camera transforms are intentionally updated inside its render loop.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((state) => {
    const isDisplayView = phase === "zooming-to-display" || phase === "projects";
    const isBookshelfView = phase === "zooming-to-bookshelf" || phase === "bookshelf-projects";
    const isCorkboardView = phase === "zooming-to-corkboard" || phase === "corkboard-projects";
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
    const progress = prefersReducedMotion ? 1 : Math.min(elapsed / CAMERA_TRANSITION_DURATION, 1);
    const easedProgress = easeDisplayTransition(progress);
    camera.position.lerpVectors(transition.current.position, targetPosition, easedProgress);
    camera.quaternion.slerpQuaternions(
      transition.current.quaternion,
      targetCamera.quaternion,
      easedProgress
    );
    // eslint-disable-next-line react-hooks/immutability
    perspectiveCamera.fov = THREE.MathUtils.lerp(transition.current.fov, targetFov, easedProgress);
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
