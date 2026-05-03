# tasks

## Phase 1: 現状把握と境界定義

- [x] 既存テストを Unit / Fast E2E / Integration E2E に分類し一覧化する（M）
- [x] 境界線ドキュメント（責務・追加先判断基準）を作成する（S）
- [x] 重複テスト候補とカバー不足（境界ケース）候補を抽出する（M）

## Phase 2: テスト戦略の実装反映

- [x] Fast E2E で Redis 非依存となるよう API モック/ダミー応答を統一する（M）
- [x] Integration E2E の `@integration` 付与ルールと対象ケースを整理する（S）
- [x] 必要最小限のテスト追加/削減を実施する（L）
- [x] 10人条件・入力検証・APIエラーの回帰観点をユニットまたはE2Eへ補強する（M）

## Phase 3: CI/CD とローカル検証の整合

- [x] GitHub Actions の実行内容とローカル標準手順の対応表を更新する（S）
- [x] `.github/workflows/` のファイル名を責務ベースで再検討し、必要なら改名方針を決定する（S）
- [x] CI ワークフローのジョブ順・依存関係を見直し、必要に応じて最小修正する（M）
- [x] `typecheck` をローカル必須手順と CI の双方で確認し、欠落時は補完する（S）
- [x] Fast E2E が Redis 起動なしで安定通過することを確認する（S）

## Phase 6: GitHub Actions 運用品質の強化

- [x] ローカル/CI 共通のテストコマンド `npm run test:ci` を追加する（S）
- [x] CI の Fast E2E が Redis 実接続不要であることを workflow 設定で明示する（S）
- [x] `.github/workflows/*.yaml` の `uses` を最新安定版のコミットハッシュへ固定する（M）

## Phase 4: ドキュメント更新

- [x] `docs/team-balancer-spec.md` のテスト方針章を境界線ベースで更新する（M）
- [x] `docs/copilot-workflow.md` にローカル必須実行と CI 再現手順を追記する（S）
- [x] API仕様変更が発生した場合のみ `docs/team-balancer.v1.yaml` を更新する（S）

## Phase 5: 最終検証

- [x] `npm run format` を実行して差分を整える（S）
- [x] `npm run format:test` を実行して成功を確認する（S）
- [x] `npm run typecheck` を実行して成功を確認する（S）
- [x] `npm run test` を実行して成功を確認する（S）
- [x] `npm run test:e2e:fast` を実行して成功を確認する（M）
