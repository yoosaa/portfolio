import { Box } from "./ScenePrimitives";
import { UPPER_MAT_TOP } from "./scene-levels";

type BookshelfProps = { onOpen: () => void };

export function Bookshelf({ onOpen }: BookshelfProps) {
  const bookColors = ["#c78976", "#d3b56f", "#89a28a", "#91a5b7", "#dac79b"];
  const shelfLevels = [0.72, 1.48, 2.24];
  return (
    <group
      position={[-2.9, UPPER_MAT_TOP - 0.07, -3.18]}
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
      <mesh position={[0.58, 3.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.23, 0.19, 0.34, 12]} />
        <meshStandardMaterial color="#d6a073" roughness={0.94} />
      </mesh>
      <group position={[0.58, 3.5, 0]}>
        {[-0.18, 0, 0.18].map((x, index) => (
          <mesh
            key={x}
            position={[x, 0.16 + index * 0.05, 0]}
            rotation={[0, 0, (index - 1) * 0.45]}
            castShadow
          >
            <sphereGeometry args={[0.2, 8, 6]} />
            <meshStandardMaterial
              color={index === 1 ? "#759174" : "#89a187"}
              roughness={0.96}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
