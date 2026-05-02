# GitHub Copilot 開発フロー

このドキュメントは、Team Balancer で GitHub Copilot を使って開発するときの手順をまとめたものです。
「どのプロンプトを最初に使うか」「次に何を使うか」を迷わないことを目的にしています。

---

## 1. まず確認する場所

- 仕様: docs/team-balancer-spec.md
- API仕様: docs/team-balancer.v1.yaml
- 実装ルール: .github/copilot-instructions.md
- カスタムプロンプト: .github/prompts
- 作業単位の設計書: .steering

---

## 2. .steering の見方

フォルダ命名ルール:

- .steering/YYYYMMDD-[連番]-[機能名]
- 例: .steering/20260503-02-e2e-redis-strategy

各フォルダの役割:

- requirements.md: 何を実現するか
- design.md: どう実装するか
- tasks.md: 何をどの順で進めるか

連番の使い方:

- 同じ日付で2件目以降の作業を作るときに連番を増やす
- 01 始まりで採番する

---

## 3. カスタムプロンプト一覧

| プロンプト | 主な用途 | いつ使うか | 主なアウトプット | 境界線（やらないこと） |
|---|---|---|---|---|
| `/requirements` | 要件・設計・タスクの初期作成 | 新機能や新改善を着手するとき | `.steering/YYYYMMDD-[連番]-[機能名]/` + `requirements.md` + `design.md` + `tasks.md` | アプリ本体コードの実装変更 |
| `/task-breakdown` | タスクの具体化と順序整理 | 要件はあるが実装手順が粗いとき | フェーズ別・見積もり付き `tasks.md` | コード実装・テスト実装 |
| `/implement` | タスクに沿った実装 | 実装フェーズに入るとき | コード変更 + `tasks.md` チェック更新 | `.steering` 新規作成・レビュー出力・コミット文生成 |
| `/debug-assist` | バグ原因調査と最小修正案の提示 | テスト失敗や不具合再現時 | 原因、修正案、再発防止策 | ファイル編集の実行 |
| `/review` | 変更差分の品質レビュー | 実装後、PR前 | Critical / Warning / Info の指摘 | ファイル編集の実行 |
| `/refactor-check` | リファクタリング候補の抽出 | 品質改善の候補出しをしたいとき | 優先度付き改善リスト | ファイル編集の実行 |
| `/commit-message` | コミットメッセージ作成 | `.steering` 1件の実装をコミットするとき | `.steering` 1件に対する Conventional Commits 形式のメッセージ1件 | コード変更・複数 `.steering` の統合 |
| `/pr-description` | PR本文の初稿作成 | コミット後に PR を作るとき | `.github/PULL_REQUEST_TEMPLATE.md` 準拠の本文 | コード変更・コミットメッセージ生成 |

---

## 4. プロンプト引数リファレンス

この章は、各プロンプトに何を渡せば期待どおり動くかをまとめた早見表。

| プロンプト | 最低限必要な引数 | 推奨引数（精度向上） | 入力テンプレート |
|---|---|---|---|
| `/requirements` | 実装したい機能の説明 | 制約、対象外、完了条件 | 「[機能名] を実装したい。制約は [制約]。対象外は [対象外]。」 |
| `/task-breakdown` | 対象 `.steering` フォルダ | 優先フェーズ、期限感 | 「[.steering パス] の tasks.md を詳細化。優先は [Phase]。」 |
| `/implement` | 実装対象タスク | 対象フェーズ、除外範囲 | 「[.steering パス] の [Phase/タスク番号] を実装。今回は [除外範囲] は変更しない。」 |
| `/debug-assist` | 症状・失敗内容 | 再現手順、期待結果、実ログ | 「[現象] を調査。再現手順は [手順]。期待は [期待結果]。実際は [実結果]。」 |
| `/review` | レビュー対象の差分範囲 | 優先観点（バグ/型/セキュリティ） | 「[対象差分] をレビュー。特に [観点] を重視。」 |
| `/refactor-check` | 対象ディレクトリ | 優先度、非対象 | 「[対象ディレクトリ] の改善候補を抽出。今回は [非対象] を除外。」 |
| `/commit-message` | 対象 `.steering` フォルダ（1件） | 変更要約、type希望 | 「[.steering パス] 分のコミットメッセージを1件作成。要約は [要約]。」 |
| `/pr-description` | 対象 `.steering` フォルダ（1件） | 背景、変更点、テスト結果 | 「[.steering パス] の PR 本文を作成。背景は [背景]。」 |

### よく使う入力例

#### 例1: requirements

「E2E の Redis 運用を Fast と Integration に分離したい。対象外は CI 設計変更。」

#### 例2: implement

「.steering/20260503-02-e2e-redis-strategy の Phase 1 を実装してください。API 仕様は変更しないでください。」

#### 例3: commit-message

「.steering/20260503-02-e2e-redis-strategy 分のコミットメッセージを1件作って。変更要約は Redis 依存分離。」

---

## 5. 開発フロー（Step形式）

### Step 1: 要件定義を作成する

- 実行プロンプト: `/requirements`
- 入力例: 「E2Eで Redis 依存を Fast と Integration に分離したい」
- 主なアウトプット例:
	- `.steering/20260503-02-e2e-redis-strategy/requirements.md`
	- `.steering/20260503-02-e2e-redis-strategy/design.md`
	- `.steering/20260503-02-e2e-redis-strategy/tasks.md`

### Step 2: タスクを実装単位に分解する

- 実行プロンプト: `/task-breakdown`
- 入力例: 「.steering/20260503-02-e2e-redis-strategy の tasks.md を具体化して」
- 主なアウトプット例:
	- Phase 1: テストモード分離
	- Phase 2: 実行コマンド整備
	- Phase 3: ドキュメント更新

### Step 3: 実装を進める

- 実行プロンプト: `/implement`
- 実行前条件:
  - `.steering/` 配下に最新フォルダが存在する
  - 最新フォルダに `requirements.md` / `design.md` / `tasks.md` が揃っている
  - 未実行の場合は先に `/requirements` を実行する
- 入力例: 「e2e テストについて実装してください」
- 主なアウトプット例:
	- `playwright.config.ts` 作成
	- `e2e/*.spec.ts` 作成
	- `package.json` のスクリプト追加
	- `tasks.md` の該当チェック更新

実行前条件を満たさない場合の期待挙動:

- `/implement` は実装を中止し、`/requirements` 実行を案内する

### Step 4: 失敗時に原因調査する

- 実行プロンプト: `/debug-assist`
- 入力例: 「test:e2e:integration で REDIS_URL 未設定時の失敗を調べて」
- 主なアウトプット例:
	- 症状の整理
	- 原因箇所の特定
	- 最小修正案

### Step 5: コードレビューする

- 実行プロンプト: `/review`
- 入力例: 「今回の E2E 変更をレビューして」
- 主なアウトプット例:
	- 🔴 Critical: 0件
	- 🟡 Warning: 1件
	- 🔵 Info: 2件

### Step 6: 改善候補を洗い出す（任意）

- 実行プロンプト: `/refactor-check`
- 入力例: 「e2e と API 周辺のリファクタリング候補を抽出して」
- 主なアウトプット例:
	- 高優先度: 依存の注入ポイント不足
	- 中優先度: ヘルパー重複

### Step 7: コミットメッセージを作成する

- 実行プロンプト: `/commit-message`
- 入力例: 「`.steering/20260503-02-e2e-redis-strategy/` 分のコミットメッセージを作って」
- 主なアウトプット例:
	- 対象 `.steering` の明示
	- コミットメッセージ 1件
	- （必要時）本文

### Step 8: PR本文を作成して PR を作る

- 実行プロンプト: `/pr-description`
- 入力例: 「`.steering/20260503-04-pr-quality-and-test-stabilization/` の PR 本文を作って」
- 本文テンプレート: `.github/PULL_REQUEST_TEMPLATE.md`
- PR作成コマンド:

```bash
gh pr create --title "<commit title>" --body-file /tmp/pr-body.md
```

- 運用ルール:
  - タイトルは Conventional Commits 形式に合わせる
  - 本文はテンプレートの必須項目を空欄にしない
  - 最低限 `背景 / 変更内容 / テスト結果 / 影響範囲 / レビューポイント` を含める

### Step 9: format チェックを実行する

- 実行コマンド: `npm run format:test`
- 失敗時の修正コマンド: `npm run format`
- 再確認: `npm run format:test`
- 補足:
	- PR前の最終確認として `format:test` を必ず実行する
	- 生成差分が広い場合は、今回の `.steering` 対象に含めるべきかを確認してからコミットする

---

## 6. 目的別の最短ルート

- 新機能を作る: /requirements → /task-breakdown → /implement → /review → /commit-message
- バグ修正をしたい: /debug-assist → /implement → /review → /commit-message
- 既存コードを点検したい: /refactor-check → （必要なら）/requirements → /task-breakdown → /implement
- CI/CD を整備したい: /requirements → /task-breakdown → /implement → /review → /commit-message

---

## 7. 久しぶりに再開するときの手順

1. docs/team-balancer-spec.md を読み、現在の仕様を確認する
2. .steering を開き、最新フォルダの tasks.md で未完了タスクを確認する
3. 未完了タスクがある場合は /implement から再開する
4. 未完了タスクがない場合は /requirements で新しい作業を切る

---

## 8. 運用ルール

- 1つの .steering フォルダは、1つの開発テーマに限定する
- 1つの .steering フォルダに対して、コミットは1件にする
- 実装を行ったら tasks.md のチェックを更新する
- PR前に `npm run format:test` を実行し、失敗時は `npm run format` で整形して再実行する
- 仕様変更がある場合は docs/team-balancer-spec.md を同じ変更で更新する
- API変更がある場合は docs/team-balancer.v1.yaml を同じ変更で更新する
- CI/CD を変更した場合は `.github/workflows/` と `docs/` を同一変更で更新する

---

## 9. プロンプトファイル参照先

- `.github/prompts/requirements.prompt.md`
- `.github/prompts/task-breakdown.prompt.md`
- `.github/prompts/implement.prompt.md`
- `.github/prompts/debug-assist.prompt.md`
- `.github/prompts/review.prompt.md`
- `.github/prompts/refactor-check.prompt.md`
- `.github/prompts/commit-message.prompt.md`
- `.github/prompts/pr-description.prompt.md`
