---
agent: 'agent'
description: 'タスク分解。機能要件をレイヤー別タスクに分解し、実装順・見積もり・ブランチ名・コミット案を出力して .steering/tasks.md に反映する'
---

# タスク分解

以下のドキュメントを参照し、機能要件をレイヤー別タスクに分解してください：

- `.steering/*/requirements.md` — 要件（対象機能の受け入れ条件）
- `.steering/*/design.md` — 設計（影響ディレクトリ・データモデル）
- `docs/team-balancer-spec.md` — 現行アプリ仕様
- `.github/copilot-instructions.md` — コーディングルール

---

## 出力形式

`.steering/*/tasks.md` を以下の形式で作成・更新してください。

```markdown
## Phase 1: ロジック

- [ ] utils/teamBalancer.ts に〇〇を追加（S）
- [ ] test/utils/teamBalancer.test.ts にテストを追加（M）

## Phase 2: UI

- [ ] components/〇〇.tsx を作成（M）
- [ ] pages/index.tsx に〇〇コンポーネントを組み込む（S）

## Phase 3: API（変更がある場合）

- [ ] pages/api/teams/[id].ts を更新（M）
- [ ] docs/team-balancer.v1.yaml を更新（S）

## Phase 4: ドキュメント

- [ ] docs/team-balancer-spec.md の機能要件を更新（S）
```

---

## 分解ルール

- 1タスク = 1つの完了条件（複数の変更を1タスクにまとめない）
- 見積もりは S（30分以内）/ M（半日以内）/ L（1日以内）で付与する
- `utils/` の変更には必ず対応するテストタスクをセットで追加する
- API変更がある場合は `docs/team-balancer.v1.yaml` の更新タスクを必ず含める
- 依存関係がある場合はフェーズ順を守る（ロジック → UI → API → ドキュメント）

---

## 出力の末尾に必ず追記すること

```
ブランチ名: feature/[機能名]
初回コミット: feat([機能名]): add [機能の概要]
```
