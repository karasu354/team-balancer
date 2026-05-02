# 設計: E2E テストにおける Redis 取り扱い方針

## アーキテクチャ概要

E2E は Playwright を継続採用し、実行モードを2つに分離する。

- Fast E2E（デフォルト）:
  - Redis 非依存
  - 保存/復元は API モックで検証（レスポンス契約を固定）
- Integration E2E（任意/定期）:
  - Redis 実接続
  - `pages/api/teams/[id].ts` を実経路で検証

これにより、日常の回帰検知速度と実連携の信頼性を両立する。

---

## 実現方針

### 1. Fast E2E

- `e2e/data-persistence.spec.ts` を Fast 対応に変更
- Playwright の `page.route` で `/api/teams/:id` をモック
- 保存（PUT）と読み込み（GET）をメモリ上の擬似ストアで往復させる
- Redis 起動や `REDIS_URL` 設定不要

### 2. Integration E2E

- `e2e/data-persistence.integration.spec.ts` を新設
- Redis 実接続が必要なため、以下を必須とする
  - `REDIS_URL` 設定
  - `E2E_USE_REAL_REDIS=true`
- 未設定時はスキップではなくテスト冒頭で明示的に失敗させる
  - 理由: 実行者に環境不足を見落とさせないため

---

## 影響ディレクトリと責務分離

| ディレクトリ | 変更内容 |
|---|---|
| `e2e/` | Fast/Integration のデータ保存系テストを分離 |
| `e2e/helpers/` | API モック用ヘルパーを追加 |
| `package.json` | `test:e2e:fast` / `test:e2e:integration` スクリプトを追加 |
| `docs/team-balancer-spec.md` | Redis を含む E2E 運用方針を明記 |
| `.github/copilot-instructions.md` | E2E 実行モードと Redis 前提条件を追記 |

`utils/`, `components/`, `composable/`, `pages/api/` は原則変更しない。

---

## 実コード上の実現可能性評価

### 現状

- API Route で `new VercelRedis()` を直接生成している
- 依存注入（DI）ポイントはない

### 評価

- Browser E2E においては API 経路を Playwright でモック可能なため、
  アプリ本体コードを変更せず Fast E2E を実現できる
- Integration E2E は現行 API Route のままでも実Redis接続で検証可能

結論として、現行コードでも二段運用は実装可能。

---

## データモデル・型定義

変更なし。

---

## API 仕様への影響

変更なし。`docs/team-balancer.v1.yaml` の更新不要。

---

## 既存 `fromJson` / `playersInfo` 互換性

影響なし。
