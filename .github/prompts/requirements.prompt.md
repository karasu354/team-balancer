---
agent: 'agent'
description: '要件定義。実装したい機能を伝えると .steering/ ディレクトリ（requirements.md・design.md・tasks.md）を作成する'
---

# 要件定義

以下のドキュメントを参照し、既存仕様との整合を確認したうえで `.steering/` ディレクトリを作成してください：

- `docs/team-balancer-spec.md` — 現行アプリ仕様
- `docs/team-balancer.v1.yaml` — API仕様
- `.github/copilot-instructions.md` — コーディングルール

---

## 出力先

`.steering/YYYYMMDD-[連番]-[機能名]/` フォルダを作成し、以下の3ファイルを生成してください。
日付は実行日の `YYYYMMDD` 形式、連番は既存フォルダの最大連番+1（01始まり）、機能名はケバブケース。

```
.steering/
└── 20260503-01-feature-name/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

---

## requirements.md の記載内容

- 背景・目的
- ユーザーストーリー（「〜として、〜したい。なぜなら〜」形式）
- 受け入れ条件（正常系 / 異常系）
- スコープ外の明示

## design.md の記載内容

- アーキテクチャ概要
- 影響ディレクトリと責務分離（`utils/`, `components/`, `composable/`, `pages/api/`）
- データモデル・型定義の変更点
- API変更有無と `docs/team-balancer.v1.yaml` への影響
- 既存の `fromJson` / `playersInfo` 互換性への影響

## tasks.md の記載内容

チェックボックス形式で、フェーズ別にグルーピングする。
見積もりは S（30分以内）/ M（半日以内）/ L（1日以内）で付与する。

```markdown
## Phase 1: ロジック

- [ ] utils/teamBalancer.ts に〇〇を追加（S）
- [ ] test/utils/teamBalancer.test.ts にテストを追加（M）

## Phase 2: UI

- [ ] components/〇〇.tsx を作成（M）

## Phase 3: ドキュメント

- [ ] docs/team-balancer-spec.md の機能要件を更新
- [ ] docs/team-balancer.v1.yaml を更新（API変更がある場合）
```

---

## 進め方

- 要望が不明確な場合、実装前に確認事項を箇条書きで質問してください
- 既存仕様との矛盾がある場合は明示し、採用する方針を提案してください
- 3ファイルを作成したら、以下の形式でブランチ名とコミットメッセージ案を提示してください

```
ブランチ名: feature/[機能名]
コミット: feat([機能名]): [変更内容の要約]
```

---

## このプロンプトの境界線

- やること:
    - `.steering/YYYYMMDD-[連番]-[機能名]/` を作成し、`requirements.md` / `design.md` / `tasks.md` を作る
- やらないこと:
    - アプリ本体コード（`utils/`, `components/`, `composable/`, `pages/api/`）の実装変更
    - テストコードの実装変更
    - 既存タスクの実装実行（これは `/implement` の責務）
