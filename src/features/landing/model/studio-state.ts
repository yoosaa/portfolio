import { projects } from "../data/projects";

export type StudioPhase =
  | "room"
  | "zooming-to-display"
  | "projects"
  | "returning-to-room";

export type StudioState = {
  phase: StudioPhase;
  projectIndex: number;
  isProjectScreenClosed: boolean;
};

export type StudioEvent =
  | { type: "REQUEST_PROJECTS" }
  | { type: "DISPLAY_REACHED" }
  | { type: "RETURN_TO_ROOM" }
  | { type: "PROJECTS_CLOSED" }
  | { type: "ROOM_RESTORED" }
  | { type: "NEXT_PROJECT" }
  | { type: "PREVIOUS_PROJECT" };

export const initialStudioState: StudioState = {
  phase: "room",
  projectIndex: 0,
  isProjectScreenClosed: false,
};

export function studioReducer(
  state: StudioState,
  event: StudioEvent
): StudioState {
  switch (event.type) {
    case "REQUEST_PROJECTS":
      return state.phase === "room"
        ? { ...state, phase: "zooming-to-display" }
        : state;
    case "DISPLAY_REACHED":
      return state.phase === "zooming-to-display"
        ? { ...state, phase: "projects", isProjectScreenClosed: false }
        : state;
    case "RETURN_TO_ROOM":
      return state.phase === "projects"
        ? { ...state, phase: "returning-to-room", isProjectScreenClosed: false }
        : state;
    case "PROJECTS_CLOSED":
      return state.phase === "returning-to-room"
        ? { ...state, isProjectScreenClosed: true }
        : state;
    case "ROOM_RESTORED":
      return state.phase === "returning-to-room"
        ? { ...state, phase: "room", isProjectScreenClosed: false }
        : state;
    case "NEXT_PROJECT":
      return state.phase === "projects"
        ? { ...state, projectIndex: (state.projectIndex + 1) % projects.length }
        : state;
    case "PREVIOUS_PROJECT":
      return state.phase === "projects"
        ? {
            ...state,
            projectIndex: (state.projectIndex - 1 + projects.length) % projects.length,
          }
        : state;
  }
}
