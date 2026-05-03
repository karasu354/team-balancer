# tasks

## Phase 1: プロンプト修正

- [x] `.github/prompts/implement.prompt.md` の最終確認手順に `npm run typecheck` を追加する（S）
- [x] `.github/prompts/review.prompt.md` のフロントマターを `agent: 'review-agent'` → `agent: 'agent'` に修正する（S）
- [x] `.github/prompts/requirements-update.prompt.md` を新規作成する（M）
  - 既存 `requirements.md` の修正フロー（追記・スコープ変更・受け入れ条件追加）を記述
  - 新規 `.steering` 作成や `design.md` / `tasks.md` 変更は行わない旨の境界線を明示

## Phase 2: npm スクリプト整理

- [x] `package.json` の E2E スクリプトを2種類（`test:e2e` / `test:e2e:headed`）に整理する（S）
  - `test:e2e:fast` / `test:e2e:integration` / `test:e2e:debug` を削除
  - `test:e2e` → `playwright test`（headed なし）
  - `test:e2e:headed` → `playwright test --headed`（既存のまま）
- [x] `package.json` の `test:ci` を `test:e2e:fast` → `test:e2e` に更新する（S）

## Phase 3: Playwright 設定変更

- [x] `playwright.config.ts` に `E2E_USE_REAL_REDIS` による `grep` 自動切り替えを追加する（M）
  - `E2E_USE_REAL_REDIS=true` → `@integration` テストのみ実行
  - `E2E_USE_REAL_REDIS` 未設定 or `false` → `@integration` タグを除外して実行

## Phase 3b: Flaky test 安定化

- [x] `e2e/team-division.spec.ts` の失敗を再現・確認し、根本原因を特定する（S）
- [x] `e2e/helpers/playerHelpers.ts` の `addTenPlayers` 完了後に参加人数が10人であることを
      `expect` で確認する待機を追加する（M）
  - `p:has-text("参加中") + p` で参加中カウントを特定し `toHaveText('10/10')` で待機
- [x] ローカル CI 相当環境（`npm run test:e2e`）で連続3回以上安定通過することを確認する（M）

## Phase 4: CI 整合

- [x] `.github/workflows/ci.yaml` の `npm run test:e2e:fast` → `npm run test:e2e` に変更する（S）
- [x] `.github/workflows/e2e-integration.yaml` の実行コマンドが `npm run test:e2e` で動作することを確認する（S）

## Phase 5: ドキュメント整合

- [x] `copilot-instructions.md` 内の E2E コマンド記載（`test:e2e:fast` 等）を新スクリプト名へ更新する（S）
- [x] `docs/team-balancer-spec.md` のテストコマンド記載が変更後と一致しているか確認し、不一致があれば更新する（S）
- [x] `docs/copilot-workflow.md` の標準検証手順が `typecheck` を含む順序・新スクリプト名で記載されているか確認し、必要なら修正する（S）

## Phase 6: 最終検証

- [x] `npm run format` を実行して差分を整える（S）
- [x] `npm run format:test` を実行して成功を確認する（S）
- [x] `npm run typecheck` を実行して成功を確認する（S）
- [x] `npm run test` を実行して成功を確認する（S）
- [x] `npm run test:e2e` を実行して成功を確認する（M）

## Phase 7: PR テンプレート廃止

- [x] `.github/PULL_REQUEST_TEMPLATE.md` を削除する（S）
- [x] `.github/prompts/pr-description.prompt.md` の `PULL_REQUEST_TEMPLATE.md` 参照を除去し、
      `.steering` から直接内容を生成するルールに更新する（S）

## Phase 8: 最終検証（Phase 7 完了後）

- [x] `npm run format` を実行して差分を整える（S）
- [x] `npm run format:test` を実行して成功を確認する（S）
- [x] `npm run typecheck` を実行して成功を確認する（S）
- [x] `npm run test` を実行して成功を確認する（S）
- [x] `npm run test:e2e` を実行して成功を確認する（M）

ブランチ名: `feature/prompt-and-ci-test-review`
初回コミット: `chore(copilot): simplify e2e scripts, add requirements-update prompt, fix typecheck gap`
