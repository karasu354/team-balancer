import axios from 'axios'

export class RiotApi {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, region: string = 'jp1') {
    this.apiKey = apiKey
    this.baseUrl = `https://${region}.api.riotgames.com`
  }

  // サモナー名とタグ名からランクを取得するメソッド
  public async getSummonerRank(gameName: string, tagLine: string) {
    try {
      // 1. ppid を取得
      const ppid = await this.getPuuid(gameName, tagLine)

      // 2. summonerId を取得
      const summonerId = await this.getSummonerId(ppid)

      // 3. tier と rank を取得
      const rankData = await this.getRank(summonerId)

      return rankData
    } catch (error) {
      console.error('Error fetching summoner rank:', error)
      throw error
    }
  }

  private async getPuuid(gameName: string, tagLine: string): Promise<string> {
    const response = await axios.get(
      `${this.baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        headers: {
          'X-Riot-Token': this.apiKey,
        },
      }
    )
    return response.data.puuid
  }

  private async getSummonerId(ppid: string): Promise<string> {
    const response = await axios.get(
      `${this.baseUrl}/lol/summoner/v4/summoners/by-puuid/${ppid}`,
      {
        headers: {
          'X-Riot-Token': this.apiKey,
        },
      }
    )
    return response.data.id
  }

  private async getRank(summonerId: string): Promise<any[]> {
    const response = await axios.get(
      `${this.baseUrl}/lol/league/v4/entries/by-summoner/${summonerId}`,
      {
        headers: {
          'X-Riot-Token': this.apiKey,
        },
      }
    )
    return response.data.map((entry: any) => ({
      queueType: entry.queueType,
      tier: entry.tier,
      rank: entry.rank,
      leaguePoints: entry.leaguePoints,
    }))
  }
}
