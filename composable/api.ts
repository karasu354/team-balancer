import { PlayersJson } from '../utils/teamBalancer'

const API_BASE_URL = '/api/teams'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isPlayersJson = (value: unknown): value is PlayersJson => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.version === 'string' &&
    typeof value.playersTotalCount === 'number' &&
    Array.isArray(value.players)
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
