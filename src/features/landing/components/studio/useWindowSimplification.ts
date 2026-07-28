import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

function roughly(value: number, target: number, epsilon = 0.035) {
  return Math.abs(value - target) < epsilon;
}

function matchesScale(
  object: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  epsilon = 0.05
) {
  return (
    roughly(object.scale.x, x, epsilon) &&
    roughly(object.scale.y, y, epsilon) &&
    roughly(object.scale.z, z, epsilon)
  );
}

function getStandardMaterial(object: THREE.Object3D) {
  if (!(object instanceof THREE.Mesh)) {
    return null;
  }

  const material = Array.isArray(object.material) ? object.material[0] : object.material;
  return material instanceof THREE.MeshStandardMaterial ? material : null;
}

export function useWindowSimplification() {
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const restoredVisibility = new Map<THREE.Object3D, boolean>();

    const hideObject = (object: THREE.Object3D) => {
      restoredVisibility.set(object, object.visible);
      object.visible = false;
    };

    scene.traverse((object) => {
      const material = getStandardMaterial(object);
      const colorHex = material?.color.getHexString();

      const isVerticalGrid =
        colorHex === "eee5ce" && matchesScale(object, 0.08, 1.42, 0.08);
      const isHorizontalGrid =
        colorHex === "eee5ce" && matchesScale(object, 1.66, 0.08, 0.08);
      const isWindowBase =
        colorHex === "c8aa7f" && matchesScale(object, 2.02, 0.18, 0.3);

      const isWindowPlant =
        !(object instanceof THREE.Mesh) &&
        roughly(object.position.x, -4.02) &&
        roughly(object.position.y, 1.92) &&
        roughly(object.position.z, 0.95) &&
        matchesScale(object, 0.45, 0.45, 0.45);

      if (isVerticalGrid || isHorizontalGrid || isWindowBase || isWindowPlant) {
        hideObject(object);
      }
    });

    return () => {
      restoredVisibility.forEach((visible, object) => {
        object.visible = visible;
      });
    };
  }, [scene]);
}
