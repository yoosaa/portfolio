import { LOWER_MAT_TOP, UPPER_MAT_TOP } from "../components/studio/scene-levels";

export type StudioVector3 = [number, number, number];

export type StudioTransform = {
  position: StudioVector3;
  rotation: StudioVector3;
  scale: StudioVector3;
};

export type StudioLayout = {
  bookshelf: StudioTransform;
  deskArea: StudioTransform;
  upperFloorLeft: StudioTransform;
  upperFloorRight: StudioTransform;
};

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
  upperFloorLeft: {
    position: [-0.65, 0, -2.55],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  upperFloorRight: {
    position: [2.6, 0, -2.43],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
} satisfies StudioLayout;
