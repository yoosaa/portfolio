import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

function roughly(value: number, target: number, epsilon = 0.08) {
  return Math.abs(value - target) < epsilon;
}

function getStandardMaterial(object: THREE.Object3D) {
  if (!(object instanceof THREE.Mesh)) {
    return null;
  }

  const material = Array.isArray(object.material)
    ? object.material[0]
    : object.material;
  return material instanceof THREE.MeshStandardMaterial ? material : null;
}

function hasNamedAncestor(object: THREE.Object3D, name: string) {
  let current: THREE.Object3D | null = object;

  while (current) {
    if (current.name === name) {
      return true;
    }
    current = current.parent;
  }

  return false;
}

export function useWindowSimplification() {
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const restoredVisibility = new Map<THREE.Object3D, boolean>();

    const hideObject = (object: THREE.Object3D) => {
      if (!restoredVisibility.has(object)) {
        restoredVisibility.set(object, object.visible);
      }
      object.visible = false;
    };

    const hideLegacyWindowParts = () => {
      scene.traverse((object) => {
        const material = getStandardMaterial(object);
        const colorHex = material?.color.getHexString();

        const isLegacyGrid =
          colorHex === "eee5ce" && hasNamedAncestor(object, "studio-window");
        const isLegacyWindowBase = colorHex === "c8aa7f";
        const isLegacyWindowPlant =
          object.name === "studio-window-plant" ||
          (!(object instanceof THREE.Mesh) &&
            roughly(object.position.x, -4.02) &&
            roughly(object.position.y, 1.92) &&
            roughly(object.position.z, 0.95));

        if (isLegacyGrid || isLegacyWindowBase || isLegacyWindowPlant) {
          hideObject(object);
        }
      });
    };

    hideLegacyWindowParts();
    const frameId = window.requestAnimationFrame(hideLegacyWindowParts);

    return () => {
      window.cancelAnimationFrame(frameId);
      restoredVisibility.forEach((visible, object) => {
        object.visible = visible;
      });
    };
  }, [scene]);
}
