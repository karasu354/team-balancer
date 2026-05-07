# design

## アーキテクチャ概要

本施策は UI/UX 中心の機能追加であり、既存の自動分割ロジックを維持しつつ、手動配置レイヤーを追加する。
構成は「自動分割結果（既存）」と「手動配置 state（新規）」の二層管理とし、表示・確定時にどちらを参照するかをモードで切り替える。

主要方針:

1. DnD 操作は `components/` に閉じ込め、ルール検証は `utils/` に委譲する
2. 手動配置データは初期段階ではフロント内 state で完結させ、API 契約は変更しない
3. 自動分割結果を手動モードの初期配置へコピーし、編集開始コストを下げる
4. 既存の分割表示コンポーネントを拡張し、モード切替 UI を追加する

## 影響ディレクトリと責務分離

- utils/

  - `utils/teamBalancer.ts`
    - 手動配置の妥当性検証関数を追加（重複配置、欠員、10人条件）
    - 既存自動分割ロジックには副作用を入れない
  - 追加候補: `utils/manualAssignment.ts`（責務が肥大化する場合のみ）

- components/

  - `components/DividedTeamTable.tsx`
    - 自動/手動モード切替 UI を追加
    - ドラッグ中状態、ドロップ先ハイライト、未配置リスト表示を追加
  - 追加候補: `components/ManualTeamBoard.tsx`
    - DnD 専用 UI を分離して単一責務化
  - 追加候補: `components/ManualAssignmentCard.tsx`
    - ドラッグ可能プレイヤーカード

- composable/

  - API 呼び出しは変更なし（初期方針）

- pages/api/

  - 変更なし（初期方針）

- pages/

  - `pages/index.tsx`
    - 手動分割モード導線を組み込み（必要なら props 受け渡し調整のみ）

- test/
  - `test/utils/teamBalancer.test.ts`
    - 手動配置検証ロジックの unit test 追加
  - `e2e/team-division.spec.ts`
    - DnD による手動配置・確定フローの E2E 追加

## データモデル・型定義の変更点

- 既存 `Player`, `TeamBalancer`, `PlayersJson`, `PlayerJson` は維持
- UI ローカル型を追加:
  - `ManualSlotKey`: `blue-top`, `blue-jg`, ... `red-sup`
  - `ManualAssignmentMap`: `Record<ManualSlotKey, string | null>`（value は playerId）
- 既存 JSON 変換（`fromJson`, `playersInfo`）の入出力は変更しない

## API変更有無と docs/team-balancer.v1.yaml への影響

- API 変更: なし（現時点方針）
- `docs/team-balancer.v1.yaml` への影響: なし
- ただし、手動配置のサーバー保存が必要になった場合は API 拡張が必要となるため、その時点で `requirements-update` を実施する

## 既存仕様との矛盾と採用方針

- 矛盾1: 現行仕様は自動分割中心で、手動分割導線が未定義
  - 採用方針: 自動分割を維持しつつ、手動モードを追加（排他切替）
- 矛盾2: 手動配置の保存先が仕様化されていない
  - 採用方針: 初期リリースでは画面内 state のみ。永続化はスコープ外
- 矛盾3: DnD のアクセシビリティ要件が未定義
  - 採用方針: まずマウス操作を実装し、キーボード代替は次フェーズ課題として管理

## 実装方針

1. UI

- 自動/手動モード切替トグルを分割エリアに追加
- 手動モードで「未配置プレイヤー」エリア + 10ロール枠を表示
- カードドラッグ中にドロップ先候補を可視化

### レビュー指摘に基づく実装方針（次フェーズ）

- **入力プレビュー配置**: `pages/index.tsx` のレイアウト構造を再検討し、入力フォーム（PlayerInputForm） → 結果プレビュー → 追加ボタン の順序に変更
- **手動分割モードのチームバランス表示**: `DividedTeamTable.tsx` の手動モード完了時に、自動分割と同じ要領でチーム評価値・ロール数内訳などを表示するセクションを追加
- **試合履歴ダークテーム**: `MatchHistoryPanel.tsx` / `MatchHistoryAccordion.tsx` で CSS custom properties（--tb-surface, --tb-text-primary, --tb-text-secondary など）を確実に適用
- **プレイヤーカード設計見直し**: `PlayersTable.tsx` のカード型表示を再評価し、コンパクト行型やテーブル形式への変更を検討

2. ロジック

- `validateManualAssignment` を追加し、以下を検証:
  - 参加者10人条件
  - 全ロール埋まり
  - 同一プレイヤー重複なし
- 手動確定時はこの検証結果で UI エラーを表示

3. テスト

- unit: 検証関数の正常系/異常系/境界値（9人, 10人, 11人）
- e2e: カード DnD、モード切替、自動結果から手動編集、確定失敗/成功

## 検証方針

- `npm run format`
- `npm run format:test`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`

追加確認:

- DnD 操作で重複配置が発生しない
- 未配置が残る場合に確定不可となる
- 自動モードへ戻した際に既存機能が回帰していない
- （Phase 9）入力プレビュー配置変更後のフロー整合性を確認
- （Phase 9）プレイヤーカード表示変更が他コンポーネント（BulkEditRow, PlayerDeleteCard 等）と矛盾しないかを確認
- （Phase 9）手動分割チームバランス表示が自動分割と同じデータで正確に算出されているかを確認
- （Phase 9）試合履歴のダークテーマ適用が全UI要素（テキスト、アイコン、背景）をカバーしているか確認
