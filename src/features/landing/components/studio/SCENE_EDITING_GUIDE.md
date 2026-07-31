# Studio scene editing guide

3Dトップ画面を安全に編集するための実務メモです。

## 1. 主なファイルと責務

- `../StudioScene.tsx`
  - Canvas内のシーン構成
  - ライト、環境、`Room`、`CameraRig`の組み立て
- `Room.tsx`
  - 家具、小物、クリック対象、ポイントライトの配置
  - PC、本棚、コルクボード、窓のイベント接続
- `RoomStructure.tsx`
  - 床、マット、上段床、階段、壁など静的な部屋構造
- 各家具コンポーネント
  - `Desk.tsx`、`Bookshelf.tsx`、`Corkboard.tsx`、`Window.tsx`など
  - 家具自身の形状とローカル座標
- `CameraRig.tsx`
  - カメラの位置、向き、FOVの補間だけを担当
  - シーン内オブジェクトの探索、非表示、差し替えは行わない
- `../../model/scene-config.ts`
  - 初期表示と各クリック対象のカメラ座標、注視点、FOV、遷移時間
- `scene-levels.ts`
  - 床面、マット上面、上段床などの高さ基準
- `ScenePrimitives.tsx`
  - `Box`と`SolidBox`の共通形状

## 2. 座標系

React Three Fiber / Three.jsでは次の向きで考えます。

- `x`: 左右。プラスで右、マイナスで左
- `y`: 高さ。プラスで上、マイナスで下
- `z`: 奥行き

家具全体を動かす場合は、子パーツを一つずつ動かさず、最も外側の`group`の`position`を変更します。

```tsx
<group position={[x, y, z]}>
```

子要素の`position`は親groupから見たローカル座標です。親と子を同時に動かすと差分を追いにくくなるため、一度の変更ではどちらか一方を優先します。

## 3. 高さの基準

`scene-levels.ts`には次の基準があります。

- `BASE_TOP`: ベース床の上面
- `LOWER_FLOOR_TOP`: 手前エリアの床面
- `UPPER_FLOOR_TOP`: 奥側エリアの床面
- `MAT_THICKNESS`: マットの厚さ
- `LOWER_MAT_TOP`: 手前マットの上面
- `UPPER_MAT_TOP`: 奥側マットの上面

家具を床へ置く場合は、固定値だけでなく`LOWER_MAT_TOP`または`UPPER_MAT_TOP`を基準にします。

`UPPER_FLOOR_TOP`を変更すると、上段床、階段、本棚、コルクボード、上段の植物へ連鎖的に影響します。高さ基準を変えた後は上段全体を確認してください。

## 4. 部屋構造を編集する

床、壁、階段、マットは`RoomStructure.tsx`で編集します。

ここに含まれるもの:

- ベース床
- 青い作業エリアのマット
- 手前右側のベージュマット
- 左右の上段床
- 緑とオレンジの上段マット
- `LevelStairs`
- 背面壁と左壁
- `UpperBackFiller`
- `WindowWallPanel`

部屋の大きな見え方を変える場合は、次の順で確認します。

1. 床と壁のシルエット
2. マットと階段の接続
3. 家具の外側group
4. 初期カメラ
5. ライトと影

見た目維持のリファクタでは、`position`、`scale`、`color`、`radius`、geometryの寸法を変更しません。

## 5. 家具と小物を編集する

`Room.tsx`は、家具やクリック対象を組み立てるcompositionです。

家具自身の形状を変える場合は、対応するコンポーネントを編集します。

- PC・机: `Desk.tsx`
- 椅子: `DeskChair.tsx`
- デスクライト: `DeskLamp.tsx`
- 本棚: `Bookshelf.tsx`
- コルクボード: `Corkboard.tsx`
- 窓: `Window.tsx`
- 植物: `Plant.tsx`
- 本の山: `FloorBookStack.tsx`
- 壁の絵: `WallArtwork.tsx`

家具全体の位置は外側groupで調整し、家具内部の形状調整は子要素で行います。同じ変更で両方を大きく動かさないようにします。

## 6. クリック対象とカメラを同期する

クリック対象を移動した場合は、必ず`scene-config.ts`のカメラ設定も確認します。

### PC

- `DISPLAY_CAMERA_POSITION`
- `DISPLAY_LOOK_AT`
- `DISPLAY_FOV`

### 本棚

- `BOOKSHELF_CAMERA_POSITION`
- `BOOKSHELF_LOOK_AT`
- `BOOKSHELF_FOV`

### コルクボード

- `CORKBOARD_CAMERA_POSITION`
- `CORKBOARD_LOOK_AT`
- `CORKBOARD_FOV`

### 窓

- `WINDOW_CAMERA_POSITION`
- `WINDOW_LOOK_AT`
- `WINDOW_FOV`

位置を調整するときは、先に`LOOK_AT`を対象の中心へ合わせ、その後`CAMERA_POSITION`と`FOV`で距離感を整えます。

## 7. CameraRigの役割

`CameraRig.tsx`はカメラ制御専用です。

担当するもの:

- phase変更時の遷移開始点の保存
- position、quaternion、FOVの補間
- reduced motionへの対応
- 対象到着時のcallback
- 部屋へ戻った際のcallback

担当しないもの:

- 色や寸法によるオブジェクト探索
- `scene.traverse()`を使った見た目補正
- meshの非表示
- 家具や壁の後付け
- geometryやmaterialの生成・dispose

見た目の修正は必ず`RoomStructure.tsx`または各家具コンポーネントへ実装します。

## 8. 階段

`LevelStairs`は`fromY`から`toY`までを`stepCount`で分割します。

主な値:

- `position`: 階段全体の配置
- `fromY`: 最下段の基準
- `toY`: 上段床への接続位置
- `stepCount`: 段数
- `width`: 横幅
- `treadDepth`: 一段の奥行き

変更後は次を確認します。

- 最下段がベース床から浮いていないか
- 最上段が上段床とつながっているか
- 階段が机や上段家具と干渉していないか

## 9. 窓

窓は左壁に沿うため、外側groupが90度回転しています。

```tsx
rotation={[0, Math.PI / 2, 0]}
```

そのため、窓内部のローカル`z`は、画面上では壁から出る・壁へ潜る方向になります。

- 窓全体の移動: `Window.tsx`の外側group
- 窓本体の寸法: `studio-square-window`配下
- 窓周辺の壁: `WindowWallPanel.tsx`
- 窓ズーム: `scene-config.ts`

枠だけ、ガラスだけ、壁パネルだけを大きく動かすと隙間や重なりが起きやすいため、通常表示とズーム表示の両方を確認します。

## 10. geometryとscale

このシーンでは2種類の寸法指定があります。

### ScenePrimitives

```tsx
<Box scale={[width, height, depth]} />
```

`Box`と`SolidBox`では`scale`を実寸に近い値として使用しています。

### 直接meshを書く場合

```tsx
<mesh>
  <boxGeometry args={[width, height, depth]} />
</mesh>
```

直接meshを書くコンポーネントでは、geometryの`args`に寸法を指定している場合があります。見た目維持の移植では、`scale`と`args`を勝手に置き換えません。

## 11. 安全な変更手順

1. 対象コンポーネントと親groupを特定する
2. 対象が`RoomStructure`か家具コンポーネントか判断する
3. 一度の変更目的を一つに絞る
4. 座標、寸法、色を同時に大きく変更しない
5. クリック対象を動かした場合はカメラ設定を確認する
6. `pnpm lint`を実行する
7. `pnpm build`を実行する
8. `git diff`で無関係な変更がないことを確認する
9. Vercel Previewで見た目と操作を確認する

## 12. 目視確認チェックリスト

### 通常表示

- 床や壁に隙間がない
- マットが床から浮いていない
- 家具が床へ沈んでいない
- 影が極端に欠けていない
- 窓周辺に色差や二重描画がない

### 操作

- PCをクリックできる
- 本棚をクリックできる
- コルクボードをクリックできる
- 窓をクリックできる
- 各対象へ正しくズームする
- 戻る操作で初期構図へ復帰する
- カーソル表示が元へ戻る

### コード

- `CameraRig.tsx`へ見た目補正を追加していない
- インタラクションを`RoomStructure.tsx`へ持ち込んでいない
- geometry、material、shadow設定を意図せず変更していない
- 無関係なファイルを変更していない
