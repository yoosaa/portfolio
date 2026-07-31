export function WindowWallPanel() {
  return (
    <mesh
      name="studio-window-wall-panel"
      position={[-4.075, 2.29, 0.55]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.25, 4.62, 2.42]} />
      <meshStandardMaterial color="#e6d8c2" roughness={0.95} />
    </mesh>
  );
}
