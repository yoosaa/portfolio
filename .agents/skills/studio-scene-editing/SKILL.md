---
name: studio-scene-editing
description: Safely edit or refactor the React Three Fiber studio scene while preserving layout, camera behavior, interactions, and visual parity.
---

# Studio scene editing

このSkillは、ポートフォリオの3Dスタジオシーンを安全に編集・整理するときに使用します。

## 対象

- `src/features/landing/components/StudioScene.tsx`
- `src/features/landing/components/studio/`
- `src/features/landing/model/scene-config.ts`
- 3Dシーンの見た目、配置、クリック対象、カメラ遷移に関する変更

## 最初に行うこと

1. `src/features/landing/components/studio/SCENE_EDITING_GUIDE.md`を読む
2. 対象コンポーネントと最も外側の親groupを確認する
3. 関連するカメラ設定を`scene-config.ts`で確認する
4. `feature`ブランチで作業していることを確認する
5. 変更前の数値とイベントを記録する

## 責務の境界

- `StudioScene.tsx`: Canvas内のcomposition
- `Room.tsx`: 家具、小物、クリック対象、ライト
- `RoomStructure.tsx`: 床、壁、マット、階段などの静的構造
- 各家具コンポーネント: 家具自身の形状とローカル配置
- `CameraRig.tsx`: カメラ遷移だけ
- `scene-config.ts`: CAMERA_POSITION、LOOK_AT、FOV、遷移設定

`CameraRig.tsx`へシーンの見た目補正を追加してはいけません。

禁止する例:

- `scene.traverse()`で色や寸法からmeshを探す
- 既存meshを`visible = false`で隠す
- CameraRigから家具や壁を後付けする
- CameraRig内でgeometryやmaterialを生成する

見た目の修正は`RoomStructure.tsx`または対象の家具コンポーネントへ実装します。

## 編集ルール

### 家具全体を動かす

最も外側のgroupの`position`を優先して変更します。子パーツを一つずつ移動しません。

### 家具内部を調整する

親groupの位置は維持し、対象の子要素だけを調整します。同じ変更で親と子の両方を大きく動かしません。

### クリック対象を動かす

対象に対応するカメラ設定も確認します。

- PC: `DISPLAY_*`
- 本棚: `BOOKSHELF_*`
- コルクボード: `CORKBOARD_*`
- 窓: `WINDOW_*`

まず`LOOK_AT`を対象中心へ合わせ、その後`CAMERA_POSITION`と`FOV`を調整します。

### 見た目維持リファクタ

以下を完全に保持します。

- JSXの親子関係
- position
- rotation
- scale
- geometry args
- color
- roughness / metalness / emissive
- castShadow / receiveShadow
- name
- onClick / stopPropagation
- pointerイベント

数値を丸めたり、似た値へ置き換えたりしません。

### 窓

窓の外側groupは左壁に沿って90度回転しています。

```tsx
rotation={[0, Math.PI / 2, 0]}
```

窓内部のローカル`z`は、壁から出る・壁へ潜る方向として見えます。窓を変更したら通常表示とズーム表示の両方を確認します。

## 変更の進め方

1. 一度のPRでは目的を一つに絞る
2. 無関係な整理や命名変更を混ぜない
3. 既存のfeature-localな構成を維持する
4. named exportを使用する
5. 過度な共通化を避ける
6. 静的構造へインタラクションを持ち込まない
7. インタラクティブな家具を移動したらカメラ設定も確認する

## 検証

必ず実行します。

```bash
pnpm lint
pnpm build
git diff
```

追加で確認します。

- 変更対象以外の数値が変わっていない
- TypeScriptエラーがない
- 通常表示に隙間、浮き、二重描画がない
- PC、本棚、コルクボード、窓をクリックできる
- 4対象すべてへズームできる
- 戻る操作で初期構図へ復帰する
- Vercel PreviewがReadyになっている

## コミット

作業が完了したら、変更内容に合ったConventional Commitを作成します。

例:

```bash
git commit -m "refactor: extract static room structure"
git commit -m "fix: align bookshelf camera target"
git commit -m "docs: update studio scene guide"
```

報告には以下を含めます。

- 変更ファイル
- 変更した責務または見た目
- 維持した数値・イベント
- lint/build結果
- コミットSHA
- 目視確認が必要な箇所
