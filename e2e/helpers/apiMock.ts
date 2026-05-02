import { Page } from '@playwright/test'

import { PlayersJson } from '../../utils/teamBalancer'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isPlayersJsonLike = (value: unknown): value is PlayersJson => {
  if (!isRecord(value)) {
    return false
  }

  const players = value.players
  return Array.isArray(players)
}

/**
 * `/api/teams/:id` をモックし、Fast E2E で Redis 依存を排除する。
 */
export const setupTeamApiMock = async (page: Page): Promise<void> => {
  const mockStore = new Map<string, PlayersJson>()

  await page.route('**/api/teams/*', async (route) => {
    const request = route.request()
    const requestUrl = request.url()
    const teamId = requestUrl.split('/').pop()

    if (!teamId) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid or missing team ID' }),
      })
      return
    }

    if (request.method() === 'GET') {
      const teamData = mockStore.get(teamId)
      if (!teamData) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Team not found' }),
        })
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(teamData),
      })
      return
    }

    if (request.method() === 'PUT') {
      const requestBody = request.postDataJSON()
      if (!isPlayersJsonLike(requestBody)) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid request body' }),
        })
        return
      }

      mockStore.set(teamId, requestBody)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Team data saved successfully' }),
      })
      return
    }

    await route.fulfill({
      status: 405,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    })
  })
}
