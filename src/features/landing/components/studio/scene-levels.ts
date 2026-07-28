// StudioScene 内で共有する床・マットの高さ基準。
//
// Three.js の Y 軸は高さを表す。
// 家具を床やマットの上へ置くときは、個別に数値を直書きするより
// これらの基準値から位置を計算すると、床構成を変更した際に追従しやすい。

/** 部屋全体のベース床の上面。 */
export const BASE_TOP = -0.01;

/** 手前側の生活エリアの床上面。現在はベース床と同じ高さ。 */
export const LOWER_FLOOR_TOP = BASE_TOP;

/** 本棚・コルクボード側にある上段床の上面。 */
export const UPPER_FLOOR_TOP = 0.88;

/** 各エリアに敷いている色付きマットの厚み。 */
export const MAT_THICKNESS = 0.06;

/** 手前側マットの上面。家具や小物を接地させるときの基準。 */
export const LOWER_MAT_TOP = LOWER_FLOOR_TOP + MAT_THICKNESS;

/** 上段マットの上面。本棚などを接地させるときの基準。 */
export const UPPER_MAT_TOP = UPPER_FLOOR_TOP + MAT_THICKNESS;
