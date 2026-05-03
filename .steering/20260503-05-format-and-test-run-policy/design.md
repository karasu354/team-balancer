# design

## アーキテクチャ概要

本作業は「実装フローの品質ゲート整備」を目的とし、以下を最小差分で実施する。

1. 実行コマンドの統一: `package.json` に `test` スクリプトを定義し、運用上の標準入口を用意する
2. プロンプト更新: `/implement` の完了条件に `format` / `format:test` / `test` を明示する
3. 運用ドキュメント更新: 開発フローとPR前チェックリストに同じコマンド順序を反映する
4. PR作成品質の標準化: Description 自動生成とタイトル命名方針を再整理し、手入力を最小化する

## 影響ディレクトリと責務分離

- `utils/`
  - 変更なし（本作業は運用・設定中心）
- `components/`
  - 変更なし
- `composable/`
  - 変更なし
- `pages/api/`
  - 変更なし
- `.github/prompts/`
  - `implement.prompt.md` に最終確認手順を反映
  - `commit-message.prompt.md` のタイトル命名方針を再確認
  - `pr-description.prompt.md` の自動生成ルールを再確認
- `.github/`
  - `copilot-instructions.md` のPR前チェックリストを更新
  - `PULL_REQUEST_TEMPLATE.md` の必須項目を見直す
- `docs/`
  - `copilot-workflow.md` に実行順とPR作成時の手順を追記
- ルート設定
  - `package.json` の scripts を更新（`test` 追加）

## データモデル・型定義の変更点

- 変更なし

## API変更有無と `docs/team-balancer.v1.yaml` への影響

- API変更なし
- `docs/team-balancer.v1.yaml` の更新不要

## 既存の `fromJson` / `playersInfo` 互換性への影響

- 影響なし（ドメインロジック非変更）

## 実装方針メモ

- `npm run test` は既存運用との整合を優先し、まず `test:unit` のエイリアスとして導入する
- E2E は既存コマンド（`test:e2e:fast` / `test:e2e:integration`）を維持し、`npm run test` に含める範囲は明示する
- コマンド順は統一して以下を採用する
- コマンド順は統一して以下を採用する

1. `npm run format`
2. `npm run format:test`
3. `npm run test`

- PR Description はテンプレート必須項目（背景/変更内容/テスト結果/影響範囲/レビューポイント）を
  自動で埋める運用とし、差分不足時は最小の追加入力で補完する
- PRタイトルは Conventional Commits 準拠で、scope と変更対象が分かる命名に統一する
