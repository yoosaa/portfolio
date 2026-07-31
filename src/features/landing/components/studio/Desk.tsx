import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Box } from "./ScenePrimitives";

type DeskProps = { accent: string; active: boolean; onOpen: () => void };

export function Desk({ accent, active, onOpen }: DeskProps) {
  const [hovered, setHovered] = useState(false);
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const deskLegPositions: Array<[number, number, number]> = [
    [-1.4, 0.54, -0.56],
    [1.34, 0.54, -0.56],
    [-1.4, 0.54, 0.56],
    [1.34, 0.54, 0.56],
  ];
  useFrame((_, delta) => {
    if (screenMaterial.current)
      screenMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        screenMaterial.current.emissiveIntensity,
        active || hovered ? 2.5 : 1.35,
        7,
        delta,
      );
  });
  const handlePointer = (event: ThreeEvent<PointerEvent>, value: boolean) => {
    event.stopPropagation();
    setHovered(value);
    document.body.style.cursor = value ? "pointer" : "default";
  };
  return (
    <group name="studio-desk" position={[1.25, 0, 0.45]}>
      <Box
        position={[0, 1.22, 0]}
        scale={[3.42, 0.3, 1.58]}
        color="#6176bd"
        radius={0.12}
      />
      <group
        position={[0.15, 2.08, -0.25]}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        onPointerOver={(event) => handlePointer(event, true)}
        onPointerOut={(event) => handlePointer(event, false)}
      >
        <Box
          position={[0, 0, 0]}
          scale={[1.82, 1.1, 0.16]}
          color="#607069"
          radius={0.055}
        />
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[1.56, 0.84]} />
          <meshStandardMaterial
            ref={screenMaterial}
            color="#d9e2d3"
            emissive={accent}
            emissiveIntensity={1.35}
            toneMapped={false}
          />
        </mesh>
        <Box
          position={[0, -0.52, 0.08]}
          scale={[1.62, 0.09, 0.07]}
          color="#536159"
          radius={0.018}
        />
        <Box
          position={[0, -0.67, -0.01]}
          scale={[0.18, 0.3, 0.16]}
          color="#77837c"
          radius={0.03}
        />
        <Box
          position={[0, -0.82, 0.1]}
          scale={[0.88, 0.1, 0.5]}
          color="#77837c"
          radius={0.03}
        />
      </group>
      <group position={[0.08, 1.43, 0.45]} rotation={[-0.035, 0, 0]}>
        <Box
          position={[0, 0, 0]}
          scale={[1.28, 0.1, 0.52]}
          color="#d4d0c3"
          radius={0.035}
        />
        {[-0.42, -0.21, 0, 0.21, 0.42].map((x) => (
          <Box
            key={x}
            position={[x, 0.06, -0.04]}
            scale={[0.14, 0.03, 0.29]}
            color="#eee9dc"
            radius={0.008}
          />
        ))}
      </group>
      <group position={[1.32, 1.55, 0.53]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.21, 0.19, 0.4, 20]} />
          <meshStandardMaterial color="#dfd3b8" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.015, 0]}>
          <torusGeometry args={[0.14, 0.032, 10, 20]} />
          <meshStandardMaterial color="#dfd3b8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.205, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.165, 20]} />
          <meshStandardMaterial color="#765441" roughness={0.95} />
        </mesh>
      </group>
      <group position={[-0.95, 1.43, 0.38]} rotation={[0, -0.15, 0]}>
        <Box
          position={[0, 0, 0]}
          scale={[0.7, 0.09, 0.52]}
          color="#d8c6a5"
          radius={0.03}
        />
        <Box
          position={[-0.29, 0.05, 0]}
          scale={[0.04, 0.03, 0.45]}
          color="#a66f5e"
          radius={0.008}
        />
        <mesh position={[0.09, 0.08, 0.03]} rotation={[0, -0.35, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.54, 10]} />
          <meshStandardMaterial color="#6d7f78" roughness={0.82} />
        </mesh>
      </group>
      <group name="studio-light-desk-legs">
        {deskLegPositions.map((position) => (
          <mesh
            key={position.join(",")}
            position={position}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.16, 1.06, 0.16]} />
            <meshStandardMaterial color="#4f5f86" roughness={0.93} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
