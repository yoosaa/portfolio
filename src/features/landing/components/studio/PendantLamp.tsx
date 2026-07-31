import * as THREE from "three";
import { UPPER_MAT_TOP } from "./scene-levels";

export function PendantLamp() {
  return <group position={[3.35, UPPER_MAT_TOP + 3.13, -2.82]}>
    <mesh position={[0, -0.58, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 1.16, 10]} /><meshStandardMaterial color="#6d6258" roughness={0.86} /></mesh>
    <mesh position={[0, -1.25, 0]} rotation={[0, 0, Math.PI]} castShadow><coneGeometry args={[0.4, 0.48, 18, 1, true]} /><meshStandardMaterial color="#9f8170" roughness={0.92} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -1.14, 0]}><sphereGeometry args={[0.11, 12, 8]} /><meshStandardMaterial color="#fff0c7" emissive="#f5cd85" emissiveIntensity={1.2} toneMapped={false} /></mesh>
    <pointLight position={[0, -1.18, 0.18]} color="#f3d19a" intensity={1.4} distance={3.2} decay={2} />
  </group>;
}
