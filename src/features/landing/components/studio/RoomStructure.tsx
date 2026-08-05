import { LevelStairs } from "./LevelStairs";
import { Box, SolidBox } from "./ScenePrimitives";
import { WindowWallPanel } from "./WindowWallPanel";
import {
  BASE_TOP,
  LOWER_FLOOR_TOP,
  MAT_THICKNESS,
  UPPER_FLOOR_TOP,
} from "./scene-levels";

export function RoomStructure() {
  const upperFloorHeight = UPPER_FLOOR_TOP - BASE_TOP;
  const upperFloorY = (BASE_TOP + UPPER_FLOOR_TOP) / 2;

  return (
    <>
      <WindowWallPanel />
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
      <SolidBox
        position={[-0.65, upperFloorY, -2.55]}
        scale={[6.9, upperFloorHeight, 2.75]}
        color="#d8c3a2"
      />
      <SolidBox
        position={[2.6, upperFloorY, -2.43]}
        scale={[2.55, upperFloorHeight, 2.72]}
        color="#d8c3a2"
      />
      <Box
        position={[-2.5, UPPER_FLOOR_TOP + MAT_THICKNESS / 2, -2.58]}
        scale={[2.96, MAT_THICKNESS, 2.3]}
        color="#7da28b"
        radius={0.055}
      />
      <Box
        position={[2.68, UPPER_FLOOR_TOP + MAT_THICKNESS / 2, -2.38]}
        scale={[2.18, MAT_THICKNESS, 1.96]}
        color="#d97d68"
        radius={0.055}
      />
      <LevelStairs
        position={[1.85, 0, -1.05]}
        fromY={-0.01}
        toY={0.88}
        stepCount={3}
      />
      <SolidBox
        position={[-2.55, 2.29, -3.91]}
        scale={[3.2, 4.6, 0.24]}
        color="#e6d8c2"
      />
      <SolidBox
        position={[0, 2.29, -3.91]}
        scale={[2, 4.6, 0.24]}
        color="#e6d8c2"
      />
      <SolidBox
        position={[2.55, 2.29, -3.91]}
        scale={[3.2, 4.6, 0.24]}
        color="#e6d8c2"
      />
      <SolidBox
        position={[-4.09, 2.29, -2.45]}
        scale={[0.24, 4.6, 2.96]}
        color="#e6d8c2"
      />
      <SolidBox
        position={[-4.09, 2.29, -0.79]}
        scale={[0.24, 4.6, 0.38]}
        color="#e6d8c2"
      />
      <SolidBox
        position={[-4.09, 2.29, 2.44]}
        scale={[0.24, 4.6, 1.52]}
        color="#e6d8c2"
      />
      <SolidBox
        position={[-4.09, 4.09, 0.55]}
        scale={[0.24, 1, 2.3]}
        color="#e6d8c2"
      />
    </>
  );
}
