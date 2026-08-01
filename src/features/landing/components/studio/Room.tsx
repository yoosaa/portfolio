import { studioLayout } from "../../model/studio-layout";
import type { StudioSceneProps } from "../../model/studio-scene";
import { Bookshelf } from "./Bookshelf";
import { Corkboard } from "./Corkboard";
import { Desk } from "./Desk";
import { DeskChair } from "./DeskChair";
import { DeskLamp } from "./DeskLamp";
import { FloorBookStack } from "./FloorBookStack";
import { Plant } from "./Plant";
import { RoomStructure } from "./RoomStructure";
import { Window } from "./Window";
import { WallArtwork } from "./WallArtwork";
import { LOWER_MAT_TOP, UPPER_MAT_TOP } from "./scene-levels";

type RoomProps = Pick<
  StudioSceneProps,
  | "phase"
  | "accent"
  | "projectIndex"
  | "onOpenProjects"
  | "onOpenBookshelf"
  | "onOpenCorkboard"
  | "onOpenWindow"
>;

export function Room({
  phase,
  accent,
  projectIndex,
  onOpenProjects,
  onOpenBookshelf,
  onOpenCorkboard,
  onOpenWindow,
}: RoomProps) {
  void projectIndex;

  return (
    <group name="studio-room">
      <WallArtwork />
      <RoomStructure />
      <group
        position={studioLayout.deskArea.position}
        rotation={studioLayout.deskArea.rotation}
        scale={studioLayout.deskArea.scale}
      >
        <Desk
          accent={accent}
          active={phase === "projects"}
          onOpen={onOpenProjects}
        />
        <DeskChair />
        <DeskLamp />
      </group>
      <Bookshelf onOpen={onOpenBookshelf} />
      <Corkboard onOpen={onOpenCorkboard} />
      <Window onOpen={onOpenWindow} />
      <Plant
        position={[-1.42, UPPER_MAT_TOP + 0.36 * 0.78, -2.72]}
        scale={0.78}
      />
      <FloorBookStack />
      <Plant
        position={[3.22, LOWER_MAT_TOP + 0.36 * 0.68, 2.62]}
        scale={0.68}
      />
      <pointLight
        position={[0.4, 4.7, 3.2]}
        color="#f4dfb7"
        intensity={7.1}
        distance={10}
        decay={2}
        castShadow
      />
    </group>
  );
}
