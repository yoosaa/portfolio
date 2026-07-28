import type { ComponentProps } from "react";
import { bookshelfProjects } from "../../data/projects";
import { ProjectsScreen } from "./ProjectsScreen";

type BookshelfProjectsScreenProps = Omit<ComponentProps<typeof ProjectsScreen>, "projects">;

export function BookshelfProjectsScreen(props: BookshelfProjectsScreenProps) {
  return <ProjectsScreen {...props} projects={bookshelfProjects} entry="from-right" />;
}
