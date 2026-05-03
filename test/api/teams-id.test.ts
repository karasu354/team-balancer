import { NextApiRequest, NextApiResponse } from 'next'

import handler from '../../pages/api/teams/[id]'

const mockRedis = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getTeamPlayers: jest.fn(),
  setTeamPlayers: jest.fn(),
}

jest.mock('../../services/vercelRedis', () => {
  return {
    VercelRedis: jest.fn(() => mockRedis),
  }
})

type MockResponse = NextApiResponse & {
  statusCode: number
  body: unknown
}

const createMockResponse = (): MockResponse => {
  const response = {
    statusCode: 200,
    body: null,
    setHeader: jest.fn(),
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(payload: unknown) {
      this.body = payload
      return this
    },
  }

  // テスト用モックのため、NextApiResponse 互換へ最小限キャストする
  return response as MockResponse
}

describe('pages/api/teams/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('不正な PUT ボディで 400 を返すこと', async () => {
    const req = {
      method: 'PUT',
      query: { id: 'team-1' },
      body: { invalid: true },
    }
    // テスト用モックのため、NextApiRequest 互換へ最小限キャストする
    const res = createMockResponse()

    await handler(req as NextApiRequest, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body' })
  })

  test('Redis 例外発生時に 500 を返すこと', async () => {
    mockRedis.connect.mockRejectedValueOnce(new Error('connection error'))

    const req = {
      method: 'GET',
      query: { id: 'team-1' },
    }
    const res = createMockResponse()

    await handler(req as NextApiRequest, res)

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'Internal Server Error' })
  })

  test('不正な matchHistories 形式で 400 を返すこと', async () => {
    const req = {
      method: 'PUT',
      query: { id: 'team-1' },
      body: {
        id: 'team-1',
        version: '0.0.1',
        playersTotalCount: 0,
        players: [],
        matchHistories: [{ id: 'history-1', winnerTeam: 'blue' }],
      },
    }
    const res = createMockResponse()

    await handler(req as NextApiRequest, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body' })
  })

  test('履歴削除で更新後データを返すこと', async () => {
    mockRedis.getTeamPlayers.mockResolvedValueOnce({
      id: 'team-1',
      version: '0.0.1',
      playersTotalCount: 1,
      players: [
        {
          id: 'player-1',
          name: 'Alice',
          tier: 'GOLD',
          rank: 'II',
          displayRank: 'GOLD II',
          rating: 1400,
          mainRole: 'TOP',
          subRole: 'JG',
          desiredRoles: ['TOP'],
          isRoleFixed: false,
        },
      ],
      matchHistories: [
        {
          id: 'history-1',
          playedAt: '2026-05-03T12:30:00.000Z',
          winnerTeam: 'blue',
          mismatchCount: 0,
          teamsSnapshot: [
            {
              playerId: 'player-1',
              playerName: 'Alice',
              team: 'blue',
              role: 'TOP',
            },
          ],
          playerResults: [
            {
              playerId: 'player-1',
              playerName: 'Alice',
              team: 'blue',
              result: 'win',
              ratingDelta: 30,
              ratingBefore: 1370,
              ratingAfter: 1400,
            },
          ],
        },
      ],
    })

    const req = {
      method: 'DELETE',
      query: { id: 'team-1', historyId: 'history-1' },
    }
    const res = createMockResponse()

    await handler(req as NextApiRequest, res)

    expect(res.statusCode).toBe(200)
    expect(mockRedis.setTeamPlayers).toHaveBeenCalled()
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 'team-1',
        matchHistories: [],
      })
    )
  })

  test('履歴IDなしの DELETE で 400 を返すこと', async () => {
    const req = {
      method: 'DELETE',
      query: { id: 'team-1' },
    }
    const res = createMockResponse()

    await handler(req as NextApiRequest, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid or missing history ID' })
  })
})
