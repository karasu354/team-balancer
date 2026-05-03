# 設計: E2E テスト導入

## アーキテクチャ概要

Playwright を E2E テストフレームワークとして採用する。
開発サーバー（`next dev`）を起動した状態でテストを実行し、
実際のブラウザ操作でユーザーフローを検証する。

```
e2e/
├── fixtures/         # テスト用の共通データ（プレイヤー情報など）
├── helpers/          # テスト補助関数（プレイヤー追加操作など）
└── *.spec.ts         # テストファイル
playwright.config.ts  # Playwright 設定ファイル
```

ユニットテスト（Jest）との関係:

| 種別           | ツール     | 対象                          | 実行タイミング |
| -------------- | ---------- | ----------------------------- | -------------- |
| ユニットテスト | Jest       | `utils/` のドメインロジック   | 常時           |
| E2E テスト     | Playwright | ページ操作・API連携・画面表示 | デプロイ前     |

---

## 影響ディレクトリと責務分離

| ディレクトリ                      | 変更内容                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| `e2e/`                            | 新規作成。テストファイル・補助関数を配置                                                  |
| `playwright.config.ts`            | 新規作成。baseURL・ブラウザ設定・開発サーバー起動設定                                     |
| `package.json`                    | `test:e2e` / `test:e2e:headed` / `test:e2e:debug` スクリプト追加。`@playwright/test` 追加 |
| `docs/team-balancer-spec.md`      | E2E テスト方針を「将来対応」→「実装済み」へ更新                                           |
| `.github/copilot-instructions.md` | E2E テスト手順を「将来実装予定」→「実装済み」へ更新                                       |

`utils/`, `components/`, `composable/`, `pages/api/` の変更はなし。

---

## データモデル・型定義の変更点

変更なし。  
E2E テストはアプリコード側のデータモデルに依存しない。  
テスト内では DOM セレクタ・ページ操作のみを扱う。

---

## API 変更有無

変更なし。`docs/team-balancer.v1.yaml` の更新不要。

---

## 既存の `fromJson` / `playersInfo` 互換性への影響

影響なし。

---

## Playwright 設定方針

```ts
// playwright.config.ts（概要）
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // 開発サーバーを自動起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

ポート 3000 は `next dev` のデフォルト。`reuseExistingServer` により、
開発中はサーバーを手動起動した状態でテストを実行できる。

---

## テストファイル構成

```
e2e/
├── player-management.spec.ts   # E-1: プレイヤー追加・表示
├── team-division.spec.ts       # E-2, E-5: チーム分割（正常・異常）
├── data-persistence.spec.ts    # E-3, E-6: ID保存・復元
└── chat-log-import.spec.ts     # E-4: チャットログ取り込み
```
