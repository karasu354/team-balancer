import type { NextApiRequest, NextApiResponse } from 'next'

import { PlayerService } from '../../services/playerService'
import { VercelRedis } from '../../services/vercelRedis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { apiKey, gameName, tagLine } = req.body

  if (!apiKey || !gameName || !tagLine) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const redis = new VercelRedis()
  const playerService = new PlayerService(apiKey)

  try {
    await redis.connect()

    const cacheKey = `${gameName}#${tagLine}`
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData))
    }

    const playerInfo = await playerService.getPlayerInfo(gameName, tagLine)
    await redis.set(cacheKey, JSON.stringify(playerInfo), 3600) // キャッシュを1時間保存

    res.status(200).json(playerInfo)
  } catch (error) {
    console.error('Error fetching player info:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await redis.disconnect()
  }
}
