import type { StudioPhase } from "./studio-state";

export type StudioSceneProps = {
  phase: StudioPhase;
  cameraPhase: StudioPhase;
  accent: string;
  projectIndex: number;
  onOpenProjects: () => void;
  onDisplayReached: () => void;
  onRoomRestored: () => void;
};
