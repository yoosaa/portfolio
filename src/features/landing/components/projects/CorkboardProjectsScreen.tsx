import type { ComponentProps } from "react";
import { corkboardProjects } from "../../data/projects";
import { ProjectsScreen } from "./ProjectsScreen";

type CorkboardProjectsScreenProps = Omit<ComponentProps<typeof ProjectsScreen>, "projects">;

export function CorkboardProjectsScreen(props: CorkboardProjectsScreenProps) {
  return <ProjectsScreen {...props} projects={corkboardProjects} entry="from-bottom" />;
}
