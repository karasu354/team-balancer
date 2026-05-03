# design

## アーキテクチャ概要

本タスクはアプリ本体ではなく、**開発ワークフローのインフラ層**（プロンプト・CI・package.json スクリプト）を対象とする。
変更対象ファイルを以下に示す。

```
.github/
  prompts/
    implement.prompt.md            ← typecheck 追加
    review.prompt.md               ← agent モード修正
    requirements-update.prompt.md  ← 新規作成（既存 steering 修正用）
    task-breakdown.prompt.md       ← 任意: steering 参照方法の明確化
  workflows/
    ci.yaml                        ← test:e2e:fast → test:e2e に変更
package.json                       ← E2E スクリプトを 2 種類に整理
playwright.config.ts               ← E2E_USE_REAL_REDIS による @integration 自動スキップ
e2e/helpers/playerHelpers.ts       ← トグル操作後の UI 状態確定待機を追加
```

---

## 影響ディレクトリと責務分離

| ディレクトリ / ファイル                         | 変更内容                                                        | 責務                       |
| ----------------------------------------------- | --------------------------------------------------------------- | -------------------------- |
| `.github/prompts/implement.prompt.md`           | 最終確認に `typecheck` を追加                                   | Copilot 実装プロンプト     |
| `.github/prompts/review.prompt.md`              | `agent: 'review-agent'` → `agent: 'agent'`                      | Copilot レビュープロンプト |
| `.github/prompts/requirements-update.prompt.md` | 新規作成                                                        | Copilot 要件修正プロンプト |
| `package.json`                                  | E2E スクリプトを `test:e2e` / `test:e2e:headed` の 2 種類に整理 | npm スクリプト管理         |
| `playwright.config.ts`                          | `E2E_USE_REAL_REDIS` による `@integration` 自動スキップを対応   | Playwright 設定            |
| `.github/workflows/ci.yaml`                     | `test:e2e:fast` → `test:e2e` に変更                             | CI 設定                    |
| `e2e/helpers/playerHelpers.ts`                  | `addPlayer` のトグル操作後に UI 確定待機を追加                  | E2E ヘルパー               |

アプリ本体コード（`utils/`, `components/`, `composable/`, `pages/api/`）は**変更しない**。

---

## データモデル・型定義の変更点

本タスクはプロンプトテキスト・YAML フロントマター・npm スクリプト文字列の編集のみであり、
TypeScript の型定義変更は一切発生しない。

---

## API変更有無と `docs/team-balancer.v1.yaml` への影響

API 変更なし。`docs/team-balancer.v1.yaml` は更新不要。

---

## 既存の `fromJson` / `playersInfo` 互換性への影響

影響なし。ドメインロジックに手を加えない。

---

## 変更詳細

### 1. `implement.prompt.md` — typecheck の追加

**現状**:

```markdown
## 実装完了時の最終確認（必須）

npm run format
npm run format:test
npm run test
npm run test:e2e:fast
```

**変更後**:

```markdown
## 実装完了時の最終確認（必須）

npm run format
npm run format:test
npm run typecheck
npm run test
npm run test:e2e:fast
```

`copilot-instructions.md` では標準検証順を
`format → format:test → typecheck → test → test:e2e:fast` と定めている。
現行プロンプトはこの順序から `typecheck` が抜けており、型エラーが検知されないリスクがある。

---

### 2. `review.prompt.md` — agent モードの修正

**現状**:

```yaml
agent: 'review-agent'
```

**変更後**:

```yaml
agent: 'agent'
```

VS Code Agent Mode で有効な値は `agent` / `ask` / `edit` のみ。
`review-agent` は存在しない値のため、フォールバック動作が発生するリスクがある。
レビュープロンプトは読み取り専用（コードを変更しない）であるが、
コンテキスト収集やファイル読み込みのために `agent` モードが適切。

---

### 3. `package.json` — E2E スクリプトを 2 種類に整理

**現状**:

```json
"test:e2e":             "playwright test --grep-invert @integration",
"test:e2e:fast":        "playwright test --grep-invert @integration",
"test:e2e:integration": "playwright test --grep @integration",
"test:e2e:headed":      "playwright test --headed",
"test:e2e:debug":       "playwright test --debug"
```

**変更後**:

```json
"test:e2e":        "playwright test",
"test:e2e:headed": "playwright test --headed"
```

- `--grep-invert @integration` / `--grep @integration` フラグをスクリプトから削除し、
  `playwright.config.ts` 内の `E2E_USE_REAL_REDIS` 判定で `@integration` テストを自動スキップする。
- `test:e2e:debug` は削除（`playwright test --debug` を直接打てば済む）。
- `test:ci` スクリプトを `test:e2e:fast` → `test:e2e` に変更する。

---

### 4. `playwright.config.ts` — `@integration` 自動スキップ

**変更内容**:
`playwright.config.ts` の `grep` オプションに条件分岐を追加する。

```ts
// E2E_USE_REAL_REDIS=true の場合は @integration テストのみ実行、
// false の場合は @integration タグのテストを除外して実行
grep: process.env.E2E_USE_REAL_REDIS === 'true'
  ? /@integration/
  : /^(?!.*@integration)/
```

CI Fast 側（`E2E_USE_REAL_REDIS: 'false'`）で `npm run test:e2e` を呼ぶと、
`@integration` テストは自動的に除外され Redis 不要で実行できる。
Integration E2E workflow 側で `E2E_USE_REAL_REDIS=true npm run test:e2e` と呼べば
`@integration` テストのみ実行できる。

---

### 5. `ci.yaml` — `test:e2e:fast` → `test:e2e` への変更

E2E スクリプト整理後は `test:e2e:fast` が存在しなくなるため、
`ci.yaml` の `Run fast E2E tests` ステップを `npm run test:e2e` に変更する。
`E2E_USE_REAL_REDIS: 'false'` はそのまま維持する。

---

### 6. `requirements-update.prompt.md` — 新規作成

**役割**: 既存 `.steering/[YYYYMMDD]-[N]-[name]/requirements.md` を修正するためのプロンプト。

**操作投入が必要なケース**:

- `implement.prompt.md` 実行後のフィードバックで要件を追加・変更したい
- スコープ外の明示内容を変更したい
- 受け入れ条件を追加・変更したい

**境界線**:

- 新規 `.steering` フォルダは作成しない（`/requirements` の責務）
- `design.md` / `tasks.md` の内容は変更しない（要件変更による素材追加は例外とする）
- アプリ本体コードの変更は行わない

---

### 7. `e2e/helpers/playerHelpers.ts` — Flaky test の根本原因と修正方針

#### 根本原因の分析

`team-division.spec.ts` の2テストが CI で連続3回タイムアウト（`getByText('青チーム')` が10秒待機後も未表示）する。

**再現条件**:

- `fullyParallel: true` + ワーカー2本で並列実行中
- CI（GitHub Actions の ubuntu-latest）は低速環境

**原因の候補**:

1. **`addPlayer` 内のトグルクリック後に UI 確定を待っていない**

   ```ts
   await page.getByRole('button', { name: 'プレイヤーを追加' }).click()
   await page.getByTitle('参加切替').last().click() // ← 確定待機なし
   ```

   `.click()` は DOM イベント発火のみを保証するが、React の状態更新（参加人数カウントの増加）が
   非同期で遅延した場合、次の `addPlayer` 呼び出しが重複クリックを起こす可能性がある。

2. **10人目のトグルが確定する前に「チーム分け」ボタンが押される**
   10人目の `addPlayer` 完了後、即座に `page.getByRole('button', { name: 'チーム分け' }).click()` が
   実行されると、参加人数が9人のまま分割試行 → 分割実行されず `青チーム` が表示されない。

#### 修正方針

`addTenPlayers` 完了後、「チーム分け」ボタンをクリックする前に
**参加中プレイヤーが10人であることを UI 上で確認してから進む**待機を追加する。

```ts
// addTenPlayers 後の呼び出し元（spec）に追加する待機
await expect(page.getByText('参加中: 10')).toBeVisible()
// または playerHelpers.ts の addTenPlayers 内で最後に追加
```

もしくは `addPlayer` ヘルパー内でトグルクリック後に参加状態の視覚変化を待つ:

```ts
export const addPlayer = async (page: Page, name: string): Promise<void> => {
  await page.getByLabel('プレイヤー名').fill(name)
  await page.getByRole('button', { name: 'プレイヤーを追加' }).click()
  const lastToggle = page.getByTitle('参加切替').last()
  await lastToggle.click()
  // トグルの aria 状態または隣接テキストが変化するまで待機
  // 実装時に UI の実態に合わせて具体的なセレクタを選ぶ
  await expect(lastToggle).toBeVisible() // 最低限の安定化（実装で深める）
}
```

実装時は `addTenPlayers` 完了後に参加人数テキスト（例：`参加中プレイヤー 10人`）が
表示されることを `expect` で確認するアプローチが最もシンプルで堅牢。
