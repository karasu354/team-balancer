# tasks

## Phase 1: 要件差分の確定

- [x] 追加要望4点（入力文字色、準備率削除、入力アコーディオン、分割/履歴タブ）の仕様文言を確定（S）
- [x] 既存仕様（10人条件、重み、JSON互換性、API契約）に非変更であることを確認（S）

## Phase 2: 入力視認性の改善

- [x] 白背景の入力コントロールを洗い出す（Input/Dropdown/Textarea）（S）
- [x] 白背景入力の文字色を黒へ統一する（S）
- [x] フォーカス時の可読性（背景・文字・枠）を調整する（S）

## Phase 3: プレイヤー追加アコーディオン化

- [x] プレイヤー追加セクションの開閉 state を追加（S）
- [x] アコーディオンヘッダーを実装し、開閉UIを提供（S）
- [x] 初期状態は開いた状態にし、既存入力導線を維持（S）

## Phase 4: 分割画面の情報整理

- [x] 「分割準備率（%）」表示を削除し、参加人数表示へ一本化（S）
- [x] チーム分割領域を「分割結果 / 履歴」タブで切り替えるUIを追加（M）
- [x] タブ切替時の状態保持（分割結果・履歴選択状態）を確認（S）

## Phase 5: テストと回帰確認

- [x] e2e の分割画面・入力画面のセレクタ影響を確認し必要なら更新（M）
- [x] npm run format を実行（S）
- [x] npm run format:test を実行（S）
- [x] npm run typecheck を実行（S）
- [x] npm run test を実行（S）
- [x] npm run test:e2e を実行（M）

## Phase 6: 完了条件

- [x] 4つの追加要望が requirements / design / tasks の3ファイルで整合している（S）
- [x] 既存仕様（10人条件、評価重み、互換性、API非変更）を壊していないことを確認（S）

## Phase 7: テキスト視認性の全面改善

### 7-1: PlayerCard のダークテーマ対応

- [x] PlayerCard.tsx の light 系固定カラー（bg-gray-200, border-gray-300, text-gray-600 等）を洗い出す（S）
- [x] 各クラスを CSS テーマ変数クラスへ置換する（S）
  - bg-gray-200 → bg-[var(--tb-surface)]
  - text-gray-600 → text-[var(--tb-text-secondary)]
  - border-gray-300 → border-[var(--tb-border)]
- [x] 展開・編集・削除モードそれぞれの状態でテキストが視認可能か確認する（S）

### 7-2: Input 系ラベル文字色の統一

- [x] InputText / Dropdown / CheckBox / Textarea のラベルに text-slate-700 がある箇所を洗い出す（S）
- [x] ラベル文字色を `text-[var(--tb-text-primary)]` へ置換する（S）
- [x] フォーカス・エラー状態でも視認性が保たれることを確認する（S）

### 7-3: PlayerInputForm の進捗バー廃止

- [x] PlayerInputForm の進捗バー（progressWidthClassByCount 等）を削除する（S）
- [x] アコーディオンヘッダーに「{count}/10人」テキスト表示のみ残す（S）

### 7-4: 全体 light 系カラー棚卸し

- [x] components/ 配下の全ファイルで text-gray-_, text-slate-_, bg-gray-_, border-gray-_ を grep し一覧化する（S）
- [x] 各箇所をダークテーマ対応クラスまたは CSS テーマ変数へ置換する（M）
  - Display/PlayerNameDisplay.tsx: text-slate-500 → text-[var(--tb-text-secondary)]
  - Display/PlayerInfoDisplay.tsx: text-gray-200 / text-gray-600 / divide-gray-400 → CSS 変数
  - BulkEditRow.tsx: text-slate-600 / text-slate-500 → text-[var(--tb-text-secondary)]
  - MatchHistoryAccordion.tsx: bg-white / text-slate-900 / text-slate-500 / bg-slate-200 → CSS 変数
- [x] PlayerCard 以外で未対応の light 固定色がないことを確認する（S）

### 7-5: 回帰確認

- [x] npm run format を実行（S）
- [x] npm run format:test を実行（S）
- [x] npm run typecheck を実行（S）
- [x] npm run test を実行（S）
- [x] npm run test:e2e を実行（M）

## Phase 8: Phase 7 完了条件

- [x] PlayerCard 上のすべてのテキストがダーク背景で視認できることを目視確認する（S）
- [x] Input 系ラベルがダーク背景で視認できることを目視確認する（S）
- [x] PlayerInputForm に進捗バーが表示されないことを確認する（S）
- [x] UI 全体で light 系固定色が残っていないことを確認する（S）
- [x] requirements / design / tasks の3ファイルが整合していることを確認する（S）

## Phase 9: 画面配色と情報量の再整理

### 9-1: 一括編集のダークテーマ統一

- [x] 一括編集領域で白背景が強い箇所を洗い出す（S）
- [x] 対象箇所をダークテーマ変数ベースの背景/文字色へ置換する（M）
- [x] 長時間編集時に視認負荷が高くない配色か目視確認する（S）

### 9-2: 入力プレビュー位置の変更

- [x] 入力プレビュー表示コンポーネントの配置箇所を特定する（S）
- [x] 入力プレビューをプレイヤー追加フォームの上へ移動する（S）
- [x] モバイル表示でもレイアウト崩れがないことを確認する（S）

### 9-3: PlayerInputForm の表示簡素化

- [x] プレイヤー追加フォーム内の人数表示（x/10）を削除する（S）
- [x] 「10人揃いました。チーム分けを実行できます」メッセージを削除する（S）
- [x] 分割実行可否が別導線（ボタン状態/補助文言）で判別できることを確認する（S）

### 9-4: サンプルデータ投入ボタンの表示制御

- [x] サンプルデータ投入ボタンの描画箇所と表示条件を特定する（S）
- [x] プレイヤー0人時のみ表示、1人以上で非表示へ変更する（S）
- [x] 既存プレイヤーがいる状態で誤投入が発生しないことを確認する（S）

### 9-5: サブタイトル文言の削除

- [x] 「OPGG風〜」サブタイトルの描画箇所を特定する（S）
- [x] サブタイトル文言を削除する（S）
- [x] ヘッダーの主要導線（ロゴ/保存済みチーム導線）が維持されることを確認する（S）

### 9-6: 回帰確認

- [x] npm run format を実行（S）
- [x] npm run format:test を実行（S）
- [x] npm run typecheck を実行（S）
- [x] npm run test を実行（S）
- [x] npm run test:e2e を実行（M）

## Phase 10: Phase 9 完了条件

- [x] 一括編集画面がダークテーマ基調で統一され、白背景が過度に目立たないことを確認する（S）
- [x] 入力プレビューがプレイヤー追加フォームの上にあることを確認する（S）
- [x] プレイヤー追加フォーム内に人数表示（x/10）と達成メッセージがないことを確認する（S）
- [x] プレイヤー1人以上のときサンプルデータ投入ボタンが非表示であることを確認する（S）
- [x] サブタイトル「OPGG風〜」が表示されないことを確認する（S）
- [x] requirements / design / tasks の3ファイルが整合していることを確認する（S）

## Phase 11: 分割体験と評価ロジックの改善

### 11-1: 文言の日本語統一（分割エリア）

- [x] 「Copy to Clipboard」表示箇所を特定する（S）
- [x] 文言を「クリップボードにコピー」へ変更する（S）
- [x] 周辺ボタン文言との日本語トーン整合を確認する（S）

### 11-2: 分割結果/履歴タブ切替時のズレ抑制

- [x] タブ切替で高さ差が発生するコンテナを特定する（S）
- [x] 共通の固定高または最小高を設定して下端ズレを抑制する（M）
- [x] 最下部スクロール位置での切替時に視覚ジャンプがないことを確認する（S）

### 11-3: 分割実行中の状態可視化

- [x] チーム分け実行中フラグに応じた表示分岐を整理する（S）
- [x] 実行中は旧結果を隠し、ローディング/プレースホルダ表示へ切り替える（S）
- [x] ユーザーが「新しくチーム分け中」と判別できる文言を追加する（S）

### 11-4: 評価スコア重みの再調整

- [x] 現行重み（0.3 / 0.5 / 0.2）の寄与を確認する（S）
- [x] 総レート差の寄与を下げる候補重みを比較し採用値を決定する（M）
- [x] 採用値に合わせて関連ユニットテストを更新する（M）
- [x] 仕様変更として docs/team-balancer-spec.md の評価式記載更新タスクを実施する（S）

### 11-5: 試合結果確定の再確認と状態リセット

- [x] 試合結果確定のトリガー箇所を特定する（S）
- [x] 確定前の再確認ステップ（ダイアログ等）を追加する（S）
- [x] 確定後に勝敗選択 state を初期化する（S）
- [x] 連続確定時に前回選択が残らないことを確認する（S）

### 11-6: 回帰確認

- [x] npm run format を実行（S）
- [x] npm run format:test を実行（S）
- [x] npm run typecheck を実行（S）
- [x] npm run test を実行（S）
- [x] npm run test:e2e を実行（M）

## Phase 12: Phase 11 完了条件

- [x] 分割エリアのコピー文言が日本語で統一されていることを確認する（S）
- [x] 分割結果/履歴タブ切替時の下端ズレが解消していることを確認する（S）
- [x] 分割実行中に旧結果が残らず、新規計算中表示が出ることを確認する（S）
- [x] 重み調整後の評価結果とテストが整合していることを確認する（S）
- [x] 試合結果確定時に再確認が動作し、確定後に選択状態がクリアされることを確認する（S）
- [x] requirements / design / tasks の3ファイルが整合していることを確認する（S）
