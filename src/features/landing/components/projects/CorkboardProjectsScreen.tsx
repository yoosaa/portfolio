import type { ComponentProps } from "react";
import { ProjectsScreen } from "./ProjectsScreen";

type CorkboardProjectsScreenProps = ComponentProps<typeof ProjectsScreen>;

export function CorkboardProjectsScreen(props: CorkboardProjectsScreenProps) {
  return <ProjectsScreen {...props} entry="from-bottom" />;
}
