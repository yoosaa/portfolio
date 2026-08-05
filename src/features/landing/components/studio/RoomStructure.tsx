import type { StudioLayout } from "../../model/studio-layout";
import { LevelStairs } from "./LevelStairs";
import { Box, SolidBox } from "./ScenePrimitives";
import {
  BASE_TOP,
  LOWER_FLOOR_TOP,
  MAT_THICKNESS,
  UPPER_FLOOR_TOP,
} from "./scene-levels";

type RoomStructureProps = {
  layout: Pick<
    StudioLayout,
    "upperFloorLeft" | "upperFloorRight" | "stairs" | "backWall"
  >;
};

export function RoomStructure({ layout }: RoomStructureProps) {
  const upperFloorHeight = UPPER_FLOOR_TOP - BASE_TOP;
  const upperFloorY = (BASE_TOP + UPPER_FLOOR_TOP) / 2;
  const upperMatY = UPPER_FLOOR_TOP + MAT_THICKNESS / 2;

  return (
    <>
      <Box
        position={[0, -0.22, -0.35]}
        scale={[8.2, 0.42, 7.15]}
        color="#d8c5a5"
        radius={0.08}
      />
      <Box
        position={[-1.15, LOWER_FLOOR_TOP + MAT_THICKNESS / 2, 0.6]}
        scale={[4, MAT_THICKNESS, 2.45]}
        color="#6176bd"
        radius={0.055}
      />
      <Box
        position={[2.7, LOWER_FLOOR_TOP + MAT_THICKNESS / 2, 2.55]}
        scale={[1.75, MAT_THICKNESS, 0.82]}
        color="#d8b98d"
        radius={0.045}
      />
      <group
        name="studio-upper-floor-left"
        position={layout.upperFloorLeft.position}
        rotation={layout.upperFloorLeft.rotation}
        scale={layout.upperFloorLeft.scale}
      >
        <SolidBox
          position={[0, upperFloorY, 0]}
          scale={[6.9, upperFloorHeight, 2.75]}
          color="#d8c3a2"
        />
        <Box
          position={[-1.85, upperMatY, -0.03]}
          scale={[2.96, MAT_THICKNESS, 2.3]}
          color="#7da28b"
          radius={0.055}
        />
      </group>
      <group
        name="studio-upper-floor-right"
        position={layout.upperFloorRight.position}
        rotation={layout.upperFloorRight.rotation}
        scale={layout.upperFloorRight.scale}
      >
        <SolidBox
          position={[0, upperFloorY, 0]}
          scale={[2.55, upperFloorHeight, 2.72]}
          color="#d8c3a2"
        />
        <Box
          position={[0.08, upperMatY, 0.05]}
          scale={[2.18, MAT_THICKNESS, 1.96]}
          color="#d97d68"
          radius={0.055}
        />
      </group>
      <group
        name="studio-stairs"
        position={layout.stairs.position}
        rotation={layout.stairs.rotation}
        scale={layout.stairs.scale}
      >
        <LevelStairs
          position={[0, 0, 0]}
          fromY={-0.01}
          toY={0.88}
          stepCount={3}
        />
      </group>
      <group
        name="studio-back-wall"
        position={layout.backWall.position}
        rotation={layout.backWall.rotation}
        scale={layout.backWall.scale}
      >
        <SolidBox
          position={[0, 0, 0]}
          scale={[8.3, 4.6, 0.24]}
          color="#e6d8c2"
        />
      </group>
    </>
  );
}
