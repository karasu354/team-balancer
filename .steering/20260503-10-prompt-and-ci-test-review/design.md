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

---

## 追加設計（2026-05-03）: teamBalancer 探索戦略の見直し

`MAX_TEAM_ATTEMPTS = 5000000` のランダム試行は、環境差で完了時間が揺らぎやすく
CI の E2E 失敗要因になりうるため、以下の決定的探索へ置き換える。

### 採用アルゴリズム

- 対象: `utils/teamBalancer.ts` の `divideTeams()`
- 方式: 10スロット（Blue 5 + Red 5）に対する深さ優先探索（DFS）
- 探索順序: プレイヤー ID 昇順で固定し、毎回同じ入力から同じ候補順で評価する
- 制約適用: `isRoleFixed=true` かつ希望外ロールは探索途中で即座に枝刈りする
- 対称性削減: チーム入れ替え対称を抑えるため、最小 ID プレイヤーが Blue 側に入る分岐のみ許可する

### 処理時間上限と終了条件

- 評価上限: `MAX_TEAM_EVALUATIONS = 200000`
- 時間上限: `TEAM_DIVIDE_TIME_LIMIT_MS = 1500`
- いずれかに到達したら探索を終了し、評価済み候補から最良結果を採用する
- 候補が1件も成立しない場合は例外を投げ、分割不可を明示する

### 互換性ポリシー

- 維持する仕様:
  - 参加者10人ちょうどでのみ分割可能
  - 評価式重み `0.3 / 0.5 / 0.2`
  - `balancedTeamsByMissMatch` にミスマッチ人数ごとの最良候補を保存
- 変更する仕様:
  - ランダム探索による非決定性（再現しづらい実行時間・結果）

### 計測方法（ローカル / CI 比較）

- 単体確認: `npm run test:unit -- teamBalancer`
- E2E 安定性確認: `npm run test:e2e` を3回連続実行し、`e2e/team-division.spec.ts` の失敗有無を確認
- 最終確認: `npm run format` → `npm run format:test` → `npm run typecheck` → `npm run test` → `npm run test:e2e`

これにより「実行時間上限が明確で再現可能な分割処理」を実現し、
CI 環境での `青チーム` 表示待機タイムアウトの再発を抑制する。

---

## 追加設計（2026-05-03）: レート変動の数式可視化とミスマッチ内訳表示

### 目的

- レート変動ロジックを数式として仕様書に明示し、実装との対応関係を追跡しやすくする
- `mismatchCount` の件数だけでなく、どのプレイヤーがミスマッチだったかを表示できるようにする

### 影響ファイル

- `docs/team-balancer-spec.md`
  - レート変動数式（期待値、重み、K係数、丸め、更新式）を追記
  - 数式と実装関数の対応表を追記
- `utils/teamBalancer.ts`
  - チーム分割時にミスマッチ対象プレイヤー情報を計算して保持
  - `playersInfo` / `fromJson` 互換を壊さない形で追加項目を optional で拡張
- `components/DividedTeamTable.tsx`
  - 現在選択中の分割結果に対し、ミスマッチ対象者一覧を表示
- `test/utils/teamBalancer.test.ts`
  - ミスマッチ対象者情報の生成・互換性維持を検証

### データモデル拡張方針

- 追加型（案）:
  - `MismatchDetail` = `{ playerId, playerName, assignedRole, desiredRoles, isRoleFixed }`
- 保持先（案）:
  - `balancedTeamsByMissMatch[mismatchCount]` の値に `mismatchDetails` を追加
  - 既存データとの互換のため、追加フィールドは optional とする

### コード対応の明示方針（ドキュメント記載）

- レート期待値: `utils/teamBalancer.ts` の `calculateExpectedScore`
- レーン/チーム期待値の合成: `applyMatchHistory`
- Bot/Sup ペア補正: `applyMatchHistory`
- 最終変動量: `ratingDelta = round(K * (actual - expected))` 相当計算箇所

### 互換性方針

- 旧保存データ（`mismatchDetails` なし）読み込み時は空配列扱いにフォールバック
- `matchHistories` の既存構造を必須破壊しない（必要なら optional 追加で段階移行）

---

## 追加設計（2026-05-03）: ミスマッチ別スコア比較とサンプルデータ多様化

### 目的

- `◯人ミスマッチ` タブごとの最良評価スコアを同時比較できるようにし、
  採用すべき候補を判断しやすくする
- サンプルデータ投入時に希望レーンと `isRoleFixed` を固定化せず、
  検証データの偏りを減らす

### 影響ファイル

- `components/DividedTeamTable.tsx`
  - タブラベルまたはサマリー領域に、各ミスマッチ人数の最良スコアを表示
  - 最小スコアのタブを強調表示（色・バッジ等）
- `utils/teamBalancer.ts`
  - 既存の `balancedTeamsByMissMatch` を比較用データソースとして利用
  - 追加の再計算は行わず、保持済み評価スコアを表示へ流用
- `components/Form/ChatLogInputForm.tsx`
  - サンプルデータ生成時に `desiredRoles` と `isRoleFixed` の付与をランダム化
  - 無効データ（空希望ロールなど）を生成しないガードを維持
- `docs/team-balancer-spec.md`
  - UI 仕様に「ミスマッチ別最良スコア比較」と「サンプルデータ多様化方針」を追記

### 実装方針

- ミスマッチ比較表示

  - `balancedTeamsByMissMatch` を走査し、`players.length === 10` の候補だけを対象に
    `evaluationScore` を一覧表示する
  - 候補なしタブは従来通り無効化する
  - 候補ありタブのうち最小 `evaluationScore` を持つタブを強調する

- サンプルデータランダム化
  - 希望ロール: 1〜2ロールをランダム選択（重複なし）
  - 固定希望: 一定確率で `isRoleFixed=true` を付与するが、全員固定にはしない
  - 既存制約を維持:
    - プレイヤー名重複を作らない
    - 10人投入後に分割可能性が極端に下がりすぎない分布へ調整

### 検証方針

- `test/utils/teamBalancer.test.ts`
  - ミスマッチ比較表示に必要な評価スコアデータが保持されることを確認
- UI/E2E（既存範囲）
  - サンプルデータ投入後に10人表示・チーム分割操作が可能であることを確認
