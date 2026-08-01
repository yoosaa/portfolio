import { LOWER_MAT_TOP, UPPER_MAT_TOP } from "../components/studio/scene-levels";
import type { StudioLayout } from "./studio-layout.types";

export const studioLayout = {
  bookshelf: {
    position: [-2.9, UPPER_MAT_TOP - 0.07, -3.18],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  deskArea: {
    position: [-2.35, LOWER_MAT_TOP, 0.1],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
} satisfies StudioLayout;
