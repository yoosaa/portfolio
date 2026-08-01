import { studioLayout, type StudioTransform } from "../../model/studio-layout";
import { Box } from "./ScenePrimitives";

type BookshelfProps = {
  onOpen: () => void;
  transform?: StudioTransform;
};

export function Bookshelf({
  onOpen,
  transform = studioLayout.bookshelf,
}: BookshelfProps) {
  const bookColors = ["#c78976", "#d3b56f", "#89a28a", "#91a5b7", "#dac79b"];
  const shelfLevels = [0.72, 1.48, 2.24];

  return (
    <group
      name="studio-bookshelf"
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <Box
        position={[0, 1.55, -0.36]}
        scale={[2.02, 2.98, 0.12]}
        color="#70927f"
        radius={0.05}
      />
      <Box
        position={[-1.02, 1.55, 0]}
        scale={[0.2, 3.12, 0.84]}
        color="#5f806f"
        radius={0.05}
      />
      <Box
        position={[1.02, 1.55, 0]}
        scale={[0.2, 3.12, 0.84]}
        color="#5f806f"
        radius={0.05}
      />
      <Box
        position={[0, 3.06, 0]}
        scale={[2.22, 0.2, 0.84]}
        color="#557463"
        radius={0.05}
      />
      <Box
        position={[0, 0.08, 0]}
        scale={[2.22, 0.2, 0.84]}
        color="#557463"
        radius={0.05}
      />
      {shelfLevels.map((y) => (
        <Box
          key={y}
          position={[0, y, 0]}
          scale={[2.02, 0.14, 0.78]}
          color="#4f6c5d"
          radius={0.025}
        />
      ))}
      {Array.from({ length: 12 }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const height = 0.48 + ((index * 7) % 4) * 0.07;
        const width = 0.2 + ((index * 3) % 3) * 0.025;
        const shelfY = shelfLevels[row];
        const isReplacementTarget =
          (row === 0 && column > 1) || (row === 1 && column > 0 && column < 3);

        if (isReplacementTarget) return null;

        return (
          <Box
            key={index}
            position={[-0.68 + column * 0.45, shelfY + height / 2 + 0.08, 0.04]}
            scale={[width, height, 0.46]}
            color={bookColors[index % bookColors.length]}
            rotation={[0, 0, ((index % 3) - 1) * 0.03]}
            radius={0.018}
          />
        );
      })}
      <group name="studio-bookshelf-details">
        <mesh position={[0.45, 1.03, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.48, 0.52]} />
          <meshStandardMaterial color="#c7aa80" roughness={0.95} />
        </mesh>
        <mesh position={[0.45, 1.05, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.12, 0.03]} />
          <meshStandardMaterial color="#eee2ca" roughness={0.96} />
        </mesh>
        <mesh position={[0, 1.82, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.54, 0.12]} />
          <meshStandardMaterial color="#a98d6d" roughness={0.93} />
        </mesh>
        <mesh position={[0, 1.82, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.52, 0.34, 0.08]} />
          <meshStandardMaterial color="#e8ddc7" roughness={0.96} />
        </mesh>
        <mesh
          position={[-0.08, 1.86, 0.155]}
          rotation={[0, 0, 0.16]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.22, 0.1, 0.025]} />
          <meshStandardMaterial color="#7f9a83" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}
