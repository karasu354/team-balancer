import 'dotenv/config'
import { RedisClientType, createClient } from 'redis'

import { PlayersJson } from '../utils/teamDivider'

export class VercelRedis {
  private client: RedisClientType

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL })
    this.client.on('error', (err) => console.error('Redis Client Error:', err))
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
    const data = await this.client.get(`teams:${teamId}:players`)
    if (data) {
      return JSON.parse(data) as PlayersJson
    }
    return null
  }

  public async setTeamPlayers(
    teamId: string,
    players: PlayersJson
  ): Promise<void> {
    await this.client.set(`teams:${teamId}:players`, JSON.stringify(players))
  }

  public async flushAll() {
    await this.client.flushAll()
  }
}
