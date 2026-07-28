import * as THREE from "three";

/**
 * 3Dシーンのカメラ設定。
 *
 * 各表示には次の3つがセットで対応する。
 * - *_CAMERA_POSITION: カメラ自身を置く座標
 * - *_LOOK_AT: カメラが向く座標
 * - *_FOV: 見える範囲。小さいほど望遠、大きいほど広角
 *
 * オブジェクトをStudioScene.tsx側で移動した場合は、同じ表示名の
 * LOOK_ATも合わせて調整する。POSITIONだけを変えると向きがずれ、
 * LOOK_ATだけを変えると意図しない角度から覗き込む構図になりやすい。
 */

// 部屋全体を見せる初期カメラ。
// xを増やすと画面右側から、yを増やすとより上から、zを増やすと遠くから見る。
export const ROOM_CAMERA_POSITION = new THREE.Vector3(8.8, 6.6, 11.4);
// 初期表示で画面中央に置きたい地点。部屋全体の構図調整ではここも一緒に触る。
export const ROOM_LOOK_AT = new THREE.Vector3(0, 1.55, 0);

// PCディスプレイへ寄ったときのカメラ。
// StudioScene.tsxのDesk内にあるモニターを移動した場合は、POSITIONとLOOK_ATを両方見直す。
export const DISPLAY_CAMERA_POSITION = new THREE.Vector3(-0.95, 2.13, 1.5);
export const DISPLAY_LOOK_AT = new THREE.Vector3(-0.95, 2.13, 0.41);

// 本棚をクリックしたときのカメラ。
// 本棚全体を移動する場合は、Bookshelfのgroup positionとの差分を保って動かすと崩れにくい。
export const BOOKSHELF_CAMERA_POSITION = new THREE.Vector3(-2.9, 2.42, -1.25);
export const BOOKSHELF_LOOK_AT = new THREE.Vector3(-2.9, 2.42, -3.18);

// コルクボードをクリックしたときのカメラ。
export const CORKBOARD_CAMERA_POSITION = new THREE.Vector3(2.15, 3.04, -2.02);
export const CORKBOARD_LOOK_AT = new THREE.Vector3(2.15, 3.04, -3.93);

// 窓をクリックしたときのカメラ。
// 窓は左壁に沿っているため、x方向の前後関係を壊すと壁の裏へ潜りやすい。
export const WINDOW_CAMERA_POSITION = new THREE.Vector3(-2.35, 2.52, 0.42);
export const WINDOW_LOOK_AT = new THREE.Vector3(-4.22, 2.52, 0.42);

// 初期表示は少し望遠寄りにして、アイソメトリック風の歪みを抑えている。
export const ROOM_FOV = 36;
// 個別表示は対象を見やすくするため初期表示より広角。
export const DISPLAY_FOV = 48;
export const BOOKSHELF_FOV = 48;
export const CORKBOARD_FOV = 50;
export const WINDOW_FOV = 52;

// 以下はCameraRigが「目的位置へ到着した」と判断する許容誤差。
// 通常の見た目調整では変更しない。小さくしすぎると遷移完了判定が終わらないことがある。
export const CAMERA_POSITION_EPSILON = 0.025;
export const CAMERA_FOV_EPSILON = 0.08;
export const CAMERA_ANGLE_EPSILON = 0.006;

// カメラ遷移の秒数。大きくするとゆっくり、小さくすると速くなる。
export const CAMERA_TRANSITION_DURATION = 1.68;
