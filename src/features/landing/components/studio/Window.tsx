import type { StudioVector3 } from "../../model/studio-layout";

type WindowProps = {
  onOpen: () => void;
  position?: StudioVector3;
  rotation?: StudioVector3;
};

export function Window({
  onOpen,
  position = [-4.28, 2.58, 0.42],
  rotation = [0, Math.PI / 2, 0],
}: WindowProps) {
  return (
    <group
      name="studio-window"
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
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
        <mesh castShadow receiveShadow position={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 1.12, 0.08]} />
          <meshStandardMaterial color="#eee5ce" roughness={0.94} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, 0.2]}>
          <boxGeometry args={[1.12, 0.08, 0.08]} />
          <meshStandardMaterial color="#eee5ce" roughness={0.94} />
        </mesh>
      </group>
    </group>
  );
}
