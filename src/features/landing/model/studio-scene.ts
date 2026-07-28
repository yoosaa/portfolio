import type { StudioPhase } from "./studio-state";

export type StudioSceneProps = {
  phase: StudioPhase;
  cameraPhase: StudioPhase;
  accent: string;
  projectIndex: number;
  onOpenProjects: () => void;
  onOpenBookshelf: () => void;
  onOpenCorkboard: () => void;
  onOpenWindow: () => void;
  onDisplayReached: () => void;
  onBookshelfReached: () => void;
  onCorkboardReached: () => void;
  onWindowReached: () => void;
  onRoomRestored: () => void;
};
