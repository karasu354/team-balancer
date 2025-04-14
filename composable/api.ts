import { PlayersJson } from '../utils/teamDivider'

const API_BASE_URL = '/api/teams'

export async function getTeamData(teamId: string): Promise<PlayersJson | null> {
  const response = await fetch(`${API_BASE_URL}/${teamId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    console.error(`Failed to fetch team data: ${response.statusText}`)
    return null
  }

  return response.json()
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

  const result = await response.json()
  return result.message
}
