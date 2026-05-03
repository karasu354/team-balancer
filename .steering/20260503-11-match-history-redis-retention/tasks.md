# tasks

## Phase 1: ロジック

- [x] utils/teamBalancer.ts に履歴保持上限定数(MAX_MATCH_HISTORIES=50)を追加（S）
- [x] utils/teamBalancer.ts の finalizeMatchResult で履歴追加後に最新50件へトリミング（S）
- [x] 既存の deleteMatchHistory の再計算・並び順ロジックへの影響を確認し、必要最小限を調整（M）

## Phase 2: テスト

- [x] test/utils/teamBalancer.test.ts に「50件未満はそのまま追加」ケースを追加（S）
- [x] test/utils/teamBalancer.test.ts に「51件目追加時に最古履歴が削除される」ケースを追加（M）
- [x] test/utils/teamBalancer.test.ts に「削除後の再計算後も件数上限を満たす」ケースを追加（M）
- [x] test/api/teams-id.test.ts に保存/復元で履歴件数が最大50件となるケースを追加（M）

## Phase 3: API・仕様書整合

- [x] pages/api/teams/[id].ts の入出力仕様に上限導入で矛盾がないか確認（S）
- [x] docs/team-balancer-spec.md のデータ保存・復元要件に履歴上限50件を追記（S）
- [x] docs/team-balancer.v1.yaml の PlayersJson または説明文に履歴上限制約を追記（S）

## Phase 4: 最終検証

- [x] npm run format を実行（S）
- [x] npm run format:test を実行（S）
- [x] npm run typecheck を実行（S）
- [x] npm run test を実行（S）
- [x] npm run test:e2e を実行（M）
