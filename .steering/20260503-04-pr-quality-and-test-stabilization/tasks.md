# tasks

## Phase 1: 調査・方針確定

- [x] 現在失敗しているテストを収集し、unit / e2e:fast / e2e:integration に分類する（S）
- [x] 失敗原因を「実装不具合 / テスト不備 / 環境依存」に分類する（M）
- [x] 修正優先順位（CI必須の test:unit, test:e2e:fast を先行）を確定する（S）

## Phase 2: テスト修正

- [x] `test/` 配下の失敗テストを修正し、必要に応じて `utils/` を最小修正する（M）
- [x] `e2e/` の Fast シナリオ失敗を修正する（M）
- [x] Integration シナリオの失敗は環境前提（REDIS_URL など）を明示して修正する（M）
- [x] 回帰防止のための追加テストを必要最小限で追加する（M）

## Phase 3: PR品質ルール整備

- [x] `docs/copilot-workflow.md` に PR タイトル・概要欄テンプレートを追記する（S）
- [x] `.github/prompts/commit-message.prompt.md` が `.steering` 単位 1 commit と整合するか確認する（S）
- [x] 必要に応じて PR 作成用プロンプト（例: `pr-description`）の追加要否を記録する（S）

## Phase 4: PR入力の自動化定義

- [x] `.github/PULL_REQUEST_TEMPLATE.md` のテンプレート項目を定義する（S）
- [x] PR本文自動生成プロンプト（例: `pr-description`）の仕様を定義する（S）
- [x] `gh pr create --title --body-file` を使う運用手順を `docs/copilot-workflow.md` に追記する（S）
- [x] 人手修正を最小化するための必須入力項目（背景/変更点/テスト）を定義する（S）

## Phase 5: 検証・ドキュメント反映

- [x] `npm run test:unit` を実行して成功を確認する（S）
- [x] `npm run test:e2e:fast` を実行して成功を確認する（M）
- [x] API挙動変更がある場合のみ `docs/team-balancer.v1.yaml` を更新する（S）※API挙動変更なしのため更新不要
- [x] `docs/team-balancer-spec.md` / `.github/copilot-instructions.md` の関連記述を更新する（S）

## Phase 6: format / .gitignore 整備

- [x] `npm run format:test` の実行手順と失敗時対応（`npm run format`）を運用ドキュメントへ反映する（S）
- [x] テスト実行時に生成される成果物を洗い出し、`.gitignore` の追加・削除方針を確定する（M）
- [x] 必要な `.gitignore` 更新を実施し、不要な差分ファイルが追跡されないことを確認する（M）
