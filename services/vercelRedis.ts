import 'dotenv/config'
import { RedisClientType, createClient } from 'redis'

import { PlayersJson } from '../utils/teamBalancer'

export const createTeamPlayersKey = (teamId: string): string => {
  return `teams:${teamId}:players`
}

const getRequiredRedisUrl = (redisUrl: string | undefined): string => {
  if (!redisUrl || !redisUrl.trim()) {
    throw new Error('REDIS_URL is not configured')
  }

  return redisUrl
}

export class VercelRedis {
  private client: RedisClientType

  constructor(redisUrl?: string) {
    this.client = createClient({
      url: getRequiredRedisUrl(redisUrl ?? process.env.REDIS_URL),
    })
  }

  public async connect() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async disconnect() {
    if (this.client.isOpen) {
      await this.client.disconnect()
    }
  }

  public async getTeamPlayers(teamId: string): Promise<PlayersJson | null> {
    const data = await this.client.get(createTeamPlayersKey(teamId))
    if (data) {
      return JSON.parse(data) as PlayersJson
    }
    return null
  }

  public async setTeamPlayers(
    teamId: string,
    players: PlayersJson
  ): Promise<void> {
    await this.client.set(createTeamPlayersKey(teamId), JSON.stringify(players))
  }

  public async flushAll() {
    await this.client.flushAll()
  }
}
