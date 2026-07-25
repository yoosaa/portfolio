import type { ComponentProps } from "react";
import { ProjectsScreen } from "./ProjectsScreen";

type BookshelfProjectsScreenProps = ComponentProps<typeof ProjectsScreen>;

export function BookshelfProjectsScreen(props: BookshelfProjectsScreenProps) {
  return <ProjectsScreen {...props} entry="from-right" />;
}
