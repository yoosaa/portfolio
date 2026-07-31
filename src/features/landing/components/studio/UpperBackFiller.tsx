export function UpperBackFiller() {
  return (
    <group name="studio-upper-back-filler">
      <mesh
        position={[-0.65, 0.435, -3.68]}
        scale={[6.9, 0.89, 0.5]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d8c3a2" roughness={0.93} />
      </mesh>
      <mesh
        position={[2.6, 0.435, -3.43]}
        scale={[2.55, 0.89, 0.5]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d8c3a2" roughness={0.93} />
      </mesh>
      <mesh
        position={[-0.65, 0.865, -3.57]}
        scale={[6.9, 0.05, 0.72]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d8c3a2" roughness={0.93} />
      </mesh>
      <mesh
        position={[2.6, 0.865, -3.3]}
        scale={[2.55, 0.05, 0.7]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d8c3a2" roughness={0.93} />
      </mesh>
    </group>
  );
}
