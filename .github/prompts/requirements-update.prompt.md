---
agent: 'agent'
description: '要件・設計・タスク修正。実装中・実装後のフィードバックにより既存 .steering の requirements.md / design.md / tasks.md を追記・修正する'
---

# 要件・設計・タスク修正

## 操作可能範囲（明確化）

```
✅ 操作可能:
  - 対象 .steering/[フォルダ名]/requirements.md（追記・修正のみ）
  - 対象 .steering/[フォルダ名]/design.md（追記・修正のみ）
  - 対象 .steering/[フォルダ名]/tasks.md（追記・修正のみ）

🔍 参照のみ（変更禁止）:
  - docs/
  - .github/copilot-instructions.md
  - アプリ本体コード（utils/, components/ など）
  - 対象外の .steering/ フォルダ
```

---

既存の `.steering/[YYYYMMDD]-[連番]-[機能名]/` 配下の以下ファイルを修正してください。

- `requirements.md`
- `design.md`
- `tasks.md`

以下のドキュメントを参照し、既存仕様との整合を確認したうえで更新してください：

- `docs/team-balancer-spec.md` — 現行アプリ仕様
- `docs/team-balancer.v1.yaml` — API仕様
- `.github/copilot-instructions.md` — コーディングルール

---

## 修正前確認テスト（チェックリスト形式）

**修正を始める前に、以下を確認してください。**

```
□ Q1: 修正理由は何ですか？ 実装中に判明した問題 or 実装後のレビューフィードバック？
      ➡️ 理由を簡潔に説明してください

□ Q2: 修正対象ファイルを選択してください（複数選択可）:
      □ requirements.md のみ
      □ design.md のみ
      □ tasks.md のみ
      □ 全て

□ Q3: この修正の影響度は？
      ◎ A) Low（タスク分解や説明の微調整）
        B) Medium（仕様の部分的な変更、新タスク追加）
        C) High（全体的な仕様変更、API 互換性の破壊）

➡️ 修正内容を簡潔に説明してから修正を開始
```

---

## 対象フォルダの特定

1. `.steering/` 配下のフォルダ一覧を確認する
2. 最新フォルダ（`YYYYMMDD-[連番]-[機能名]` で最大のもの）を対象とする
3. 対象フォルダの `requirements.md` / `design.md` / `tasks.md` を読み込んでから修正を行う

対象フォルダが不明確な場合は、作業前にフォルダ名を確認してください。

---

## 修正できる内容

- `requirements.md`
  - **背景・目的** の追記・修正
  - **ユーザーストーリー** の追加・変更
  - **受け入れ条件**（正常系 / 異常系）の追加・変更
  - **スコープ外の明示** の追加・変更
  - 問題点リストへの新規項目追加
- `design.md`
  - アーキテクチャ概要・責務分離の追記・修正
  - 影響ディレクトリ・型・互換性方針の追記・修正
  - 実装方針・検証方針の追記・修正
- `tasks.md`
  - 未完了タスクの追加・分解・見積もり更新
  - フェーズ構成の再編（必要な場合のみ）
  - 完了条件の明確化

---

## 修正時の注意

- 既存の受け入れ条件や問題点リストは、明示的に削除が指示されない限り残す
- 既存仕様との矛盾がある場合は明示し、採用する方針を提案してから修正する
- `requirements.md` / `design.md` / `tasks.md` の整合が崩れないように同時に更新する
- 修正後は変更内容を箇条書きで報告する

---

## 修正後の確認報告

修正完了後は、以下のフォーマットで報告してください：

```
✅ 修正完了

修正ファイル:
- [ ] requirements.md
- [ ] design.md
- [ ] tasks.md

変更概要:
- 変更内容1
- 変更内容2
- ...

影響範囲:
- 実装タスク への影響
- 既存機能 への影響
```

---

## このプロンプトの境界線

> **重要**: このプロンプトが触れてよいファイルは **対象 `.steering/` フォルダ内の `requirements.md` / `design.md` / `tasks.md` のみ**。
> 指示内容に応じて他ファイルの変更が必要に思えても、このプロンプト内では実行しない。

- やること:
  - 対象 `.steering/[フォルダ名]/requirements.md` の追記・修正
  - 対象 `.steering/[フォルダ名]/design.md` の追記・修正
  - 対象 `.steering/[フォルダ名]/tasks.md` の追記・修正
- やらないこと（たとえ要件変更の影響があっても、このプロンプトでは変更しない）:
  - 新規 `.steering` フォルダの作成（これは `/requirements` の責務）
  - アプリ本体コード（`utils/`, `components/`, `composable/`, `pages/api/`）の変更
  - テストコード（`test/`, `e2e/`）の変更
  - プロンプトファイル（`.github/prompts/`）の変更
  - ドキュメント（`docs/`）の変更
  - CI 設定（`.github/workflows/`）の変更
  - コーディングルール（`.github/copilot-instructions.md`）の変更
  - その他 `.steering/[対象フォルダ]/requirements.md` / `design.md` / `tasks.md` 以外のすべてのファイル
