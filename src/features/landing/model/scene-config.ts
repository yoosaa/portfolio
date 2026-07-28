import * as THREE from "three";

export const ROOM_CAMERA_POSITION = new THREE.Vector3(8.8, 6.6, 11.4);
export const ROOM_LOOK_AT = new THREE.Vector3(0, 1.55, 0);

export const DISPLAY_CAMERA_POSITION = new THREE.Vector3(-0.95, 2.13, 1.5);
export const DISPLAY_LOOK_AT = new THREE.Vector3(-0.95, 2.13, 0.41);

export const BOOKSHELF_CAMERA_POSITION = new THREE.Vector3(-2.9, 2.42, -1.25);
export const BOOKSHELF_LOOK_AT = new THREE.Vector3(-2.9, 2.42, -3.18);

export const CORKBOARD_CAMERA_POSITION = new THREE.Vector3(2.15, 3.04, -2.02);
export const CORKBOARD_LOOK_AT = new THREE.Vector3(2.15, 3.04, -3.93);

export const WINDOW_CAMERA_POSITION = new THREE.Vector3(-2.35, 2.52, 0.42);
export const WINDOW_LOOK_AT = new THREE.Vector3(-4.22, 2.52, 0.42);

export const ROOM_FOV = 36;
export const DISPLAY_FOV = 48;
export const BOOKSHELF_FOV = 48;
export const CORKBOARD_FOV = 50;
export const WINDOW_FOV = 52;
export const CAMERA_POSITION_EPSILON = 0.025;
export const CAMERA_FOV_EPSILON = 0.08;
export const CAMERA_ANGLE_EPSILON = 0.006;
export const CAMERA_TRANSITION_DURATION = 1.68;
