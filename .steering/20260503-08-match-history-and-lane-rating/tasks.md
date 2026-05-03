# tasks

## Phase 1: スコープ調整（レーン別レート撤回）

- [x] utils/player から laneRatings 関連の型/関数を削除する（M）
- [x] utils/teamBalancer からレーン別レート更新ロジックを削除する（M）
- [x] 既存テストから laneRatings 前提ケースを削除または置換する（M）

## Phase 2: 履歴データモデル再定義

- [x] PlayersJson の履歴型を playerResults 中心に再定義する（M）
- [x] MatchHistory に playerResults（playerId, playerName, team, result）を追加する（M）
- [x] fromJson の後方互換補完を更新する（S）

## Phase 3: API

- [x] pages/api/teams/[id] の GET/PUT バリデーションを履歴新形式に更新する（M）
- [x] 勝敗未選択・不正履歴データの400系検証を追加する（S）
- [x] APIテストを履歴新形式へ更新する（M）

## Phase 4: UI

- [x] components/DividedTeamTable の結果確定メッセージを履歴中心に調整する（S）
- [x] components/MatchHistoryPanel に勝者チームと勝敗人数サマリを表示する（S）
- [x] 履歴詳細ドロワー（案B）コンポーネントを追加する（L）
- [x] リスト1件選択でドロワーを開き、playerResults を表示する（M）

## Phase 5: ドキュメント

- [x] docs/team-balancer-spec.md の要件を「履歴 + playerResults」へ更新する（S）
- [x] docs/team-balancer.v1.yaml のスキーマを履歴新形式へ更新する（M）
- [x] docs/team-balancer-spec.md に表示採用案（案A + 案B）を記録する（S）

## Phase 6: 検証

- [x] npm run format を実行する（S）
- [x] npm run format:test を実行する（S）
- [x] npm run test を実行する（M）
- [x] npm run test:e2e:fast を実行する（M）

## Phase 7: 履歴UIフィードバック反映（2026-05-03追加）

- [x] MatchHistoryPanel の一覧コンテナに max-height と内部スクロールを実装する（S）
- [x] 履歴行の上下余白をなくし、連続表示へ変更する（S）
- [x] OP.GG 参考の勝敗色分離と情報密度の高い行レイアウトへ調整する（M）
- [x] e2e/team-division.spec.ts に履歴一覧の表示崩れ防止観点を追加する（M）
- [x] npm run format と npm run test:e2e:fast を再実行して回帰確認する（S）

## Phase 8: 表示文言と履歴運用改善（2026-05-03追加）

- [x] 主要英語ラベルを画面文脈に沿った日本語または統一表記へ置換する（M）
- [x] 表示文言の一覧を整理し、同じ概念の語彙を統一する（S）
- [x] 履歴詳細UIをドロワーからアコーディオン形式へ変更する（M）
- [x] アコーディオン詳細を Blue 左 / Red 右 の2カラム表示にする（M）
- [x] 履歴詳細にプレイヤー単位または履歴単位の総合レート変動を表示する（M）
- [x] 履歴削除APIと削除UIを追加する（L）
- [x] 履歴削除時に基準レートから残存履歴を再生して総合レートを再計算する（L）
- [x] 履歴削除と再計算の正常系・異常系テストを追加する（L）
- [x] docs/team-balancer-spec.md と docs/team-balancer.v1.yaml を新仕様へ更新する（M）

## Phase 9: 履歴日時の秒表示（2026-05-03追加）

- [x] MatchHistoryPanel の履歴日時表示を秒まで含む形式へ更新する（S）
- [x] e2e/team-division.spec.ts に履歴日時の秒表示検証を追加する（S）

## Phase 10: レート表示と履歴情報整理（2026-05-03追加）

- [x] プレイヤー一覧で現在レートを控えめな補助情報として表示する（M）
- [x] PlayerEditCard のティア/ランク更新時にレート自動再計算ポリシーをUI文言へ明記する（S）
- [x] MatchHistoryPanel の行表示からミスマッチ/勝数/敗数を削除する（S）
- [x] MatchHistoryAccordion の各プレイヤー行に「変動後のレート（変動値）」を表示する（M）
- [x] TeamBalancer の試合結果反映ロジックを固定差分から ELO 計算へ置き換える（L）
- [x] ELO 算出ロジックと表示変更に対応する unit/e2e テストを更新する（L）
- [x] docs/team-balancer-spec.md と docs/team-balancer.v1.yaml を実装内容へ同期する（M）

## Note

- 方針変更日: 2026-05-03
- 変更内容: レーン別レート更新を撤回し、履歴詳細（誰が勝者/敗者か）を優先実装する
