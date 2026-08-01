# Studio Editor 運用メモ

## ブランチの役割

### `master`

本番用ブランチ。

含めるもの：

- `studio-layout.ts`
- `studio-camera.ts`
- 通常の3D表示コード
- 本番で必要な設定参照処理

含めないもの：

- `/dev/studio`
- Studio EditorのUI
- `apply` API
- グリッドや軸表示などのデバッグ機能
- ローカルworktreeへ書き込む処理

### `dev`

Studio Editorを動かすための開発用ブランチ。

含めるもの：

- `master`の内容
- `/dev/studio`
- `src/app/api/dev/studio/apply/route.ts`
- 編集UI
- デバッグ表示
- 対象worktreeへの反映機能

`dev`から`master`へ直接PRを作らない。

直接PRを作ると、Studio Editorや`apply` APIまでPRへ含まれるため。

---

## 3D配置を変更するときの流れ

### 1. 本番反映用ブランチを作る

本番コード側のworktreeで、最新の`master`からブランチを作る。

```bash
git switch master
git pull origin master
git switch -c feature/studio-layout-adjust
```

カメラ調整の場合も同様に、`master`から専用ブランチを作る。

```bash
git switch -c feature/studio-camera-adjust
```

### 2. Studio Editorを起動する

`dev`側のworktreeで起動する。

```bash
git switch dev
git pull origin dev
pnpm dev
```

Studio Editor：

```text
http://localhost:3000/dev/studio
```

### 3. 反映先を指定する

`dev`側の`.env.local`で、本番反映用ブランチを開いているworktreeを指定する。

```env
STUDIO_TARGET_WORKTREE=/absolute/path/to/master-worktree
STUDIO_TARGET_BRANCH=feature/studio-layout-adjust
```

環境変数を変更した場合は、開発サーバーを再起動する。

### 4. Studio Editorで調整する

Studio Editor上で配置やカメラを調整し、「対象worktreeへ反映」を押す。

変更内容に応じて、次のファイルだけが更新される。

```text
Bookshelf / Desk Area
→ studio-layout.ts

Camera position / Camera target / FOV
→ studio-camera.ts
```

### 5. 本番反映用worktreeで差分を確認する

```bash
git status
git diff
```

想定外のファイルに差分が出ていないことを確認する。

特に、次のファイルが含まれていないことを確認する。

```text
src/app/dev/studio/
src/app/api/dev/studio/apply/
src/features/landing/editor/
```

### 6. コミットしてPRを作る

```bash
git add src/features/landing/model/studio-layout.ts
git add src/features/landing/model/studio-camera.ts
git commit -m "Adjust studio layout"
git push -u origin feature/studio-layout-adjust
```

PRの向き：

```text
feature/studio-layout-adjust
→ master
```

---

## やってはいけないこと

```text
dev
→ master
```

この向きでPRを作らない。

`dev`にはStudio Editorやローカルファイル書き込みAPIが含まれているため、本番用PRへ混入する。

また、Studio Editorが動いている`dev`のworktree自体を、本番設定の反映先にしない。

---

## 基本方針

```text
dev
= 編集ツールを保持する場所

master
= 本番コード

masterから作ったfeatureブランチ
= Editorで作った変更を本番へ運ぶ場所
```
