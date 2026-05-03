import { PlayersJson } from '../utils/teamBalancer'

const API_BASE_URL = '/api/teams'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isPlayersJson = (value: unknown): value is PlayersJson => {
  if (!isRecord(value)) {
    return false
  }

  const isOptionalNumber = (input: unknown): boolean =>
    input === undefined || typeof input === 'number'

  const maybeMatchHistories = value.matchHistories
  const isMatchHistoriesValid =
    maybeMatchHistories === undefined ||
    (Array.isArray(maybeMatchHistories) &&
      maybeMatchHistories.every((history) => {
        if (!isRecord(history)) {
          return false
        }

        return (
          typeof history.id === 'string' &&
          typeof history.playedAt === 'string' &&
          (history.winnerTeam === 'blue' || history.winnerTeam === 'red') &&
          typeof history.mismatchCount === 'number' &&
          Array.isArray(history.teamsSnapshot) &&
          Array.isArray(history.playerResults) &&
          history.playerResults.every((result) => {
            if (!isRecord(result)) {
              return false
            }

            return (
              typeof result.playerId === 'string' &&
              typeof result.playerName === 'string' &&
              (result.team === 'blue' || result.team === 'red') &&
              (result.result === 'win' || result.result === 'lose') &&
              isOptionalNumber(result.ratingDelta) &&
              isOptionalNumber(result.ratingBefore) &&
              isOptionalNumber(result.ratingAfter)
            )
          })
        )
      }))

  return (
    typeof value.id === 'string' &&
    typeof value.version === 'string' &&
    typeof value.playersTotalCount === 'number' &&
    Array.isArray(value.players) &&
    isMatchHistoriesValid
  )
}

const getMessage = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null
  }

  return typeof value.message === 'string' ? value.message : null
}

export async function getTeamData(teamId: string): Promise<PlayersJson | null> {
  const response = await fetch(`${API_BASE_URL}/${teamId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    return null
  }

  const data: unknown = await response.json()
  return isPlayersJson(data) ? data : null
}

export async function setTeamData(
  teamId: string,
  data: PlayersJson
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to save team data: ${response.statusText}`)
  }

  const result: unknown = await response.json()
  const message = getMessage(result)

  if (!message) {
    throw new Error('Failed to save team data: invalid response body')
  }

  return message
}

export async function deleteTeamHistory(
  teamId: string,
  historyId: string
): Promise<PlayersJson> {
  const response = await fetch(
    `${API_BASE_URL}/${teamId}?historyId=${encodeURIComponent(historyId)}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to delete team history: ${response.statusText}`)
  }

  const data: unknown = await response.json()
  if (!isPlayersJson(data)) {
    throw new Error('Failed to delete team history: invalid response body')
  }

  return data
}
