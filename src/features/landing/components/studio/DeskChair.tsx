import { Box } from "./ScenePrimitives";

export function DeskChair() {
  const casters: Array<[number, number, number]> = [
    [-0.42, 0.08, 0], [0.42, 0.08, 0], [0, 0.08, -0.38], [0, 0.08, 0.38],
  ];

  return <group position={[1.4, 0.1, 1.78]} rotation={[0, 0.03, 0]}>
    <Box position={[0, 0.64, 0]} scale={[0.9, 0.2, 0.76]} color="#344267" radius={0.14} />
    <Box position={[0, 1.1, 0.31]} scale={[0.8, 0.74, 0.2]} rotation={[-0.08, 0, 0]} color="#40517c" radius={0.14} />
    <Box position={[0, 0.35, 0]} scale={[0.12, 0.52, 0.12]} color="#74757b" radius={0.04} />
    <Box position={[0, 0.16, 0]} scale={[0.84, 0.08, 0.1]} color="#74757b" radius={0.025} />
    <Box position={[0, 0.16, 0]} scale={[0.1, 0.08, 0.76]} color="#74757b" radius={0.025} />
    {casters.map((position, index) => <mesh key={index} position={position} castShadow><sphereGeometry args={[0.09, 10, 8]} /><meshStandardMaterial color="#555760" roughness={0.92} /></mesh>)}
  </group>;
}
