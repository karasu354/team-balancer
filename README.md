# Team Divider

このプロジェクトは、**League of Legends**などのゲームで公平なチーム分けを行うためのツールです。プレイヤーのレートやロール（役割）を考慮し、バランスの取れたチームを自動で生成します。

<p align="center">
  <img src="./public/logo.svg" alt="Team Divider ロゴ" width="150">
</p>

## 主な機能

- プレイヤー情報の登録（名前、ランク、希望ロールなど）
- 公平なチーム分けロジック（レート差やロールのバランスを考慮）
- チームデータの保存と呼び出し（Redisを使用）
- ユーザーフレンドリーなインターフェース

## 導入方法

### 必要条件

- Node.js（バージョン16以上）
- npm または yarn
- Redis サーバー

### セットアップ手順

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/your-repo/team-division.git
   cd team-division
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   # または
   yarn install
   ```

3. **環境変数を設定**
   プロジェクトルートに`.env.local`ファイルを作成し、以下の内容を記述してください：

   ```env
   REDIS_URL=redis://localhost:6379
   ```

4. **開発サーバーを起動**

   ```bash
   npm run dev
   # または
   yarn dev
   ```

   ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 使用方法

1. **プレイヤー情報を登録**

   - プレイヤー名、ランク、希望ロールを入力して登録します。

2. **チーム分けを実行**

   - 登録されたプレイヤー情報を基に、バランスの取れたチームを自動生成します。

3. **チームデータの保存と呼び出し**
   - チームデータをRedisに保存し、後で呼び出すことができます。
