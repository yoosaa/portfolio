export type StudioCameraConfig = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

export const roomCamera = {
  position: [8.8, 6.6, 11.4],
  target: [0, 1.55, 0],
  fov: 36,
} satisfies StudioCameraConfig;
