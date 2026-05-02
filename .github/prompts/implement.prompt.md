---
agent: 'agent'
description: '機能を utils → components → composable → pages/api の順で一貫して実装する'
---

# 機能実装

## 実行前ガード（必須）

以下をすべて満たす場合のみ実装を開始してください。

1. `.steering/` 配下に作業フォルダが1件以上存在する
2. 最新フォルダ（`YYYYMMDD-[連番]-[機能名]` で最大のもの）が特定できる
3. 最新フォルダに `requirements.md` / `design.md` / `tasks.md` が存在する

上記を満たさない場合は**実装を中止**し、次の形式で返答してください。

```
実装を開始できません。
理由:
- 最新の .steering が存在しない、または requirements.md / design.md / tasks.md が不足しています。

対応:
- 先に /requirements を実行して .steering を作成してください。
```

この中止ケースでは、コード変更・ファイル作成を行わないこと。

`.steering/` ディレクトリ内の要件・設計・タスクを必ず参照し、それに従って実装してください：

- `requirements.md` — 何を実装するか（機能要件・制約）
- `design.md` — どう実装するか（型定義・ロジック設計・コンポーネント構成）
- `tasks.md` — どのタスクを対象とするか（未完了チェックボックスを確認）

実装完了後は、`tasks.md` の対応するチェックボックスを完了済みに更新してください。

---

## このプロンプトの境界線

- やること:
	- 最新 `.steering` の `tasks.md` にある未完了タスクを実装する
	- 実装に対応するテスト・ドキュメント更新を行う
	- 実装完了タスクを `tasks.md` で完了に更新する
- やらないこと:
	- `.steering` の新規作成（これは `/requirements` の責務）
	- タスク分解の再設計（これは `/task-breakdown` の責務）
	- レビュー専用の指摘出力（これは `/review` の責務）
	- コミットメッセージ生成（これは `/commit-message` の責務）

---

## 実装順序

必ず以下の順で実装してください。各レイヤーが完成してから次へ進む。

```
1. utils/        ドメインロジック・型定義（TeamBalancer, Player 等）
2. components/   React コンポーネント（UI の描画・イベント委譲）
3. composable/   API 呼び出しラッパー（composable/api.ts）
4. pages/api/    API Routes（入力検証・Redis 操作）
5. test/utils/   ユニットテスト（utils/ の変更に対応）
6. docs/         仕様・API 仕様の更新
```

---

## 実装ルール

### TypeScript
- `strict: true` 準拠：`any` 禁止、戻り値型を必ず明示
- 既存の型（`PlayersJson`, `PlayerJson`, `Player`, `TeamBalancer` 等）を再利用する
- `as` キャストは原則禁止（使う場合はコメントで理由を説明）

### ドメインロジック（`utils/`）
- チーム分割ロジックは `utils/teamBalancer.ts` に集約する
- プレイヤーロジックは `utils/player.ts` に集約する
- 副作用のない純粋関数のみ `utils/utils.ts` に置く
- 不変条件を守る：参加プレイヤーがちょうど10人のときのみ分割実行
- 評価スコアの重み（0.3 / 0.5 / 0.2）は仕様変更がない限り変更しない
- `fromJson` / `playersInfo` の入出力互換性を壊さない

### React コンポーネント（`components/`）
- Props は必ず型定義する：`interface XxxProps { ... }`
- イベントハンドラは型を明示する：`React.MouseEvent`, `React.ChangeEvent` 等
- ビジネスロジックをコンポーネントに書かない（`utils/` に委譲）
- 1ファイル100行以内を目安
- Tailwind CSS のみ（インラインスタイル禁止）

### API Routes（`pages/api/`）
- 入力値の型と必須項目を必ず検証する
- HTTP ステータスを適切に返す（400 / 404 / 405 / 500）
- 機密情報・内部スタックトレースをレスポンスに含めない
- API 仕様を変更した場合は `docs/team-balancer.v1.yaml` を同時更新する

### ユニットテスト（`test/utils/`）
- `utils/` の変更には必ず対応するテストを追加・更新する
- 境界値を必ずカバーする：0件・10件・11件・50件
- 実行：`npm run test:unit`
