type WindowProps = { onOpen: () => void };

export function Window({ onOpen }: WindowProps) {
  return (
    <group
      name="studio-window"
      position={[-4.28, 2.58, 0.42]}
      rotation={[0, Math.PI / 2, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* Keep the window intentionally simple: glass and outer frame only. */}
      <group name="studio-square-window" position={[0, 0, 0.22]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.08]}>
          <boxGeometry args={[1.12, 1.12, 0.07]} />
          <meshStandardMaterial color="#d7e0d6" roughness={0.78} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.68, 0, 0.17]}>
          <boxGeometry args={[0.16, 1.52, 0.12]} />
          <meshStandardMaterial color="#a77f56" roughness={0.92} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.68, 0, 0.17]}>
          <boxGeometry args={[0.16, 1.52, 0.12]} />
          <meshStandardMaterial color="#a77f56" roughness={0.92} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.68, 0.17]}>
          <boxGeometry args={[1.52, 0.16, 0.12]} />
          <meshStandardMaterial color="#a77f56" roughness={0.92} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.68, 0.17]}>
          <boxGeometry args={[1.52, 0.16, 0.12]} />
          <meshStandardMaterial color="#a77f56" roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}
