import 'dotenv/config'
import { RedisClientType, createClient } from 'redis'

interface PlayerRank {
  rank: string
  tier: string
  rate: number
  desiredRole: number[]
}

export class VercelRedis {
  private client: RedisClientType

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL })
    this.client.on('error', (err) => console.error('Redis Client Error:', err))
  }

  // Redisに接続
  public async connect() {
    if (!this.client.isOpen) {
      await this.client.connect()
      console.log('Connected to Redis')
    }
  }

  // Redisから切断
  public async disconnect() {
    if (this.client.isOpen) {
      await this.client.disconnect()
      console.log('Disconnected from Redis')
    }
  }

  // データを追加
  public async set(key: string, value: string, ttlInSeconds?: number) {
    await this.connect()
    if (ttlInSeconds) {
      await this.client.set(key, value, { EX: ttlInSeconds }) // TTL付きで保存
    } else {
      await this.client.set(key, value) // TTLなしで保存
    }
    console.log(`Set key "${key}" with value "${value}"`)
  }

  // データを取得
  public async get(key: string): Promise<string | null> {
    await this.connect()
    const value = await this.client.get(key)
    console.log(`Get key "${key}" with value "${value}"`)
    return value
  }

  // データを追加 (PlayerRank型)
  public async setPlayerRank(
    key: string,
    value: PlayerRank,
    ttlInSeconds?: number
  ) {
    await this.connect()
    const valueString = JSON.stringify(value) // オブジェクトを文字列に変換
    if (ttlInSeconds) {
      await this.client.set(key, valueString, { EX: ttlInSeconds }) // TTL付きで保存
    } else {
      await this.client.set(key, valueString) // TTLなしで保存
    }
    console.log(`Set key "${key}" with value "${valueString}"`)
  }

  // データを取得 (PlayerRank型)
  public async getPlayerRank(key: string): Promise<PlayerRank | null> {
    await this.connect()
    const valueString = await this.client.get(key)
    if (valueString) {
      const value: PlayerRank = JSON.parse(valueString) // 文字列をオブジェクトに変換
      console.log(`Get key "${key}" with value "${valueString}"`)
      return value
    }
    console.log(`Key "${key}" not found`)
    return null
  }

  // すべてのデータを削除
  public async flushAll() {
    await this.connect()
    await this.client.flushAll()
    console.log('All data in Redis has been deleted.')
  }
}
