# タスクリスト: E2E テスト導入

## Phase 1: セットアップ

- [x] `@playwright/test` を devDependencies に追加する（S）
- [x] `playwright.config.ts` をプロジェクトルートに作成する（S）
- [x] `package.json` に `test:e2e` / `test:e2e:headed` / `test:e2e:debug` スクリプトを追加する（S）
- [x] `e2e/` ディレクトリを作成し `.gitkeep` を置く（S）
- [x] `npx playwright install chromium` でブラウザをインストールする（S）

## Phase 2: テスト実装

- [x] `e2e/player-management.spec.ts` を作成する — E-1（M）
  - プレイヤーを1人追加し、一覧に表示されることを確認
- [x] `e2e/team-division.spec.ts` を作成する — E-2, E-5（M）
  - 10人参加状態でチーム分割を実行し、結果が表示されることを確認
  - 参加プレイヤーが10人未満のとき分割結果が表示されないことを確認
- [x] `e2e/data-persistence.spec.ts` を作成する — E-3, E-6（M）
  - ID保存→読み込みでプレイヤー一覧が復元されることを確認
  - 存在しない ID で読み込んだときエラーが表示されることを確認
- [x] `e2e/chat-log-import.spec.ts` を作成する — E-4（M）
  - チャットログ貼り付けで複数プレイヤーが追加されることを確認

## Phase 3: ドキュメント更新

- [x] `docs/team-balancer-spec.md` の非機能要件を更新する（S）
- [x] `.github/copilot-instructions.md` のテストセクションを更新する（S）

---

ブランチ名: `feature/e2e-testing`
初回コミット: `feat(e2e): Playwright によるE2Eテストを導入する`
