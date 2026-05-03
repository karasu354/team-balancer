# requirements

> **対象 .steering フォルダ**: `.steering/20260503-10-prompt-and-ci-test-review/`

## 背景・目的

本プロジェクトでは `.github/prompts/` に Copilot Agent Mode 用のプロンプトが整備され、
`.github/workflows/` に GitHub Actions CI が構成されている。
運用を継続するなかで次の問題点が顕在化してきた。

1. **プロンプトの不整合**: `implement.prompt.md` の最終確認手順から `npm run typecheck` が抜けており、
   `copilot-instructions.md` で定める標準検証順と乖離している。
2. **CI スクリプトの重複**: `package.json` の `test:e2e` と `test:e2e:fast` が同一コマンドを指しており、
   どちらを使うべきか判断しにくい。
3. **各ジョブが依存関係を重複インストール**: CI の `quality` / `e2e-fast` / `build` 各ジョブが
   それぞれ独立して `npm ci` を実行しており、効率が低い。
4. **`review.prompt.md` のエージェントモード指定が不正**: `agent: 'review-agent'` は
   VS Code Agent Mode の有効な値ではない（`agent` / `ask` / `edit` が有効）。
5. **複数 steering フォルダが存在する際のグロブ `*/` の曖昧さ**: 一部プロンプトが
   `.steering/*/requirements.md` のようなグロブで参照しており、どの steering を使うか不明確。
6. **要件修正専用プロンプトが存在しない**: `/requirements` プロンプトは新規 steering 作成のみを担うが、
   実装後のフィードバックや途中変更で既存 `requirements.md` を修正する手段が明示されていない。
   `implement.prompt.md` の境界線には「要件定義の変更は `/requirements` の責務」と書かれているが、
   `/requirements` は新規作成しか対応していないため、修正フローが宙に浮いている。
7. **E2E スクリプトの命名が機能ではなく実行環境に依存している**: `test:e2e:fast` / `test:e2e:integration`
   / `test:e2e:headed` / `test:e2e:debug` と4種類あり、目的が分かりにくい。開発者が使うシナリオは
   「ブラウザ表示なし（CI・ローカル速度優先）」と「ブラウザ表示あり（目視確認）」の2つに集約できる。
8. **CI 環境で `e2e/team-division.spec.ts` が断続的に失敗する（Flaky test）**: GitHub Actions 上で
   `青チーム` テキストの可視化待機が10秒タイムアウトコール・3回リトライすべて失敗する。
   `addTenPlayers` ヘルパーが10人分の参加トグルを順調に実行する際、トグルクリック後の状態確定
   を待たず次の操作に移るため、CI（低速環境）では参加人数が10人に満たないまま
   「チーム分け」ボタンが押下され分割が実行されない可能性がある。
9. **`.github/PULL_REQUEST_TEMPLATE.md` が実用上役立っていない**: `/pr-description` プロンプトで
   PR本文を自動生成する運用に移行したため、GitHub のデフォルトプルリクエストテンプレートは
   プロンプト生成結果に上書きされるだけで役割を満たしていない。また、各ドキュメント
   で `PULL_REQUEST_TEMPLATE.md` への参照が散在しており一貫性がない。

これらを整理することで、Copilot ワークフローの信頼性と CI の保守性を高める。

---

## ユーザーストーリー

1. **開発者として**、`/implement` プロンプトの指示に従えば typecheck を含む完全な検証が通ることを確認したい。
   なぜなら、型エラーが残ったままコミットされる事故を防ぎたいから。

2. **開発者として**、`test:e2e` と `test:e2e:fast` の違いをスクリプト名から理解したい。
   なぜなら、どちらを使えばよいか都度 `package.json` を読まなくて済むようにしたいから。

3. **開発者として**、CI がプロンプトに書かれた検証手順と同じ順序・同じコマンドで動くことを保証したい。
   なぜなら、ローカルで green でも CI で red になる状況を減らしたいから。

4. **プロジェクト管理者として**、`/review` プロンプトが正しいエージェントモードで起動することを確認したい。
   なぜなら、`review-agent` が存在しないために意図しないモードで動作するリスクを排除したいから。

5. **開発者として**、実装中や実装後のフィードバックで既存の `requirements.md` を修正するための
   専用プロンプト（`/requirements-update`）を使いたい。なぜなら、`/requirements` は新規作成のみを
   担うため、修正方法がドキュメント化されておらず、誤って新規フォルダを作ってしまうリスクがあるから。

6. **開発者として**、E2E テストのコマンドを「ブラウザ表示なし」と「ブラウザ表示あり」の2種類だけ
   把握していれば十分にしたい。なぜなら、現在4つのスクリプトがあり、状況に応じてどれを
   使うべきか迷うことが多いから。

7. **開発者として**、GitHub Actions 上の E2E テスト（`team-division.spec.ts`）が安定して通過するようにしたい。
   なぜなら、CI で暇時間の失敗が発生し、原因調査に時間がかかるため、不必要なレコードを排除したいから。

8. **プロジェクト管理者として**、`.github/PULL_REQUEST_TEMPLATE.md` を削除し、各ドキュメントからその参照を除くことで
   ワークフローを整理したい。なぜなら、`/pr-description` プロンプトが PR 本文を自動生成するため、
   テンプレートファイルは上書きされるだけで岐下まりになっており、これ以上维持する必要がないから。

---

## 受け入れ条件

### 正常系

- `implement.prompt.md` の最終確認手順に `npm run typecheck` が含まれ、
  `copilot-instructions.md` の標準検証順（format → format:test → typecheck → test → test:e2e）と一致する。
- `review.prompt.md` のフロントマターが `agent: 'agent'` など有効な値に修正される。
- `requirements-update.prompt.md` が新規作成され、既存 steering への修正フローが明示される。
- `package.json` の E2E スクリプトが以下の2種類に整理される:
  - `test:e2e` — ヘッドレス実行（CI・ローカル速度優先。`@integration` タグは `E2E_USE_REAL_REDIS` で制御）
  - `test:e2e:headed` — ブラウザ表示あり（目視確認用）
  - `test:e2e:fast` / `test:e2e:integration` / `test:e2e:debug` は削除
- `playwright.config.ts` で `E2E_USE_REAL_REDIS !== 'true'` の場合に `@integration` テストを自動スキップする
  設定が追加され、`--grep` フラグをスクリプトに書かなくて済む状態になる。
- CI `ci.yaml` が `test:e2e:fast` ではなく `test:e2e` を使用するよう更新される。
- `test:ci` スクリプトが新スクリプト名（`test:e2e`）を使うよう更新される。
- `copilot-instructions.md` の E2E コマンド記載が新スクリプト名と一致する。
- `e2e/team-division.spec.ts` の2テストが CI 環境で連続3回失敗しなくなる。
- `e2e/helpers/playerHelpers.ts` の `addPlayer` / `addTenPlayers` が、各トグル操作後に
  UI 状態の確定を待ってから次のステップに移るよう修正される。
- `.github/PULL_REQUEST_TEMPLATE.md` が削除される。
- `.github/copilot-instructions.md` ・ `docs/copilot-workflow.md` ・ `.github/prompts/pr-description.prompt.md`
  から `PULL_REQUEST_TEMPLATE.md` への参照が除去される。
- `/pr-description` プロンプトがテンプレートファイルに依存せず、`.steering` から直接内容を生成するルールに更新される。

### 異常系

- スクリプト削除後も、`E2E_USE_REAL_REDIS=false` 環境では `@integration` テストがスキップされ
  Redis なしで全 E2E テストが通過する。
- `E2E_USE_REAL_REDIS=true` 設定時は `@integration` テストが実行される（integration E2E workflow 側）。
- プロンプト変更後も `implement.prompt.md` の境界線（アプリ本体コードは変更しない）が維持される。
- `playerHelpers.ts` 修正後も `addTenPlayers` の実行完了時間が許容範囲内（CI: 60秒以内）に収まる。

---

## スコープ外

- アプリ本体コード（`utils/`, `components/`, `composable/`, `pages/api/`）の変更
- E2E テストケース自体のロジック変更（`@integration` タグの付与状態は変えない）
- CI ジョブ間でのビルドキャッシュ共有など大規模な CI 再設計
- GitHub Actions の `uses` バージョン更新（`.steering/20260503-09` で完結）
- `/pr-description` プロンプト自体の境界線変更（テンプレート履社後の内容更新は実装フェーズで対応）
