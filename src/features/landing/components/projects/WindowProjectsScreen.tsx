import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { ProjectsScreen } from "./ProjectsScreen";

type WindowProjectsScreenProps = ComponentProps<typeof ProjectsScreen>;

export function WindowProjectsScreen(props: WindowProjectsScreenProps) {
  return (
    <>
      <ProjectsScreen {...props} entry="from-depth" />
      <div className="window-projects-shutters" aria-hidden="true">
        <motion.div
          className="window-projects-shutter window-projects-shutter-left"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.58, times: [0, 0.32, 1] }}
        />
        <motion.div
          className="window-projects-shutter window-projects-shutter-right"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.58, times: [0, 0.32, 1] }}
        />
      </div>
    </>
  );
}
