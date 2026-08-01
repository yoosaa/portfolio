export type Vector3Tuple = [number, number, number];

export type StudioTransform = {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
};

export type StudioLayout = {
  bookshelf: StudioTransform;
  deskArea: StudioTransform;
};

export type StudioCameraConfig = {
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
};
