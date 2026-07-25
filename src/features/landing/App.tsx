"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useReducer } from "react";
import { deskProjects, getProjectsForPhase } from "./data/projects";
import { LandingHeader } from "./components/layout/LandingHeader";
import { StudioFooter } from "./components/layout/StudioFooter";
import { StudioHint } from "./components/layout/StudioHint";
import { StudioIntro } from "./components/layout/StudioIntro";
import { ProjectsScreen } from "./components/projects/ProjectsScreen";
import { BookshelfProjectsScreen } from "./components/projects/BookshelfProjectsScreen";
import { CorkboardProjectsScreen } from "./components/projects/CorkboardProjectsScreen";
import { WindowProjectsScreen } from "./components/projects/WindowProjectsScreen";
import { initialStudioState, studioReducer } from "./model/studio-state";

const StudioScene = dynamic(
  () => import("./components/StudioScene").then((module) => module.StudioScene),
  {
    ssr: false,
    loading: () => <div className="studio-canvas studio-canvas-loading" />,
  }
);

export default function App() {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);
  const activeProjects = getProjectsForPhase(state.phase);
  const project = activeProjects[state.projectIndex];
  const isProjects = state.phase === "projects";
  const isBookshelfProjects = state.phase === "bookshelf-projects";
  const isCorkboardProjects = state.phase === "corkboard-projects";
  const isWindowProjects = state.phase === "window-projects";
  const cameraPhase =
    state.phase === "returning-to-room" && !state.isProjectScreenClosed
      ? "projects"
      : state.phase === "returning-from-bookshelf" && !state.isProjectScreenClosed
        ? "bookshelf-projects"
      : state.phase === "returning-from-corkboard" && !state.isProjectScreenClosed
        ? "corkboard-projects"
      : state.phase === "returning-from-window" && !state.isProjectScreenClosed
        ? "window-projects"
      : state.phase;

  return (
    <main className="studio-shell">
      <div className="studio-grain" aria-hidden="true" />
      <LandingHeader />

      <section className="studio-stage" aria-label="3D portfolio studio">
        <StudioScene
          phase={state.phase}
          cameraPhase={cameraPhase}
          accent={project.accent}
          projectIndex={state.projectIndex}
          onOpenProjects={() => dispatch({ type: "REQUEST_PROJECTS" })}
          onOpenBookshelf={() => dispatch({ type: "REQUEST_BOOKSHELF" })}
          onOpenCorkboard={() => dispatch({ type: "REQUEST_CORKBOARD" })}
          onOpenWindow={() => dispatch({ type: "REQUEST_WINDOW" })}
          onDisplayReached={() => dispatch({ type: "DISPLAY_REACHED" })}
          onBookshelfReached={() => dispatch({ type: "BOOKSHELF_REACHED" })}
          onCorkboardReached={() => dispatch({ type: "CORKBOARD_REACHED" })}
          onWindowReached={() => dispatch({ type: "WINDOW_REACHED" })}
          onRoomRestored={() => dispatch({ type: "ROOM_RESTORED" })}
        />

        <AnimatePresence
          mode="wait"
          onExitComplete={() =>
            dispatch({
              type:
                state.phase === "returning-from-bookshelf"
                  ? "BOOKSHELF_PROJECTS_CLOSED"
                  : state.phase === "returning-from-corkboard"
                    ? "CORKBOARD_PROJECTS_CLOSED"
                    : state.phase === "returning-from-window"
                      ? "WINDOW_PROJECTS_CLOSED"
                  : "PROJECTS_CLOSED",
            })
          }
        >
          {state.phase === "room" ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <StudioIntro
                onOpenProjects={() => dispatch({ type: "REQUEST_PROJECTS" })}
              />
            </motion.div>
          ) : isProjects ? (
            <ProjectsScreen
              key="projects"
              projects={deskProjects}
              projectIndex={state.projectIndex}
              onReturnToRoom={() => dispatch({ type: "RETURN_TO_ROOM" })}
              onPreviousProject={() => dispatch({ type: "PREVIOUS_PROJECT" })}
              onNextProject={() => dispatch({ type: "NEXT_PROJECT" })}
            />
          ) : isBookshelfProjects ? (
            <BookshelfProjectsScreen
              key="bookshelf-projects"
              projectIndex={state.projectIndex}
              onReturnToRoom={() => dispatch({ type: "RETURN_FROM_BOOKSHELF" })}
              onPreviousProject={() => dispatch({ type: "PREVIOUS_PROJECT" })}
              onNextProject={() => dispatch({ type: "NEXT_PROJECT" })}
            />
          ) : isCorkboardProjects ? (
            <CorkboardProjectsScreen
              key="corkboard-projects"
              projectIndex={state.projectIndex}
              onReturnToRoom={() => dispatch({ type: "RETURN_FROM_CORKBOARD" })}
              onPreviousProject={() => dispatch({ type: "PREVIOUS_PROJECT" })}
              onNextProject={() => dispatch({ type: "NEXT_PROJECT" })}
            />
          ) : isWindowProjects ? (
            <WindowProjectsScreen
              key="window-projects"
              projectIndex={state.projectIndex}
              onReturnToRoom={() => dispatch({ type: "RETURN_FROM_WINDOW" })}
              onPreviousProject={() => dispatch({ type: "PREVIOUS_PROJECT" })}
              onNextProject={() => dispatch({ type: "NEXT_PROJECT" })}
            />
          ) : null}
        </AnimatePresence>

        {state.phase === "room" ? <StudioHint /> : null}
      </section>

      <StudioFooter />
    </main>
  );
}
