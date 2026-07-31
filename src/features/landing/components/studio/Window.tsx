import { Box } from "./ScenePrimitives";

type WindowProps = { onOpen: () => void };

export function Window({ onOpen }: WindowProps) {
  return <group position={[-4.28, 2.58, 0.42]} rotation={[0, Math.PI / 2, 0]} onClick={(event) => { event.stopPropagation(); onOpen(); }} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "default")}>
    <Box position={[0, 0, 0]} scale={[1.86, 1.68, 0.16]} color="#d5c09f" radius={0.05} />
    <mesh position={[0, 0, 0.09]}><planeGeometry args={[1.58, 1.36]} /><meshStandardMaterial color="#d5e0d4" emissive="#edf0d9" emissiveIntensity={0.12} roughness={0.72} /></mesh>
    <Box position={[0, 0, 0.14]} scale={[0.08, 1.42, 0.08]} color="#eee5ce" radius={0.018} />
    <Box position={[0, 0, 0.14]} scale={[1.66, 0.08, 0.08]} color="#eee5ce" radius={0.018} />
    <Box position={[0, -0.92, 0.04]} scale={[2.02, 0.18, 0.3]} color="#c8aa7f" radius={0.045} />
  </group>;
}
