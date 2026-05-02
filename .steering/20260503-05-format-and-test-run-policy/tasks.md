# tasks

## Phase 1: 方針確定

- [x] `npm run test` の実体を定義する（`test:unit` エイリアスを基本案とする）（S）
- [x] `npm run test` と既存CI実行内容の整合を確認する（S）
- [x] 実装後の必須実行順（format → format:test → test）を確定する（S）

## Phase 2: 設定・プロンプト更新

- [x] `package.json` に `test` script を追加する（S）
- [x] `.github/prompts/implement.prompt.md` に最終確認コマンド順を反映する（S）
- [x] `.github/copilot-instructions.md` のPR前チェックリストを更新する（S）

## Phase 3: ドキュメント更新

- [x] `docs/copilot-workflow.md` に必須実行順を追記する（S）
- [x] 必須実行コマンドの役割（整形/検証）を簡潔に説明する（S）

## Phase 4: PR作成品質の標準化

- [x] PR Description 自動生成の現状課題（自動で埋まらない条件）を整理する（S）
- [x] `.github/PULL_REQUEST_TEMPLATE.md` の必須項目を再確認し不足を補う（S）
- [x] `pr-description.prompt.md` の入力・出力仕様を見直し、必須項目の自動充足を定義する（M）
- [x] PRタイトル命名方針を再検討し、`commit-message.prompt.md` のルールへ反映する（S）
- [x] タイトルの良い例/悪い例を `docs/copilot-workflow.md` に追記する（S）

## Phase 5: 検証

- [x] `npm run format` を実行する（S）
- [x] `npm run format:test` を実行し成功を確認する（S）
- [x] `npm run test` を実行し成功を確認する（S）
