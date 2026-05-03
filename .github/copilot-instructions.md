# コーディングルール

本レポジトリで作成するコードに関するルールを定義します。
**基本ツールは GitHub Copilot** を前提とします。
AIツールを使って実装する際も、必ずこのルールに従ってください。

---

## 言語・フレームワーク

- **Next.js（Pages Router）** + **React** + **TypeScript** で実装する
- UIコンポーネントは `components/`、ページは `pages/` に配置する
- スタイリングは **Tailwind CSS** を使用し、インラインスタイルは書かない
- 状態管理はまず React の `useState` / `useEffect` を基本とし、ドメインロジックは `utils/` に寄せる
- パッケージマネージャは **npm** を使用する（pnpm / yarn は使用しない）

---

## TypeScript

- `strict: true` を前提に型安全を維持する
- `any` 型の使用を禁止する。型が不明な場合は `unknown` を使い、型ガードで絞り込む
- 関数の引数・戻り値には可能な限り型を明示する
- `as` によるキャストは原則禁止。使用する場合はコメントで理由を説明する
- API入出力の型は `utils/` の既存型（例: `PlayersJson`, `PlayerJson`）を再利用する

```ts
// ✅ Good
const getTeamData = async (teamId: string): Promise<PlayersJson | null> => {
  const response = await fetch(`/api/teams/${teamId}`)
  if (!response.ok) return null
  return response.json() as Promise<PlayersJson>
}

// ❌ Bad
const getTeamData = async (teamId: any) => {
  return (await fetch(`/api/teams/${teamId}`)).json() as any
}
```

---

## React / Next.js

- コンポーネントは単一責任を意識し、肥大化した場合は分割する
- Props は必ず型定義する
- イベントハンドラの型（例: `React.MouseEvent`）を明示する
- ページ固有のロジックを `pages/` に書きすぎず、`components/` / `utils/` に切り出す
- API Routes（`pages/api/`）は入力値検証と HTTP ステータスを明確に扱う

```tsx
// ✅ Good
interface IdFormProps {
  onAppUpdate: () => void
}

const IdForm: React.FC<IdFormProps> = ({ onAppUpdate }) => {
  return <button onClick={onAppUpdate}>Update</button>
}
```

---

## プロジェクト固有ルール

- チーム分割ロジックの中核は `utils/teamBalancer.ts` に集約し、UI層に分散させない
- 参加プレイヤーが10人ちょうどでない場合、分割処理を実行しない
- 既存の評価式と重みは、仕様変更がない限り維持する
- `Player` / `TeamBalancer` の JSON 変換（`fromJson`, `playersInfo`）の互換性を壊さない
- API仕様を変更した場合は `docs/team-balancer.v1.yaml` を同時更新する

---

## 命名規則

| 対象                | ルール                                          | 例                          |
| ------------------- | ----------------------------------------------- | --------------------------- |
| Reactコンポーネント | PascalCase                                      | `PlayerInputForm.tsx`       |
| ユーティリティ関数  | camelCase                                       | `generateInternalId`        |
| ドメインクラス      | PascalCase                                      | `TeamBalancer`              |
| 型 / interface      | PascalCase                                      | `PlayersJson`, `PlayerJson` |
| 変数 / 関数         | camelCase                                       | `handleDivideTeams`         |
| 定数                | SCREAMING_SNAKE_CASE もしくは `static readonly` | `MAX_TEAM_ATTEMPTS`         |
| CSSクラス           | Tailwind ユーティリティを使用                   | -                           |

---

## ディレクトリ構成

```text
team-balancer/
├── components/   # Reactコンポーネント
├── composable/   # API呼び出しラッパー
├── pages/        # Next.js ページ / API Routes
├── services/     # 外部サービス接続（Redis など）
├── test/         # テストコード
└── utils/        # ドメインロジック・型・純粋関数
```

- チーム分けロジックは `utils/teamBalancer.ts` を中心に実装する
- プレイヤー関連のドメインロジックは `utils/player.ts` に集約する
- APIクライアント呼び出しは `composable/api.ts` を経由する

---

## コードスタイル

- インデントは **スペース2つ**
- 文字列は **シングルクォート** を使用する
- 末尾セミコロンは **なし**
- 1行の最大文字数は **100文字** を目安とする
- Prettier の設定に従い、コミット前に整形する

---

## コメント

- コードを読めば分かることはコメントしない
- **なぜそう実装したか（Why）** を書く
- TODO / FIXME コメントには担当者と日付を記載する

```ts
// ✅ Good: なぜこの制約が必要かを説明
// 計算量爆発を避けるため、10人を超える全探索は許可しない
if (array.length > 10) {
  throw new Error('配列サイズが大きすぎます。最大サイズは10です。')
}

// TODO(yamada, 2026-05-02): スコア重みを設定ファイルへ移動
```

---

## Git

- コミットメッセージは **Conventional Commits** 形式に従う
  - `feat:` 新機能
  - `fix:` バグ修正
  - `refactor:` リファクタリング
  - `docs:` ドキュメント
  - `chore:` ビルド・設定変更
- ブランチ名は `feature/`, `fix/`, `docs/` のプレフィックスをつける
- 1コミットは1つの変更に限定する
- `.steering` フォルダ1件に対してコミットは1件にする
- PRタイトルは Conventional Commits 形式の要約を使う
- PR本文は `.github/PULL_REQUEST_TEMPLATE.md` に沿って作成する
- PR作成時は `gh pr create --title --body-file` の利用を推奨する

---

## ドキュメント管理

### 永続的ドキュメント（`docs/`）

- 仕様・設計・運用ルールなど長期参照するドキュメントは `docs/` に配置する
- ファイル名はケバブケースで記述する

例:

```text
docs/
├── team-balancer-spec.md
└── team-balancer.v1.yaml
```

### 作業単位ドキュメント（`.steering/`）

- 機能追加・改善ごとに `.steering/[YYYYMMDD]-[連番]-[開発タイトル]/` を作成する
- 必要に応じて次の3ファイルを作成する

```text
.steering/
└── 20260502-01-team-balance-improvement/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

`requirements.md` に含める内容:

- 背景・目的
- 実現したいこと（ユーザーストーリー形式推奨）
- スコープ外の明示

`design.md` に含める内容:

- アーキテクチャ概要
- 影響ディレクトリと責務分離
- データモデル・型定義
- API変更有無と互換性方針

`tasks.md` に含める内容:

- チェックボックス形式のタスクリスト
- フェーズや優先順位でのグルーピング
- テストとドキュメント更新タスク

---

## テスト

### 基本ルール

- テストはリポジトリルート（`team-balancer/`）で実行する
- 変更したロジックに対応するテストを優先して実行する
- テストディレクトリは `test/` を正準とし、`tests/` は新設しない

```bash
# ✅ Good
npm run test:unit

# ❌ Bad（テスト未実行でマージしない）
# テストを実行しないままコミット
```

- 実装後の標準検証順は `npm run format` → `npm run format:test` → `npm run typecheck` → `npm run test` → `npm run test:e2e:fast` とする
- CI と同一セットの簡易実行として `npm run test:ci` を利用してよい

### ユニットテスト（Jest）

- テストファイルは `test/` 配下に配置する
- ファイル名は `*.test.ts` とする
- 実行コマンド: `npm run test:unit`
- 主な対象: `utils/` のドメインロジック

```bash
npm run test:unit
```

### E2Eテスト（Playwright）

- テストファイルは `e2e/` に `*.spec.ts` で配置する
- 基本コマンド:
  - `npm run test:e2e`
  - `npm run test:e2e:fast`
  - `npm run test:e2e:integration`
  - `npm run test:e2e:headed`
  - `npm run test:e2e:debug`
- `playwright.config.ts` の `webServer` で開発サーバーを自動起動する
- 開発サーバーのポートは 3000 を使用し、`reuseExistingServer: true` で競合を回避する
- Redis 依存シナリオは二段運用とする:
  - Fast E2E: API モックで Redis 非依存に実行
  - Integration E2E: `REDIS_URL` を設定し実Redisで保存/復元を検証

### CI/CD（GitHub Actions）

- CI workflow は `.github/workflows/ci.yaml` を利用する
- PR / push（`develop`, `main`）で以下を実行する
  - `npm run format:test`
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:e2e:fast`
  - `npm run build`
- `.github/workflows/*.yaml` の `uses` はタグではなくコミットハッシュへ固定する
- Integration E2E は `.github/workflows/e2e-integration.yaml` で手動実行する
- Integration E2E 実行時は `REDIS_URL` secret を必須とする
- 同一ブランチで重複実行が発生した場合は `concurrency` で最新実行を優先する

---

## セキュリティ・運用

- `REDIS_URL` などの機密情報は `.env.local` で管理し、コードへ直書きしない
- エラーハンドリング時に機密情報や内部スタックトレースをクライアントへ露出しない
- API Routes では入力値の型と必須項目を必ず検証する

---

## PR前チェックリスト

- 仕様変更が `docs/` に反映されている
- `npm run format` を実行している
- `npm run format:test` が成功している
- `npm run typecheck` が成功している
- `npm run test` が成功している
- `npm run test:unit` が成功している
- `npm run test:e2e:fast` が成功している
- 変更箇所に対応するテストが追加または更新されている
- API変更時に `docs/team-balancer.v1.yaml` が更新されている
- Conventional Commits 形式でコミットされている
- PR本文が `.github/PULL_REQUEST_TEMPLATE.md` の必須項目を満たしている

---

## AIツール使用時のルール

### 基本方針

- **メインツールは GitHub Copilot**
- AI生成コードは必ずレビューし、型安全・要件適合・回帰リスクを確認する
- ドメインロジック変更時はテストも同時更新する
- AI提案が本ルールに違反している場合はルール優先で修正する

### GitHub Copilot の効果的な使い方

- **インライン補完**: 既存の実装パターンに沿った補完を優先
- **Copilot Chat**: 変更対象ファイルと制約を明示して依頼する
- **`/explain`**: 複雑なロジック（例: チーム評価計算）の理解に使う
- **`/fix`**: TypeScriptエラーやテスト失敗の修正案取得に使う
- **`/tests`**: `utils/` のユニットテスト草案作成に使う
