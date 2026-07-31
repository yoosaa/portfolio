import type { StudioSceneProps } from "../../model/studio-scene";
import { Bookshelf } from "./Bookshelf";
import { Corkboard } from "./Corkboard";
import { Desk } from "./Desk";
import { DeskChair } from "./DeskChair";
import { DeskLamp } from "./DeskLamp";
import { FloorBookStack } from "./FloorBookStack";
import { LevelStairs } from "./LevelStairs";
import { PendantLamp } from "./PendantLamp";
import { Plant } from "./Plant";
import { Box, SolidBox } from "./ScenePrimitives";
import { Window } from "./Window";
import { BASE_TOP, LOWER_FLOOR_TOP, LOWER_MAT_TOP, MAT_THICKNESS, UPPER_FLOOR_TOP, UPPER_MAT_TOP } from "./scene-levels";

type RoomProps = Pick<StudioSceneProps, "phase" | "accent" | "projectIndex" | "onOpenProjects" | "onOpenBookshelf" | "onOpenCorkboard" | "onOpenWindow">;

export function Room({ phase, accent, projectIndex, onOpenProjects, onOpenBookshelf, onOpenCorkboard, onOpenWindow }: RoomProps) {
  void projectIndex;
  const upperFloorHeight = UPPER_FLOOR_TOP - BASE_TOP;
  const upperFloorY = (BASE_TOP + UPPER_FLOOR_TOP) / 2;
  return <group>
    <Box position={[0, -0.22, -0.35]} scale={[8.2, 0.42, 7.15]} color="#d8c5a5" radius={0.08} />
    <Box position={[-1.15, LOWER_FLOOR_TOP + MAT_THICKNESS / 2, 0.6]} scale={[4, MAT_THICKNESS, 2.45]} color="#6176bd" radius={0.055} />
    <Box position={[2.7, LOWER_FLOOR_TOP + MAT_THICKNESS / 2, 2.55]} scale={[1.75, MAT_THICKNESS, 0.82]} color="#d8b98d" radius={0.045} />
    <Box position={[-0.65, upperFloorY, -2.55]} scale={[6.9, upperFloorHeight, 2.75]} color="#d8c3a2" radius={0.07} />
    <Box position={[2.6, upperFloorY, -2.25]} scale={[2.55, upperFloorHeight, 2.35]} color="#d8c3a2" radius={0.07} />
    <Box position={[-2.5, UPPER_FLOOR_TOP + MAT_THICKNESS / 2, -2.58]} scale={[2.96, MAT_THICKNESS, 2.3]} color="#7da28b" radius={0.055} />
    <Box position={[2.68, UPPER_FLOOR_TOP + MAT_THICKNESS / 2, -2.38]} scale={[2.18, MAT_THICKNESS, 1.96]} color="#d97d68" radius={0.055} />
    <LevelStairs position={[1.85, 0, -1.05]} fromY={BASE_TOP} toY={UPPER_FLOOR_TOP} stepCount={4} />
    <SolidBox position={[-2.55, 2.29, -3.91]} scale={[3.2, 4.6, 0.24]} color="#b3bba4" /><SolidBox position={[0, 2.29, -3.91]} scale={[2, 4.6, 0.24]} color="#eadbc4" /><SolidBox position={[2.55, 2.29, -3.91]} scale={[3.2, 4.6, 0.24]} color="#d8a08c" /><SolidBox position={[-4.09, 2.29, -2.45]} scale={[0.24, 4.6, 2.96]} color="#aab59e" />
    <SolidBox position={[-4.09, 2.29, -0.79]} scale={[0.24, 4.6, 0.38]} color="#dbc29e" /><SolidBox position={[-4.09, 2.29, 2.44]} scale={[0.24, 4.6, 1.52]} color="#dbc29e" /><SolidBox position={[-4.09, 4.09, 0.55]} scale={[0.24, 1, 2.3]} color="#dbc29e" /><SolidBox position={[-4.36, 2.29, 0.55]} scale={[0.3, 4.6, 2.3]} color="#d4bd9d" /><SolidBox position={[-4.225, 1.84, -0.6]} scale={[0.27, 3.7, 0.14]} color="#cdb393" /><SolidBox position={[-4.225, 1.84, 1.7]} scale={[0.27, 3.7, 0.14]} color="#cdb393" /><SolidBox position={[-4.225, 3.65, 0.55]} scale={[0.27, 0.14, 2.3]} color="#cdb393" />
    <SolidBox position={[-2.55, UPPER_FLOOR_TOP + 0.05, -3.74]} scale={[3.08, 0.18, 0.36]} color="#91a18d" /><SolidBox position={[2.68, UPPER_FLOOR_TOP + 0.05, -3.74]} scale={[2.34, 0.18, 0.36]} color="#c98672" />
    <group position={[-2.35, LOWER_MAT_TOP, 0.1]}><Desk accent={accent} active={phase === "projects"} onOpen={onOpenProjects} /><DeskChair /><DeskLamp /></group>
    <Bookshelf onOpen={onOpenBookshelf} /><Corkboard onOpen={onOpenCorkboard} /><PendantLamp /><Window onOpen={onOpenWindow} /><Plant position={[-4.02, 1.92, 0.95]} scale={0.45} /><Plant position={[-1.42, UPPER_MAT_TOP + 0.36 * 0.78, -2.72]} scale={0.78} /><FloorBookStack /><Plant position={[3.22, LOWER_MAT_TOP + 0.36 * 0.68, 2.62]} scale={0.68} />
    <pointLight position={[0.4, 4.7, 3.2]} color="#f4dfb7" intensity={7.1} distance={10} decay={2} castShadow />
  </group>;
}
