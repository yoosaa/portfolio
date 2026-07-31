import { Box } from "./ScenePrimitives";
import { UPPER_MAT_TOP } from "./scene-levels";

type CorkboardProps = { onOpen: () => void };

export function Corkboard({ onOpen }: CorkboardProps) {
  const notes = [
    {
      position: [-0.52, 0.28, 0.2] as const,
      size: [0.42, 0.58] as const,
      color: "#eee0c4",
      rotation: -0.08,
      pinColor: "#80584b",
    },
    {
      position: [0.02, 0.34, 0.205] as const,
      size: [0.56, 0.38] as const,
      color: "#dfe7dc",
      rotation: 0.05,
      pinColor: "#718474",
    },
    {
      position: [0.52, 0.12, 0.2] as const,
      size: [0.38, 0.52] as const,
      color: "#d8dce6",
      rotation: 0.09,
      pinColor: "#775e54",
    },
    {
      position: [-0.25, -0.3, 0.21] as const,
      size: [0.58, 0.32] as const,
      color: "#e7cfaa",
      rotation: -0.04,
      pinColor: "#806253",
    },
    {
      position: [0.4, -0.34, 0.215] as const,
      size: [0.3, 0.26] as const,
      color: "#ece5d2",
      rotation: 0.08,
      pinColor: "#6f7f72",
    },
  ];

  return (
    <group
      name="studio-corkboard"
      position={[2.15, UPPER_MAT_TOP + 2.1, -3.78]}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <Box
        position={[0, 0, 0]}
        scale={[2.08, 1.58, 0.16]}
        color="#b96d5d"
        radius={0.08}
      />
      <Box
        position={[0, 0, 0.1]}
        scale={[1.78, 1.28, 0.09]}
        color="#d99072"
        radius={0.05}
      />
      <group name="studio-corkboard-details">
        {notes.flatMap(
          ({ position, size, color, rotation, pinColor }, index) => [
            <mesh
              key={`note-${index}`}
              position={position}
              rotation={[0, 0, rotation]}
            >
              <planeGeometry args={size} />
              <meshStandardMaterial color={color} roughness={0.96} />
            </mesh>,
            <mesh
              key={`pin-${index}`}
              position={[
                position[0],
                position[1] + size[1] / 2 - 0.045,
                position[2] + 0.035,
              ]}
              castShadow
            >
              <sphereGeometry args={[0.035, 10, 8]} />
              <meshStandardMaterial color={pinColor} roughness={0.9} />
            </mesh>,
          ],
        )}
      </group>
    </group>
  );
}
