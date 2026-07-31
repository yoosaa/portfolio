export function WallArtwork() {
  return (
    <group
      name="studio-wall-artwork"
      position={[-4.22, 2.66, -1.43]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <mesh scale={[1.08, 0.88, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#a98d6d" roughness={0.92} />
      </mesh>
      <mesh
        position={[0, 0, 0.08]}
        scale={[0.84, 0.64, 0.07]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#eee2ca" roughness={0.96} />
      </mesh>
      <mesh position={[-0.16, 0.08, 0.125]}>
        <circleGeometry args={[0.18, 20]} />
        <meshStandardMaterial color="#7f9a83" roughness={0.95} />
      </mesh>
      <mesh
        position={[0.17, -0.13, 0.13]}
        rotation={[0, 0, -0.18]}
        scale={[0.3, 0.12, 0.025]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cc8b72" roughness={0.95} />
      </mesh>
    </group>
  );
}
