import * as THREE from "three";

export const ROOM_CAMERA_POSITION = new THREE.Vector3(8.8, 6.6, 11.4);
export const ROOM_LOOK_AT = new THREE.Vector3(0, 1.55, 0);

// The display plane is centred at (1.8, 2.2, 0.365) and faces +Z.
// This places the camera directly in front of the screen instead of beside it.
export const DISPLAY_CAMERA_POSITION = new THREE.Vector3(1.8, 2.2, 1.35);
export const DISPLAY_LOOK_AT = new THREE.Vector3(1.8, 2.2, 0.365);

// The bookshelf is centred at (-3.25, 1.75, -0.25) and faces +Z.
export const BOOKSHELF_CAMERA_POSITION = new THREE.Vector3(-3.25, 1.8, 3.35);
export const BOOKSHELF_LOOK_AT = new THREE.Vector3(-3.25, 1.75, -0.25);
export const CORKBOARD_CAMERA_POSITION = new THREE.Vector3(-2.25, 2.75, -1.45);
export const CORKBOARD_LOOK_AT = new THREE.Vector3(-4.18, 2.75, -1.45);
export const WINDOW_CAMERA_POSITION = new THREE.Vector3(3.15, 2.65, -2.1);
export const WINDOW_LOOK_AT = new THREE.Vector3(3.15, 2.65, -3.92);

export const ROOM_FOV = 36;
export const DISPLAY_FOV = 48;
export const BOOKSHELF_FOV = 54;
export const CORKBOARD_FOV = 50;
export const WINDOW_FOV = 52;
export const CAMERA_POSITION_EPSILON = 0.025;
export const CAMERA_FOV_EPSILON = 0.08;
export const CAMERA_ANGLE_EPSILON = 0.006;
export const CAMERA_TRANSITION_DURATION = 1.68;
