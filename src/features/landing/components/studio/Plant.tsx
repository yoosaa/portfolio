import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

type PlantProps = {
  name?: string;
  position: [number, number, number];
  scale?: number;
};

export function Plant({ name, position, scale = 1 }: PlantProps) {
  const [active, setActive] = useState(false);
  const leaves = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (leaves.current) {
      leaves.current.rotation.z = THREE.MathUtils.damp(
        leaves.current.rotation.z,
        active ? Math.sin(state.clock.elapsedTime * 3.5) * 0.12 : 0,
        6,
        delta,
      );
      leaves.current.scale.y = THREE.MathUtils.damp(
        leaves.current.scale.y,
        active ? 1.12 : 1,
        6,
        delta,
      );
    }
  });
  return (
    <group
      name={name}
      position={position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.72, 12]} />
        <meshStandardMaterial color="#c98f62" roughness={0.94} />
      </mesh>
      <group ref={leaves}>
        {[
          [-0.26, 0.78, 0.05, -0.5],
          [0.25, 0.84, 0, 0.48],
          [-0.08, 1.06, -0.04, -0.12],
          [0.14, 1.2, 0.02, 0.2],
        ].map(([x, y, z, rotation], index) => (
          <mesh
            key={index}
            position={[x, y, z]}
            rotation={[0, 0, rotation]}
            castShadow
          >
            <sphereGeometry args={[0.31, 9, 7]} />
            <meshStandardMaterial
              color={index % 2 === 1 ? "#789878" : "#91a98b"}
              roughness={0.96}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
