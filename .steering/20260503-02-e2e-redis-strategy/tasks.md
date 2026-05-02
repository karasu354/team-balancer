# タスクリスト: E2E テストにおける Redis 取り扱い方針

## Phase 1: テストモード分離

- [x] `e2e/helpers/apiMock.ts` を作成し、`/api/teams/:id` のモックを実装する（M）
- [x] `e2e/data-persistence.spec.ts` を Fast E2E（APIモック版）へ変更する（M）
- [x] `e2e/data-persistence.integration.spec.ts` を新規作成し、実Redis検証を分離する（M）

## Phase 2: 実行コマンド整備

- [x] `package.json` に `test:e2e:fast` を追加する（S）
- [x] `package.json` に `test:e2e:integration` を追加する（S）
- [x] `test:e2e:integration` 実行時の必須環境変数チェックをテスト側で実装する（S）

## Phase 3: ドキュメント更新

- [x] `docs/team-balancer-spec.md` の E2E 方針に Fast/Integration の二段構成を追記する（S）
- [x] `.github/copilot-instructions.md` の E2E セクションに Redis 前提条件を追記する（S）

---

ブランチ名: feature/e2e-redis-strategy
初回コミット: feat(e2e): Redis依存を分離したE2E実行モードを追加する
