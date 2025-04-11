import { RiotApi } from './riotApi'
import { VercelRedis } from './vercelRedis'

export class PlayerService {
  private riotApi: RiotApi
  private redis: VercelRedis

  constructor(apiKey: string) {
    this.riotApi = new RiotApi(apiKey)
    this.redis = new VercelRedis()
  }

  public async getPlayerInfo(gameName: string, tagLine: string) {
    const cacheKey = `${gameName}#${tagLine}`
    await this.redis.connect()

    // Redisからキャッシュを取得
    const cachedData = await this.redis.getPlayerRank(cacheKey)
    if (cachedData) {
      console.log('Cache hit:', cachedData)
      return cachedData
    }

    // キャッシュがない場合、Riot APIを叩く
    const rankData = await this.riotApi.getSummonerRank(gameName, tagLine)

    // 必要な形式に変換してRedisに保存
    const playerRank = {
      rank: rankData[0].rank,
      tier: rankData[0].tier,
      rate: rankData[0].leaguePoints,
      desiredRole: [1, 1, 1, 1, 1], // デフォルト値
    }
    await this.redis.setPlayerRank(cacheKey, playerRank, 3600) // 1時間キャッシュ

    return playerRank
  }
}
