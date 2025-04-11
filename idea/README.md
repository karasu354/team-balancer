## 構想

使用方法の想定
https://developer.riotgames.com/

Player0 #JP1がロビーに参加しました。
Player1 #JP1がロビーに参加しました。
Player2 #JP1がロビーに参加しました。
Player3 #JP1がロビーに参加しました。
Player4 #JP1がロビーに参加しました。
Player5 #JP1がロビーに参加しました。
Player6 #JP1がロビーに参加しました。
Player7 #JP1がロビーに参加しました。
Player8 #JP1がロビーに参加しました。
Player9 #JP1がロビーに参加しました。
https://discord.com/channels/648132459698978816/648135117528629249/1360248923771637770

1. Riot APIのAPIキーを発行し、サイトに登録する。
2. カスタムの入出ログから全プレイヤーの名前とタグを使ってランクをRiot APIから取得
3. オプションで好きなロールを選んだ

## Riot API に関して

サモナー名とタグ名からランク取得するために

1. /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine} で ppid を取得
2. /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID} で summonerId を取得
3. /lol/league/v4/entries/by-summoner/{encryptedSummonerId} で tier と rank を取得

とAPIを3回叩く必要がある。Riot APIの制限は以下の通りですぐ引っかかってしまう。

- 20 requests every 1 seconds(s)
- 100 requests every 2 minutes(s)

そのため、Firebase等を使ってサモナー名とタグ名から summonerId が取得できるように保存して、3個目のみ叩くよう環境を作成する。

1. サモナー名とタグ名を使って Firebase で summonerId を取得
2. /lol/league/v4/entries/by-summoner/{encryptedSummonerId} で tier と rank を取得
