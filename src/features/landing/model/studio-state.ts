import { projects } from "../data/projects";

export type StudioPhase =
  | "room"
  | "zooming-to-display"
  | "zooming-to-bookshelf"
  | "zooming-to-corkboard"
  | "zooming-to-window"
  | "projects"
  | "returning-to-room"
  | "bookshelf-projects"
  | "corkboard-projects"
  | "window-projects"
  | "returning-from-bookshelf"
  | "returning-from-corkboard"
  | "returning-from-window";

export type StudioState = {
  phase: StudioPhase;
  projectIndex: number;
  isProjectScreenClosed: boolean;
};

export type StudioEvent =
  | { type: "REQUEST_PROJECTS" }
  | { type: "REQUEST_BOOKSHELF" }
  | { type: "REQUEST_CORKBOARD" }
  | { type: "REQUEST_WINDOW" }
  | { type: "DISPLAY_REACHED" }
  | { type: "BOOKSHELF_REACHED" }
  | { type: "CORKBOARD_REACHED" }
  | { type: "WINDOW_REACHED" }
  | { type: "RETURN_TO_ROOM" }
  | { type: "RETURN_FROM_BOOKSHELF" }
  | { type: "RETURN_FROM_CORKBOARD" }
  | { type: "RETURN_FROM_WINDOW" }
  | { type: "PROJECTS_CLOSED" }
  | { type: "BOOKSHELF_PROJECTS_CLOSED" }
  | { type: "CORKBOARD_PROJECTS_CLOSED" }
  | { type: "WINDOW_PROJECTS_CLOSED" }
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
    case "REQUEST_BOOKSHELF":
      return state.phase === "room"
        ? { ...state, phase: "zooming-to-bookshelf" }
        : state;
    case "REQUEST_CORKBOARD":
      return state.phase === "room"
        ? { ...state, phase: "zooming-to-corkboard" }
        : state;
    case "REQUEST_WINDOW":
      return state.phase === "room"
        ? { ...state, phase: "zooming-to-window" }
        : state;
    case "DISPLAY_REACHED":
      return state.phase === "zooming-to-display"
        ? { ...state, phase: "projects", isProjectScreenClosed: false }
        : state;
    case "BOOKSHELF_REACHED":
      return state.phase === "zooming-to-bookshelf"
        ? { ...state, phase: "bookshelf-projects", isProjectScreenClosed: false }
        : state;
    case "CORKBOARD_REACHED":
      return state.phase === "zooming-to-corkboard"
        ? { ...state, phase: "corkboard-projects", isProjectScreenClosed: false }
        : state;
    case "WINDOW_REACHED":
      return state.phase === "zooming-to-window"
        ? { ...state, phase: "window-projects", isProjectScreenClosed: false }
        : state;
    case "RETURN_TO_ROOM":
      return state.phase === "projects"
        ? { ...state, phase: "returning-to-room", isProjectScreenClosed: false }
        : state;
    case "RETURN_FROM_BOOKSHELF":
      return state.phase === "bookshelf-projects"
        ? { ...state, phase: "returning-from-bookshelf", isProjectScreenClosed: false }
        : state;
    case "RETURN_FROM_CORKBOARD":
      return state.phase === "corkboard-projects"
        ? { ...state, phase: "returning-from-corkboard", isProjectScreenClosed: false }
        : state;
    case "RETURN_FROM_WINDOW":
      return state.phase === "window-projects"
        ? { ...state, phase: "returning-from-window", isProjectScreenClosed: false }
        : state;
    case "PROJECTS_CLOSED":
      return state.phase === "returning-to-room"
        ? { ...state, isProjectScreenClosed: true }
        : state;
    case "BOOKSHELF_PROJECTS_CLOSED":
      return state.phase === "returning-from-bookshelf"
        ? { ...state, isProjectScreenClosed: true }
        : state;
    case "CORKBOARD_PROJECTS_CLOSED":
      return state.phase === "returning-from-corkboard"
        ? { ...state, isProjectScreenClosed: true }
        : state;
    case "WINDOW_PROJECTS_CLOSED":
      return state.phase === "returning-from-window"
        ? { ...state, isProjectScreenClosed: true }
        : state;
    case "ROOM_RESTORED":
      return [
        "returning-to-room",
        "returning-from-bookshelf",
        "returning-from-corkboard",
        "returning-from-window",
      ].includes(state.phase)
        ? { ...state, phase: "room", isProjectScreenClosed: false }
        : state;
    case "NEXT_PROJECT":
      return ["projects", "bookshelf-projects", "corkboard-projects", "window-projects"].includes(
        state.phase
      )
        ? { ...state, projectIndex: (state.projectIndex + 1) % projects.length }
        : state;
    case "PREVIOUS_PROJECT":
      return ["projects", "bookshelf-projects", "corkboard-projects", "window-projects"].includes(
        state.phase
      )
        ? {
            ...state,
            projectIndex: (state.projectIndex - 1 + projects.length) % projects.length,
          }
        : state;
  }
}
