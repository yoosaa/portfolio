import { Float } from "@react-three/drei";
import { Box } from "./ScenePrimitives";
import { UPPER_MAT_TOP } from "./scene-levels";

type CorkboardProps = { onOpen: () => void };

export function Corkboard({ onOpen }: CorkboardProps) {
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
      {[
        [-0.5, 0.2, "#eee0c4", -0.08],
        [0, -0.18, "#dfe7dc", 0.04],
        [0.5, 0.18, "#d8dce6", 0.09],
      ].map(([x, y, color, rotate], index) => (
        <Float
          key={index}
          speed={1 + index * 0.15}
          floatIntensity={0.025}
          rotationIntensity={0.018}
        >
          <mesh
            name={`studio-corkboard-old-note-${index}`}
            position={[Number(x), Number(y), 0.17]}
            rotation={[0, 0, Number(rotate)]}
          >
            <planeGeometry args={[0.48, 0.62]} />
            <meshStandardMaterial color={String(color)} roughness={0.96} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
