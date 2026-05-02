# design

## アーキテクチャ概要

本作業は「運用ドキュメント整備」と「既存テスト安定化」の2系統で進める。

1. 運用整備: `docs/` と `.github/prompts/` を更新し、PR 作成時の入力・出力を標準化する
2. テスト安定化: 失敗テストを調査し、レイヤー別（unit / e2e:fast / e2e:integration）に修正する
3. PR 自動化: テンプレート + プロンプト + CLI 実行フローで、タイトル/概要欄の手入力を最小化する
4. 品質ゲート整備: format チェック運用と `.gitignore` の再検討を行い、不要差分の混入を防ぐ

アプリ仕様は `docs/team-balancer-spec.md` を正とし、実装変更時は同時に関連ドキュメントを更新する。

## 影響ディレクトリと責務分離

- `utils/`
  - ドメインロジック由来の失敗テストを修正
  - 必要に応じて pure function の境界値ハンドリングを強化
- `components/`
  - UI 操作起因の E2E 失敗がある場合のみ最小修正
- `composable/`
  - API 呼び出しの失敗条件に起因するテスト不整合を修正
- `pages/api/`
  - 入力検証/ステータスコードの不一致によるテスト失敗を修正
- `test/`, `e2e/`
  - 失敗テストの修正と再発防止ケースを追加
- `docs/`, `.github/prompts/`
  - PR タイトル/概要欄の標準化ルールを明文化
- `.github/`
  - PR テンプレート（`pull_request_template.md`）および運用ルールを管理
- `.gitignore`
  - テスト実行やツール実行で生成されるファイルの除外ルールを再評価する
- `scripts/`（必要な場合）
  - PR 作成時の補助コマンド（`gh pr create` 呼び出し）を配置

## データモデル・型定義の変更点

- 原則、既存型（`PlayersJson`, `PlayerJson`, `Player`, `TeamBalancer`）を再利用する
- 型変更が必要な場合は最小差分で対応し、`fromJson` / `playersInfo` 互換性を維持する

## API変更有無と `docs/team-balancer.v1.yaml` への影響

- 原則 API 仕様は変更しない
- ただし、テスト修正で API の挙動（入力検証・ステータス）を変更する場合は
  `docs/team-balancer.v1.yaml` を同一 `.steering` 内で更新する

## 既存の `fromJson` / `playersInfo` 互換性への影響

- 互換性を壊さないことを必須条件とする
- 互換性リスクがある変更は、先にテストを追加してから実装する

## 実装方針メモ（PR品質）

- PR タイトルは Conventional Commits をベースにし、`.steering` 単位で 1 commit を維持する
- PR 概要欄は以下の固定セクションを持つテンプレートとする
  - 背景
  - 変更内容
  - テスト結果
  - 影響範囲 / リスク
  - レビューポイント
- 自動化の標準フローは次を想定する
  1. `/commit-message` でタイトル生成
  2. PR 概要欄テンプレートに沿って本文を自動生成
  3. `gh pr create --title --body-file` で PR を作成
- format チェックの標準コマンドを `npm run format:test` とし、失敗時は `npm run format` で修正する
- `.gitignore` 見直し対象にはテストレポート、キャッシュ、実行メタファイルを含める
