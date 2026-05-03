# tasks

## Phase 1: 抽出ルール整備

- [x] `.github/prompts/refactor-check.prompt.md` に対応可否タグ（即時対応可 / 要件化推奨）を追加する（S）
- [x] 出力形式に根拠・改善案・影響見積もり（S/M/L）を追加する（S）
- [x] 不変条件に関わる項目を除外する判定ルールを明文化する（S）
- [x] プロンプト責務境界（refactor-check / requirements / implement）を明文化する（S）
- [x] しきい値超過時に `requirements` へ誘導する条件を定義する（S）
- [x] 外部参照モード（既定OFF）の有効化条件と記録項目を定義する（S）

## Phase 2: 候補の仕分け

- [x] `/refactor-check` を実行し、候補を優先度別に再抽出する（S）
- [x] 抽出結果を「即時対応可 / 要件化推奨」に分類する（S）
- [x] 要件化が必要な候補を別作業として記録する（S）

抽出・分類メモ:

- 即時対応可:
  - `utils/utils.ts`: チャットログ正規表現の冗長記述を簡素化（低リスク）
  - `components/PlayersTable.tsx`: `key=index` を `player.id` に置換（低リスク）
  - `composable/api.ts`: APIレスポンスの型ガード追加（低リスク）
  - `pages/api/teams/[id].ts`: connect/disconnect 管理の重複除去（低リスク）
- 要件化推奨:
  - `components/PlayersTable.tsx` の状態配列分割を reducer 化する設計変更（中〜高影響）
  - API 例外ハンドリング共通化（複数ファイル横断）

## Phase 3: 即時対応の実装

- [x] `utils/` の低リスク候補を反映する（M）
- [x] `components/` の低リスク候補を反映する（M）
- [x] `composable/` / `pages/api/` の低リスク候補を反映する（M）

## Phase 4: テストと検証

- [x] 変更箇所に対応するテストを追加/更新する（M）
- [x] `npm run format` を実行する（S）
- [x] `npm run format:test` を実行し成功を確認する（S）
- [x] `npm run test` を実行し成功を確認する（S）

## Phase 5: ドキュメント反映

- [x] 必要に応じて `docs/team-balancer-spec.md` を更新する（S）※仕様変更なしのため更新不要
- [x] API契約変更がある場合のみ `docs/team-balancer.v1.yaml` を更新する（S）※API契約変更なしのため更新不要
- [x] 対応見送り候補の理由を `.steering` に記録する（S）

## Phase 6: テスト運用整合

- [x] `.github/prompts/implement.prompt.md` の最終確認手順に `npm run test:e2e:fast` を追加する（S）
- [x] `docs/` と `.github/` のテスト記載を監査し、unit / E2E / format の漏れを解消する（M）
- [x] テストディレクトリ命名方針を `test/` に固定し、関連ドキュメントへ明記する（S）

対応見送り理由:

- `components/PlayersTable.tsx` の reducer 化は既存UI更新フローの設計見直しを伴うため、
  今回は要件化推奨として見送る
- API例外ハンドリングの共通化は `composable/` と `pages/api/` 複数境界の再設計が必要なため、
  今回は低リスク範囲外として見送る
