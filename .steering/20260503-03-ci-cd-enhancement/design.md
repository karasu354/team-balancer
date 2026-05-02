# 設計: GitHub Actions の CI/CD 強化

## アーキテクチャ概要

GitHub Actions を以下の2系統で運用する。

1. CI（自動）

   - トリガー: `pull_request`, `push`（`develop`, `main`）
   - 実行内容: format check, typecheck, unit test, fast e2e, build
   - 特徴: branch concurrency を有効化し、古い実行を自動キャンセル

2. Integration E2E（手動）
   - トリガー: `workflow_dispatch`
   - 実行内容: Redis 実接続の E2E
   - 特徴: `REDIS_URL` の必須チェックを workflow 側で実施

CI 成功後、push 時のみ build artifact（`.next` を含む）を保存して
CD 準備（配布・検証）を行う。

---

## 影響ディレクトリと責務分離

| ディレクトリ         | 変更内容                                         |
| -------------------- | ------------------------------------------------ |
| `.github/workflows/` | CI workflow と integration workflow を追加・更新 |
| `package.json`       | CI 用の typecheck スクリプトを追加               |
| `docs/`              | CI/CD 運用手順の追記                             |
| `.github/`           | Copilot 指示書に CI/CD の運用ルールを追記        |

`utils/`, `components/`, `composable/`, `pages/api/` は変更しない。

---

## データモデル・型定義の変更点

変更なし。

---

## API変更有無と `docs/team-balancer.v1.yaml` への影響

API 仕様変更なし。`docs/team-balancer.v1.yaml` の更新は不要。

---

## 既存 `fromJson` / `playersInfo` 互換性への影響

影響なし。

---

## ワークフロー詳細

### CI workflow

- `concurrency` を設定し、同ブランチの重複実行を抑止
- `actions/setup-node` の npm cache を利用
- Playwright のブラウザ依存をインストールして `test:e2e:fast` を実行
- `push`（`develop`, `main`）時のみ build artifact をアップロード

### Integration E2E workflow

- 手動起動のみ
- `REDIS_URL` 未設定時は `exit 1` で失敗
- `E2E_USE_REAL_REDIS=true` を付与して `test:e2e:integration` を実行
