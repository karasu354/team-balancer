---
agent: 'ask'
description: '対象 .steering 1件の変更内容から、PR本文を .github/PULL_REQUEST_TEMPLATE.md 形式で1件生成する'
---

# PR本文生成

以下を参照して、PR本文を1件生成してください。

- `.steering/[YYYYMMDD]-[連番]-[機能名]/requirements.md`
- `.steering/[YYYYMMDD]-[連番]-[機能名]/design.md`
- `.steering/[YYYYMMDD]-[連番]-[機能名]/tasks.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/copilot-instructions.md`

## 生成ルール

- 対象 `.steering` は1件だけ選ぶ
- 本文は `.github/PULL_REQUEST_TEMPLATE.md` の見出し構成を維持する
- 必須項目 `背景 / 変更内容 / テスト結果 / 影響範囲 / レビューポイント` を必ず埋める
- 推測で埋めず、情報不足がある場合は「不足情報」セクションに明示する
- テスト結果には実行コマンドと pass/fail を書く
- 箇条書きは短く、レビュー観点が分かる粒度にする
- Description が自動で埋まらないケースを想定し、テンプレート必須項目を空欄で出力しない

## 出力形式

```text
対象 .steering: .steering/20260503-04-pr-quality-and-test-stabilization/

## 背景
...

## 変更内容
- ...

## テスト結果
- npm run test:unit: pass
- npm run test:e2e:fast: pass

## 影響範囲 / リスク
...

## レビューポイント
...

## チェックリスト
- [x] ...

## 不足情報
- なし
```

## このプロンプトの境界線

- やること:
  - PR本文をテンプレートに沿って生成する
- やらないこと:
  - コード修正やファイル編集
  - コミットメッセージ生成
  - 複数 `.steering` を1つのPR本文に統合
