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

## Phase 9: 設計更新（チーム分割探索見直し）

- [x] `.steering/20260503-10-prompt-and-ci-test-review/design.md` に、
      `MAX_TEAM_ATTEMPTS = 5000000` 再検討の方針と採用アルゴリズム（決定的探索または再現可能探索）を追記する（S）
- [x] `.steering/20260503-10-prompt-and-ci-test-review/design.md` に、
      CI 環境での処理時間上限と計測方法（ローカル/CI比較観点）を追記する（S）

## Phase 10: ロジック実装（teamBalancer）

- [x] `utils/teamBalancer.ts` の探索ロジックを、10人固定時に実行時間上限が予測可能な方式へ置き換える（L）
- [x] `utils/teamBalancer.ts` の `MAX_TEAM_ATTEMPTS` を削減・撤廃・または用途限定し、
      5000000 回ランダム探索依存を解消する（M）
- [x] 分割候補が成立しない場合でも規定時間内に終了し、分割不可を判定できる分岐を追加する（S）
- [x] 既存の評価式重み（0.3 / 0.5 / 0.2）と「参加者10人のみ分割可」の条件を維持する（S）

## Phase 11: ユニットテスト更新

- [x] `test/utils/teamBalancer.test.ts` に、見直し後の探索ロジックで分割結果が安定して取得できるテストを追加する（M）
- [x] `test/utils/teamBalancer.test.ts` に、分割候補なしケースで規定どおり終了・判定されるテストを追加する（M）
- [x] `test/utils/teamBalancer.test.ts` に、評価式重みと10人制約の互換性維持を確認するテストを追加する（S）

## Phase 12: 検証

- [x] `npm run test:unit -- teamBalancer` を実行し、追加・更新したユニットテストの成功を確認する（S）
- [x] `npm run test:e2e` を少なくとも3回連続で実行し、`e2e/team-division.spec.ts` が失敗しないことを確認する（M）
- [x] 最終確認として `npm run format` → `npm run format:test` → `npm run typecheck` → `npm run test` → `npm run test:e2e` を再実行する（M）

## Phase 13: レート変動ロジックのドキュメント明確化

- [x] `docs/team-balancer-spec.md` にレート変動の数式
      （期待値、重み、K係数、最終更新式）を追記する（S）
- [x] `docs/team-balancer-spec.md` に数式と実装箇所
      （ファイルパス・関数名）の対応表を追記する（S）

## Phase 14: ミスマッチ内訳の可視化

- [x] `utils/teamBalancer.ts` でミスマッチ対象者（名前・割当前ロール・希望ロール）を
      算出・保持できるようにする（M）
- [x] `components/DividedTeamTable.tsx` に「◯人ミスマッチ」の内訳一覧を表示する（M）
- [x] `test/utils/teamBalancer.test.ts` にミスマッチ内訳生成のユニットテストを追加する（M）
- [x] 旧データ互換（追加フィールド欠損時のフォールバック）を確認するテストを追加する（S）

## Phase 15: 最終検証（Phase 13-14 完了後）

- [x] `npm run format` を実行して差分を整える（S）
- [x] `npm run format:test` を実行して成功を確認する（S）
- [x] `npm run typecheck` を実行して成功を確認する（S）
- [x] `npm run test` を実行して成功を確認する（S）
- [x] `npm run test:e2e` を実行して成功を確認する（M）

## Phase 16: ミスマッチ別スコア比較の可視化

- [x] `components/DividedTeamTable.tsx` に、各「◯人ミスマッチ」タブの最良評価スコア表示を追加する（M）
- [x] 最小評価スコアの候補を視覚的に強調表示する（S）
- [x] 候補なしタブは比較対象から除外し、表示が破綻しないことを確認する（S）

## Phase 17: サンプルデータの希望ロール・固定希望ランダム化

- [x] `utils/player.ts` のサンプル投入ロジックで、
      `desiredRoles` を1〜2ロールのランダム割当に変更する（M）
- [x] `utils/player.ts` で `isRoleFixed` を確率付与し、
      全員固定/全員非固定になりにくい分布へ調整する（M）
- [x] サンプル投入後も10人表示・重複なし・分割操作可能を維持する確認を追加する（S）

## Phase 18: テスト・ドキュメント更新

- [x] `test/utils/teamBalancer.test.ts` にミスマッチ比較表示で利用する評価スコア保持の
      回帰テストを追加する（S）
- [x] `docs/team-balancer-spec.md` に、ミスマッチ別最良スコア比較表示と
      サンプルデータ多様化方針を追記する（S）

## Phase 19: 最終検証（Phase 16-18 完了後）

- [x] `npm run format` を実行して差分を整える（S）
- [x] `npm run format:test` を実行して成功を確認する（S）
- [x] `npm run typecheck` を実行して成功を確認する（S）
- [x] `npm run test` を実行して成功を確認する（S）
- [x] `npm run test:e2e` を実行して成功を確認する（M）

ブランチ名: `feature/prompt-and-ci-test-review`
初回コミット: `chore(copilot): simplify e2e scripts, add requirements-update prompt, fix typecheck gap`
