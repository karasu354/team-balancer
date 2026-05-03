import { NextApiRequest, NextApiResponse } from 'next'

import { VercelRedis } from '../../../services/vercelRedis'
import { PlayersJson, TeamBalancer } from '../../../utils/teamBalancer'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isPlayerJsonLike = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false
  }

  const hasBaseFields =
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.displayRank === 'string' &&
    typeof value.rating === 'number' &&
    typeof value.mainRole === 'string' &&
    typeof value.subRole === 'string' &&
    Array.isArray(value.desiredRoles) &&
    typeof value.isRoleFixed === 'boolean'

  return hasBaseFields
}

const isTeamSide = (value: unknown): value is 'blue' | 'red' => {
  return value === 'blue' || value === 'red'
}

const isPlayerResultLike = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false
  }

  const isOptionalNumber = (input: unknown): boolean => {
    return input === undefined || typeof input === 'number'
  }

  return (
    typeof value.playerId === 'string' &&
    typeof value.playerName === 'string' &&
    isTeamSide(value.team) &&
    (value.result === 'win' || value.result === 'lose') &&
    isOptionalNumber(value.ratingDelta) &&
    isOptionalNumber(value.ratingBefore) &&
    isOptionalNumber(value.ratingAfter)
  )
}

const isTeamsSnapshotPlayerLike = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.playerId === 'string' &&
    typeof value.playerName === 'string' &&
    isTeamSide(value.team) &&
    typeof value.role === 'string'
  )
}

const isMatchHistoryLike = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.playedAt === 'string' &&
    isTeamSide(value.winnerTeam) &&
    typeof value.mismatchCount === 'number' &&
    Array.isArray(value.teamsSnapshot) &&
    value.teamsSnapshot.every((item) => isTeamsSnapshotPlayerLike(item)) &&
    Array.isArray(value.playerResults) &&
    value.playerResults.every((item) => isPlayerResultLike(item))
  )
}

const isPlayersJsonBody = (value: unknown): value is PlayersJson => {
  if (!isRecord(value)) {
    return false
  }

  const players = value.players
  const matchHistories = value.matchHistories

  return (
    typeof value.id === 'string' &&
    typeof value.version === 'string' &&
    typeof value.playersTotalCount === 'number' &&
    Array.isArray(players) &&
    players.every((player) => isPlayerJsonLike(player)) &&
    (matchHistories === undefined ||
      (Array.isArray(matchHistories) &&
        matchHistories.every((history) => isMatchHistoryLike(history))))
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing team ID' })
  }

  const redis = new VercelRedis()
  let isConnected = false

  try {
    await redis.connect()
    isConnected = true

    if (req.method === 'GET') {
      const teamData = await redis.getTeamPlayers(id)

      if (!teamData) {
        return res.status(404).json({ error: 'Team not found' })
      }

      return res.status(200).json(teamData)
    } else if (req.method === 'PUT') {
      const body: unknown = req.body

      if (!isPlayersJsonBody(body)) {
        return res.status(400).json({ error: 'Invalid request body' })
      }

      await redis.setTeamPlayers(id, body)

      return res.status(200).json({ message: 'Team data saved successfully' })
    } else if (req.method === 'DELETE') {
      const historyId =
        typeof req.query.historyId === 'string' ? req.query.historyId : null

      if (!historyId) {
        return res.status(400).json({ error: 'Invalid or missing history ID' })
      }

      const teamData = await redis.getTeamPlayers(id)
      if (!teamData) {
        return res.status(404).json({ error: 'Team not found' })
      }

      const teamBalancer = TeamBalancer.fromJson(teamData)
      teamBalancer.deleteMatchHistory(historyId)
      const updatedTeamData = teamBalancer.playersInfo

      await redis.setTeamPlayers(id, updatedTeamData)

      return res.status(200).json(updatedTeamData)
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (isConnected) {
      await redis.disconnect()
    }
  }
}
