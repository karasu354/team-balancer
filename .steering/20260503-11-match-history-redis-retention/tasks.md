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

## Phase 5: API 責務分離（未着手）

- [x] pages/api/teams/[id].ts の入力検証・永続化変換・レスポンス組み立てを関数分離する（L）
- [x] 正規化処理が `utils/` を唯一の正とすることを確認し、API 層の重複ロジックを解消する（M）

## Phase 6: ドメイン/Redis 保守性改善（未着手）

- [x] utils/teamBalancer.ts の履歴正規化・保持上限制御を純粋関数へ切り出す方針で整理する（M）
- [x] services/vercelRedis.ts に `REDIS_URL` の fail-fast 検証を追加する（S）
- [x] services/vercelRedis.ts の Redis キー生成を定数または関数に集約する（S）

## Phase 7: テスト保守性改善（未着手）

- [x] test/api/teams-id.test.ts の保存/復元系フィクスチャを共通化する（S）
- [x] API 責務分離と Redis 設定検証に対応するテスト観点を tasks と同期して補強する（M）
