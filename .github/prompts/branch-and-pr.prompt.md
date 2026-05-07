---
agent: 'agent'
description: 'feature ブランチを切り出して develop ブランチへの PR を作成する'
---

# ブランチ・PR 作成

## 操作可能範囲（明確化）

```
✅ 操作可能:
  - git ブランチの作成（feature/, fix/, など）
  - git コミット（Conventional Commits 形式）
  - GitHub PR の作成（develop へのマージ）
  - .git/ 配下の操作

🔍 参照のみ（変更禁止）:
  - アプリ本体コード（utils/, components/, など）
  - テストコード（test/, e2e/）
  - ドキュメント（docs/）
  - 設定ファイル（tsconfig.json, package.json など）
```

---

## 実行前チェック（必須）

以下をすべて満たす場合のみ ブランチ・PR 作成を開始してください。

### 1. ブランチの最新化確認

```bash
git pull origin develop
```

最新の変更を取得し、ローカルブランチがズレていないか確認してください。

### 2. 変更ファイルの存在確認

```bash
git status
```

以下を確認：

- `Changes not staged for commit` や `Untracked files` が存在するか
- ステージ済み変更がある場合は、対象ファイルを明確にしてください

### 3. ブランチ・PR 作成前の確認テスト（チェックリスト形式）

**⚠️ ステップ 0-3 の自動分析後、以下を確認してください。**

```
【自動提案の確認】
□ 推奨ブランチ名を承認、または修正入力しましたか？
□ 推奨 PR タイトルを承認、または修正入力しましたか？
□ 推奨 PR 説明テンプレートを確認・補足しましたか？

【最終確認】
□ コミット前に git status で変更ファイルをもう一度確認しましたか？
□ ブランチ名・コミットメッセージ・PR 説明が明確ですか？

➡️ 全てにチェック・説明できた場合のみ「ブランチ・PR 作成」にすすむ
```

---

## 変更内容の自動分析（ユーザー入力前に自動実行）

以下のコマンドを実行し、変更内容から**ブランチ名・コミットメッセージ・PR 説明を自動提案**します。

### ステップ 0-1: 変更ファイルの取得と分析

```bash
git diff develop --name-only
```

**変更ファイルから以下を推測**:

- 対象ファイルが `utils/` → scope は `teamBalancer`, `player`, `rank`, `role` など
- 対象ファイルが `components/` → scope は `ui`, または コンポーネント名（`PlayerCard` など）
- 対象ファイルが `pages/api/` → scope は `api`
- 対象ファイルが `test/` または `e2e/` → `refactor` or `test` type
- 対象ファイルが `docs/` → `docs` type

### ステップ 0-2: 変更内容の詳細確認

```bash
git diff develop
```

変更行数・追加・削除から以下を推測：

- **小規模変更**（<50行）→ `fix` or `refactor` 候補
- **中規模変更**（50-200行）→ `feat` or `refactor` 候補
- **大規模変更**（>200行）→ `feat` 候補（複数ファイル跨る場合）

### ステップ 0-3: 自動提案（提案内容をユーザーが選択・修正）

**以下の提案を表示し、ユーザーが選択・編集を行います：**

```
🤖 自動分析結果（変更内容から推測）

【推測されたファイル情報】
- 変更ファイル: [リスト]
- 対象領域(scope): [推測]
- 変更行数: [count]

【推奨ブランチ名】
- 候補A: [推奨1]
- 候補B: [推奨2]
➡️ ユーザーが上記から選択、または自由入力

【推奨 PR タイトル（Conventional Commits 形式）】
- 候補A: type(scope): [推奨1]
- 候補B: type(scope): [推奨2]
➡️ ユーザーが上記から選択、または自由入力

【推奨 PR 説明テンプレート】
## 背景・目的
[変更ファイルから推測した目的]

## 変更内容
[git diff から抽出した変更サマリー]
- ファイル1: [変更概要]
- ファイル2: [変更概要]

## テスト方法
推奨テストコマンド:
- npm run format
- npm run typecheck
- npm run test
- npm run test:e2e

## チェックリスト
- [ ] ローカルで npm run format / npm run typecheck / npm run test が成功
- [ ] E2E テストが成功（npm run test:e2e）
- [ ] PR タイトルが Conventional Commits 形式
- [ ] 関連ドキュメントが更新されている（必要に応じて）

➡️ 上記テンプレートをベースに、ユーザーが補足・修正
```

---

## ブランチ・PR 作成の流れ

### ステップ 1: 新規ブランチ作成

**⚠️ ステップ 0-3 の自動提案で決定した「ブランチ名」を使用してください。**

```bash
git checkout develop
git pull origin develop
git checkout -b [自動提案のブランチ名 or ユーザーが修正したブランチ名]
```

例（自動提案の結果に従う場合）:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/match-history-redis
```

### ステップ 2: コミットメッセージの確認

**⚠️ ステップ 0-3 の自動提案コミットメッセージ を使用 or 修正してください。**

コミットメッセージが **Conventional Commits** 形式に従っていることを確認：

```
feat(scope): description
^^^^^       ^^^^^^ ^^^^^^^^^^^
type        scope  説明（72文字以内）

[body（必要に応じて）]

[footer（BREAKING CHANGE など）]
```

例（自動提案の結果を使用）:

```
feat(redis): add match history persistence with Redis
```

**Type の種類**:

- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント
- `chore`: 設定・ビルド変更
- `test`: テスト追加・修正

**Scope の例**:

- `player`, `team`, `api`, `ui`, `e2e` など対象領域を明記

### ステップ 3: リモートへプッシュ

```bash
git push origin [ステップ1で作成したブランチ名]
```

### ステップ 4: GitHub PR 作成

**⚠️ ステップ 0-3 の自動提案をベースに PR を作成してください。**

**PR 作成時に以下を設定してください：**

- **Head**: ステップ 1 で作成したブランチ（例: `feature/match-history-redis`）
- **Base**: `develop`（固定）
- **Title**: 自動提案の PR タイトル（Conventional Commits 形式）
  - 例: `feat(redis): add match history persistence with Redis`
- **Description**: 以下を参考に、自動提案テンプレートを補足・修正

```markdown
## 背景・目的

[自動提案の背景 + ユーザーが補足]

## 変更内容

- [変更点1（自動抽出）]
- [変更点2（自動抽出）]
- [ユーザーが追加補足があれば記載]

## テスト方法

実行済みテスト（要確認）:

- [ ] npm run format — ✅ 成功 / ❌ 失敗
- [ ] npm run typecheck — ✅ 成功 / ❌ 失敗
- [ ] npm run test — ✅ 成功 / ❌ 失敗
- [ ] npm run test:e2e — ✅ 成功 / ❌ 失敗

## チェックリスト

- [ ] ローカルで `npm run format` / `npm run typecheck` / `npm run test` が成功
- [ ] E2E テストが成功（`npm run test:e2e`）
- [ ] PR タイトルが Conventional Commits 形式
- [ ] 関連ドキュメントが更新されている（必要に応じて）
```

---

## ブランチ・PR 作成時の選択肢（意思決定）

### PR の種類の確認

```
📋 このPRはどのタイプですか？（◎は推奨）

◎ A) 新機能（feat）
   - 新しい機能を追加
   - コミット: feat(scope): [機能説明]

B) バグ修正（fix）
   - 既存バグを修正
   - コミット: fix(scope): [バグ説明]

C) リファクタリング（refactor）
   - 機能は変わらないが、内部構造を改善
   - コミット: refactor(scope): [改善内容]

D) ドキュメント（docs）
   - ドキュメントのみ更新
   - コミット: docs(scope): [更新内容]

E) その他（chore）
   - 設定・ビルド・テストの変更
   - コミット: chore(scope): [変更内容]
```

### PR レビュー設定の確認

```
📋 PR レビュー時のポイントは何ですか？（複数選択可、フリーテキスト）

例:
- 型安全性の確認（TypeScript strict mode）
- テストカバレッジ
- API 互換性
- E2E テストの成功
- ドキュメントの正確性
```

---

## このプロンプトの境界線

- やること:
  - **変更内容の自動分析**（git diff から ブランチ名・コミットメッセージ・PR 説明を推測・提案）
  - ブランチの最新化確認（`git pull`）
  - 変更ファイルの確認（`git status`）
  - 新規ブランチの作成（`git checkout -b`）
  - ブランチへのプッシュ（`git push origin`）
  - GitHub PR の作成
  - **ユーザーが承認・修正した提案内容の反映**
- やらないこと（これらは他のプロンプトの責務）:
  - アプリ本体コード（utils/, components/ など）の変更（これは `/implement` の責務）
  - テストコードの追加・修正（これは `/implement` の責務）
  - ドキュメントの修正（これは `/implement` または `/requirements-update` の責務）
  - コミット前の `npm run format` / `npm run test` 実行（これはユーザーの責務）
