# design

## アーキテクチャ概要

本作業は「抽出品質の向上」と「低リスク改善の実装」を2段で進める。

1. プロンプト改善: `/refactor-check` の出力に判定基準と対応可否を明示する
2. 実装修正: 抽出結果のうち、機能変更を伴わない改善を最小差分で反映する
3. 運用同期: `/implement` の検証手順とドキュメント内テスト手順を同期する

加えて、プロンプト責務を次のように固定する。

- `/refactor-check`: 改善候補の抽出と仕分けのみ
- `/requirements`: しきい値超過時の要件化のみ
- `/implement`: 承認済みタスクの実装のみ

## 影響ディレクトリと責務分離

- `utils/`
  - 純粋関数・型安全性・重複処理の改善候補を反映
- `components/`
  - 単一責務化・重複UIロジック整理の候補を反映
- `composable/`
  - APIラッパーの型・エラーハンドリング改善候補を反映
- `pages/api/`
  - 入力検証・ステータスコードの明確化候補を反映
- `test/utils/`
  - 変更箇所の回帰確認テストを追加/更新
- `.github/prompts/`
  - `refactor-check.prompt.md` を改善
  - `requirements.prompt.md` への誘導条件を明文化
  - `implement.prompt.md` の最終確認手順に E2E fast を追加
- `docs/`
  - 必要に応じて運用方針の追記
- `.github/`
  - `copilot-instructions.md` を基準としてテスト手順の整合を確認
- `test/`
  - テスト配置の正準ディレクトリを `test/` に固定し、`tests/` への分岐を避ける

## データモデル・型定義の変更点

- 原則、既存型（`PlayersJson`, `PlayerJson`, `Player`, `TeamBalancer`）を再利用する
- 型変更は機能変更を伴わない範囲でのみ実施し、互換性を維持する

## API変更有無と `docs/team-balancer.v1.yaml` への影響

- 原則 API仕様変更なし
- APIレスポンス契約を変更する場合のみ `docs/team-balancer.v1.yaml` を更新する

## 既存の `fromJson` / `playersInfo` 互換性への影響

- 互換性を壊さないことを必須条件とする
- 互換性に影響しうる候補は今回対象外とし、別要件化する

## 実装方針メモ

- `refactor-check.prompt.md` には以下を追加する
  1. 候補ごとの「対応可否」タグ（即時対応可 / 要件化推奨）
  2. 指摘の根拠行（ルール違反 / 保守性リスク）
  3. 変更影響の簡易見積もり（S/M/L）
  4. しきい値超過時の `requirements` 誘導ルール
- 外部参照モードは既定OFFとし、明示指定時のみWeb参照を許可する
- 外部参照モード利用時は、参照元・参照日・採用/非採用理由を出力へ含める
- テスト手順監査は `unit / E2E fast / format` の3軸で行い、記載漏れを埋める
- ディレクトリ命名は既存実装との互換性を優先し `test/` を採用する
- 実装修正は不変条件を守る
  - 参加プレイヤー10人条件
  - 評価重み 0.3 / 0.5 / 0.2
  - `fromJson` / `playersInfo` 互換性
