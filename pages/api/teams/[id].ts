import { NextApiRequest, NextApiResponse } from 'next'

import { VercelRedis } from '../../../services/vercelRedis'
import { PlayersJson } from '../../../utils/teamBalancer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing team ID' })
  }

  const redis = new VercelRedis()

  try {
    if (req.method === 'GET') {
      await redis.connect()
      const teamData = await redis.getTeamPlayers(id)
      await redis.disconnect()

      if (!teamData) {
        return res.status(404).json({ error: 'Team not found' })
      }

      return res.status(200).json(teamData)
    } else if (req.method === 'PUT') {
      const body: PlayersJson = req.body

      if (!body || !Array.isArray(body.players)) {
        return res.status(400).json({ error: 'Invalid request body' })
      }

      await redis.connect()
      await redis.setTeamPlayers(id, body)
      await redis.disconnect()

      return res.status(200).json({ message: 'Team data saved successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
