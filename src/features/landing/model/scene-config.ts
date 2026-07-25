import * as THREE from "three";

export const ROOM_CAMERA_POSITION = new THREE.Vector3(10.2, 7.6, 13.2);
export const ROOM_LOOK_AT = new THREE.Vector3(0, 1.35, 0);

// The display plane is centred at (1.8, 2.2, 0.365) and faces +Z.
// This places the camera directly in front of the screen instead of beside it.
export const DISPLAY_CAMERA_POSITION = new THREE.Vector3(1.8, 2.2, 1.35);
export const DISPLAY_LOOK_AT = new THREE.Vector3(1.8, 2.2, 0.365);

export const ROOM_FOV = 38;
export const DISPLAY_FOV = 48;
export const CAMERA_POSITION_EPSILON = 0.025;
export const CAMERA_FOV_EPSILON = 0.08;
export const CAMERA_ANGLE_EPSILON = 0.006;
export const CAMERA_TRANSITION_DURATION = 1.68;
