---
agent: 'ask'
description: '.steering 1件=1コミット。対象 .steering フォルダの実装差分に対して Conventional Commits 形式のコミットメッセージを1件生成する'
---

# コミットメッセージ生成

以下のドキュメントを参照し、対象 `.steering` フォルダに対応するコミットメッセージを生成してください：

- `.steering/[YYYYMMDD]-[連番]-[機能名]/requirements.md` — 変更の目的
- `.steering/[YYYYMMDD]-[連番]-[機能名]/design.md` — 設計上の変更点
- `.steering/[YYYYMMDD]-[連番]-[機能名]/tasks.md` — 完了タスク
- `.github/copilot-instructions.md` — コミットメッセージのルール

---

## 生成ルール

### フォーマット

```
<type>(<scope>): <概要>

<本文（任意）>
```

### 必須ルール（このプロジェクト固有）

- **`.steering` フォルダ1件につき、コミットは1件にする**
- まず対象フォルダを1つ特定する（例: `.steering/20260503-02-e2e-redis-strategy/`）
- そのフォルダに紐づく差分のみを要約する
- 複数の `.steering` フォルダの差分が混在している場合は、フォルダごとにコミットを分割提案する
- 対象 `.steering` の `tasks.md` が未完了なら、コミット確定前に注意喚起する

### type の選び方

| type | 使う状況 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `refactor` | 機能変更を伴わないリファクタリング |
| `test` | テストの追加・修正 |
| `docs` | ドキュメントのみの変更 |
| `chore` | ビルド設定・依存関係など |

### scope の選び方

変更の主な対象ファイル・機能名をケバブケースで指定する。

| 変更箇所 | scope 例 |
|---|---|
| `utils/teamBalancer.ts` | `team-balancer` |
| `utils/player.ts` | `player` |
| `components/` 配下 | コンポーネント名（例: `player-card`） |
| `pages/api/` 配下 | `api` |
| `docs/` 配下 | `docs` |
| `.github/` 配下 | `copilot` |

### 概要の書き方

- 日本語で書く
- 50文字以内を目安にする
- 命令形で書く（「〇〇を追加する」「〇〇を修正する」）
- 何を変えたかを書く（なぜは本文に書く）

### 本文の書き方（変更規模が大きい場合のみ）

- なぜその変更をしたかを書く
- 72文字で折り返す
- 複数の変更がある場合は箇条書きで列挙する

---

## 出力形式

以下をこの順序で出力してください。

```
対象 .steering: .steering/20260503-02-e2e-redis-strategy/
判定: 1 .steering = 1 commit（適合）

コミットメッセージ（1件）:
feat(e2e): Redis依存を分離した実行モードを追加する

本文（必要な場合のみ）:
- Fast E2E と Integration E2E を分離
- 実行コマンドと運用ドキュメントを更新
```

コミットメッセージは候補を複数提示せず、**1件のみ**出力する。

---

## このプロンプトの境界線

- やること:
	- 対象 `.steering` 1件に対するコミットメッセージを1件だけ生成する
- やらないこと:
	- コード変更・ドキュメント変更
	- 複数 `.steering` を1件にまとめる提案
