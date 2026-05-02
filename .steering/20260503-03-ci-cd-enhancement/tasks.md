# タスクリスト: GitHub Actions の CI/CD 強化

## Phase 1: CI ワークフロー強化

- [x] `.github/workflows/test.yaml` を CI 拡張構成へ更新する（M）
- [x] `package.json` に `typecheck` スクリプトを追加する（S）
- [x] push 時の build artifact 保存を追加する（S）
- [x] `jest.config.js` で E2E spec を unit テスト対象外にする（S）

## Phase 2: Integration E2E 分離

- [x] `.github/workflows/e2e-integration.yaml` を新規作成する（M）
- [x] `REDIS_URL` 必須チェックを workflow 側に実装する（S）

## Phase 3: ドキュメント更新

- [x] `docs/team-balancer-spec.md` に CI/CD 運用方針を追記する（S）
- [x] `.github/copilot-instructions.md` に CI/CD 実行ルールを追記する（S）
- [x] `docs/copilot-workflow.md` に CI/CD 実装時のフロー補足を追記する（S）
