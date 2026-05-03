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

const getTeamId = (id: string | string[] | undefined): string | null => {
  return typeof id === 'string' && id ? id : null
}

const getHistoryId = (
  historyId: string | string[] | undefined
): string | null => {
  return typeof historyId === 'string' && historyId ? historyId : null
}

const normalizePlayersJson = (playersJson: PlayersJson): PlayersJson => {
  return TeamBalancer.fromJson(playersJson).playersInfo
}

const handleGetRequest = async (
  teamId: string,
  redis: VercelRedis,
  res: NextApiResponse
): Promise<void> => {
  const teamData = await redis.getTeamPlayers(teamId)

  if (!teamData) {
    res.status(404).json({ error: 'Team not found' })
    return
  }

  res.status(200).json(teamData)
}

const handlePutRequest = async (
  teamId: string,
  body: unknown,
  redis: VercelRedis,
  res: NextApiResponse
): Promise<void> => {
  if (!isPlayersJsonBody(body)) {
    res.status(400).json({ error: 'Invalid request body' })
    return
  }

  await redis.setTeamPlayers(teamId, normalizePlayersJson(body))

  res.status(200).json({ message: 'Team data saved successfully' })
}

const handleDeleteRequest = async (
  teamId: string,
  historyId: string | null,
  redis: VercelRedis,
  res: NextApiResponse
): Promise<void> => {
  if (!historyId) {
    res.status(400).json({ error: 'Invalid or missing history ID' })
    return
  }

  const teamData = await redis.getTeamPlayers(teamId)
  if (!teamData) {
    res.status(404).json({ error: 'Team not found' })
    return
  }

  const teamBalancer = TeamBalancer.fromJson(teamData)
  teamBalancer.deleteMatchHistory(historyId)
  const updatedTeamData = teamBalancer.playersInfo

  await redis.setTeamPlayers(teamId, updatedTeamData)

  res.status(200).json(updatedTeamData)
}

const handleMethodNotAllowed = (
  req: NextApiRequest,
  res: NextApiResponse
): void => {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const teamId = getTeamId(req.query.id)

  if (!teamId) {
    return res.status(400).json({ error: 'Invalid or missing team ID' })
  }

  if (req.method === 'PUT' && !isPlayersJsonBody(req.body)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    handleMethodNotAllowed(req, res)
    return
  }

  let isConnected = false
  let redis: VercelRedis | null = null

  try {
    redis = new VercelRedis()
    await redis.connect()
    isConnected = true

    if (req.method === 'GET') {
      await handleGetRequest(teamId, redis, res)
      return
    }

    if (req.method === 'PUT') {
      await handlePutRequest(teamId, req.body, redis, res)
      return
    }

    await handleDeleteRequest(
      teamId,
      getHistoryId(req.query.historyId),
      redis,
      res
    )
    return
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    if (isConnected && redis) {
      await redis.disconnect()
    }
  }
}
