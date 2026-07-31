import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Box } from "./ScenePrimitives";

export function DeskLamp() {
  const [active, setActive] = useState(false);
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, active ? 6 : 0.45, 8, delta);
    if (bulb.current) bulb.current.emissiveIntensity = THREE.MathUtils.damp(bulb.current.emissiveIntensity, active ? 2.8 : 0.3, 8, delta);
  });
  return <group position={[2.58, 1.38, 0.38]} onClick={(event) => { event.stopPropagation(); setActive((value) => !value); }} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "default")}>
    <Box position={[0, 0, 0]} scale={[0.56, 0.1, 0.4]} color="#4f5f86" radius={0.05} />
    <Box position={[0, 0.4, 0]} scale={[0.09, 0.76, 0.09]} color="#5e72b4" radius={0.025} />
    <mesh position={[0.18, 0.75, 0]} rotation={[0, 0, -0.55]}><coneGeometry args={[0.31, 0.35, 16, 1, true]} /><meshStandardMaterial color="#d8b477" roughness={0.92} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.18, 0.66, 0]}><sphereGeometry args={[0.1, 12, 8]} /><meshStandardMaterial ref={bulb} color="#fff4ce" emissive="#f7d693" emissiveIntensity={0.3} toneMapped={false} /></mesh>
    <pointLight ref={light} position={[0.18, 0.58, 0.32]} color="#f5d9a8" intensity={0.45} distance={3.2} />
  </group>;
}
