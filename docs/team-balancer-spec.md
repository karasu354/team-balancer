# Team Balancer 仕様書

## 概要

Team Balancer の仕様を定義する。
本アプリは League of Legends のカスタムゲームを想定し、参加プレイヤーのランク・ロール希望を基に、
公平な2チーム（Blue / Red）へ自動分割する。

---

## データモデル

### Player 型

| フィールド | 型 | 説明 |
|---|---|---|
| `id` | `string` | 内部ID（`generateInternalId()` で生成） |
| `name` | `string` | プレイヤー名 |
| `isParticipatingInGame` | `boolean` | 当該ゲームへの参加フラグ |
| `tier` | `tierEnum` | ティア |
| `rank` | `rankEnum` | ランク |
| `displayRank` | `string` | 表示用ランク文字列 |
| `rating` | `number` | `tier` / `rank` から算出したレート |
| `mainRole` | `roleEnum` | メインロール |
| `subRole` | `roleEnum` | サブロール |
| `desiredRoles` | `roleEnum[]` | 希望ロール配列 |
| `isRoleFixed` | `boolean` | 希望外ロールを許容しないフラグ |

### TeamBalancer 型

| フィールド | 型 | 説明 |
|---|---|---|
| `id` | `string` | チーム構成の識別ID |
| `playersTotalCount` | `number` | 登録プレイヤー数 |
| `players` | `Player[]` | プレイヤー一覧 |
| `balancedTeamsByMissMatch` | `Record<number, { players: Player[]; evaluationScore: number }>` | ミスマッチ人数別の最良チーム候補 |

### API ペイロード型

| 型名 | 用途 | 含むフィールド |
|---|---|---|
| `PlayerJson` | プレイヤー保存形式 | `id`, `name`, `tier`, `rank`, `displayRank`, `rating`, `mainRole`, `subRole`, `desiredRoles`, `isRoleFixed` |
| `PlayersJson` | チーム保存形式 | `id`, `version`, `playersTotalCount`, `players` |

---

## コンポーネント構成

| コンポーネント | ファイル | 責務 |
|---|---|---|
| ページ | `pages/index.tsx` | 画面全体の統合、主要コンポーネント配置 |
| 入力フォーム | `components/PlayerInputForm.tsx` | 単体入力 / ログ入力のタブ切り替え |
| 単体入力 | `components/Form/SinglePlayerInputForm.tsx` | 1人分の詳細入力と追加 |
| ログ入力 | `components/Form/ChatLogInputForm.tsx` | チャットログから複数プレイヤー取り込み |
| ID操作 | `components/IdForm.tsx` | ID指定の保存・読み込み |
| 一覧 | `components/PlayersTable.tsx` | プレイヤー一覧表示・編集・削除 |
| 分割結果 | `components/DividedTeamTable.tsx` | チーム分割実行・結果表示・コピー |

---

## 機能要件

### 1. プレイヤー管理

| # | 機能 | 詳細 | 対応状況 |
|---|---|---|---|
| 1-1 | 単体追加 | 名前・ランク・ロールを指定してプレイヤーを追加する | ✅ 実装済み |
| 1-2 | 重複防止 | 同名プレイヤーは重複追加しない | ✅ 実装済み |
| 1-3 | 最大人数制限 | 登録可能人数は50人までとする | ✅ 実装済み |
| 1-4 | 参加切替 | プレイヤーごとに参加/非参加を切り替える | ✅ 実装済み |
| 1-5 | 編集 | プレイヤー属性（ランク・ロール・希望ロール等）を編集できる | ✅ 実装済み |
| 1-6 | 削除 | 指定プレイヤーを一覧から削除できる | ✅ 実装済み |

### 2. チャットログ取り込み

| # | 機能 | 詳細 | 対応状況 |
|---|---|---|---|
| 2-1 | 参加ログ解析 | 「ロビーに参加しました」ログからプレイヤー名を抽出する | ✅ 実装済み |
| 2-2 | 退出ログ解析 | 「ロビーから退出しました」ログを反映し一覧から除外する | ✅ 実装済み |
| 2-3 | 一括追加 | 解析結果をまとめてプレイヤー一覧へ追加する | ✅ 実装済み |

### 3. チーム分割

| # | 機能 | 詳細 | 対応状況 |
|---|---|---|---|
| 3-1 | 分割実行条件 | 参加フラグONのプレイヤーが10人のときのみ分割可能 | ✅ 実装済み |
| 3-2 | ロールミスマッチ判定 | 希望ロール外配置をミスマッチとしてカウントする | ✅ 実装済み |
| 3-3 | 固定ロール尊重 | `isRoleFixed=true` のプレイヤーは希望外配置を許容しない | ✅ 実装済み |
| 3-4 | 評価スコア算出 | 総レート差・レーン差・Bot/Supペア差でスコアを計算する | ✅ 実装済み |
| 3-5 | 候補保持 | ミスマッチ人数ごとに最小スコアの候補を保持する | ✅ 実装済み |
| 3-6 | 結果表示 | Blue/Red のレーン別割当と評価スコアを表示する | ✅ 実装済み |
| 3-7 | クリップボードコピー | 表示中結果をテキスト形式でコピーできる | ✅ 実装済み |

### 4. データ保存・復元

| # | 機能 | 詳細 | 対応状況 |
|---|---|---|---|
| 4-1 | 保存 | ID指定でチームデータを Redis に保存する | ✅ 実装済み |
| 4-2 | 復元 | ID指定でチームデータを Redis から取得する | ✅ 実装済み |
| 4-3 | API検証 | 無効ID・不正Body・未対応メソッドを HTTP エラーで返す | ✅ 実装済み |

### 5. UI / UX

| # | 機能 | 詳細 | 対応状況 |
|---|---|---|---|
| 5-1 | タブ切替入力 | Single / Multi の入力方式を切り替えられる | ✅ 実装済み |
| 5-2 | 操作中表示 | 分割実行中にボタン文言を切り替える | ✅ 実装済み |
| 5-3 | レスポンシブ最適化 | モバイル向けの表示最適化を行う | 🔲 未実装（将来対応） |
| 5-4 | 通知改善 | `alert` ベースからトーストUIへ置換する | 🔲 未実装（将来対応） |

---

## チーム評価ロジック

評価スコアは次式で定義する。

$$
score = 0.3 \times totalRatingDifference + 0.5 \times laneRatingDifference + 0.2 \times adcSupPairDifference
$$

- `totalRatingDifference`: Blue/Red チーム総レート差
- `laneRatingDifference`: 各レーンの1対1レート差合計
- `adcSupPairDifference`: Bot/Supペア合算レート差

重みは現行値を採用し、仕様変更時は本ドキュメントと実装を同時更新する。

---

## API 要件

### エンドポイント

- `GET /api/teams/{id}`: チームデータ取得
- `PUT /api/teams/{id}`: チームデータ保存

### 代表レスポンス

| ステータス | 条件 |
|---|---|
| `200` | 取得/保存成功 |
| `400` | 不正なIDまたはリクエストボディ |
| `404` | 指定IDのチームが存在しない |
| `405` | 未対応メソッド |
| `500` | サーバー内部エラー |

詳細スキーマは `docs/team-balancer.v1.yaml` を参照する。

---

## 非機能要件

- TypeScript `strict: true` を維持し、型安全を徹底する
- `any` 型の使用を禁止する（不明型は `unknown` + 型ガードで扱う）
- ドメインロジックは `utils/` に集約し、UI層への分散を避ける
- Jest によるユニットテストを継続する
- E2Eテストは将来導入予定とし、導入時に要件へ反映する
- 仕様変更時は `docs/` と実装を同一変更単位で更新する

---

## テスト方針

### ユニットテスト

- 配置: `test/utils/*.test.ts`
- 実行: `npm run test:unit`
- 主対象:
  - `utils/teamBalancer.ts`
  - `utils/player.ts`
  - `utils/rank.ts`
  - `utils/role.ts`
  - `utils/utils.ts`

### E2Eテスト（将来対応）

- 候補: Playwright
- 想定配置: `e2e/*.spec.ts`
- 想定検証:
  - プレイヤー追加〜分割〜保存/復元の主要シナリオ
  - 10人条件とエラーハンドリング

---

## AIツール活用ポイント

> **基本ツール: GitHub Copilot**（VS Code拡張）

| フェーズ | プロンプト例 | Copilot活用 |
|---|---|---|
| 要件更新 | 「team-balancer-spec.md の機能要件を更新して」 | 仕様変更の抜け漏れを減らす |
| ロジック実装 | 「TeamBalancer の評価式変更を実装して」 | 既存ロジックとの差分把握 |
| API修正 | 「`pages/api/teams/[id].ts` の入力検証を強化して」 | エラーケース網羅 |
| テスト追加 | 「teamBalancer の境界値テストを追加して」 | 回帰テストの迅速作成 |
| レビュー | 「差分をバグリスク優先でレビューして」 | 重要度順で指摘を得る |
