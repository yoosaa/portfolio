"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useReducer } from "react";
import { projects } from "./data/projects";
import { LandingHeader } from "./components/layout/LandingHeader";
import { StudioFooter } from "./components/layout/StudioFooter";
import { StudioHint } from "./components/layout/StudioHint";
import { StudioIntro } from "./components/layout/StudioIntro";
import { ProjectsScreen } from "./components/projects/ProjectsScreen";
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
  const project = projects[state.projectIndex];
  const isProjects = state.phase === "projects";
  const cameraPhase =
    state.phase === "returning-to-room" && !state.isProjectScreenClosed
      ? "projects"
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
          onDisplayReached={() => dispatch({ type: "DISPLAY_REACHED" })}
          onRoomRestored={() => dispatch({ type: "ROOM_RESTORED" })}
        />

        <AnimatePresence
          mode="wait"
          onExitComplete={() => dispatch({ type: "PROJECTS_CLOSED" })}
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
              project={project}
              projectIndex={state.projectIndex}
              projectCount={projects.length}
              onReturnToRoom={() => dispatch({ type: "RETURN_TO_ROOM" })}
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
