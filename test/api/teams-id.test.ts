import { NextApiRequest, NextApiResponse } from 'next'

import handler from '../../pages/api/teams/[id]'
import { VercelRedis } from '../../services/vercelRedis'

const mockRedis = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getTeamPlayers: jest.fn(),
  setTeamPlayers: jest.fn(),
}

jest.mock('../../services/vercelRedis', () => {
  return {
    createTeamPlayersKey: jest.fn(
      (teamId: string) => `teams:${teamId}:players`
    ),
    VercelRedis: jest.fn(() => mockRedis),
  }
})

type MockResponse = NextApiResponse & {
  statusCode: number
  body: unknown
}

type MinimalRequest = {
  method: string
  query: Record<string, unknown>
  body?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const hasMatchHistories = (
  value: unknown
): value is { matchHistories: unknown[] } => {
  return (
    isRecord(value) &&
    'matchHistories' in value &&
    Array.isArray(value.matchHistories)
  )
}

const createPlayerJson = () => ({
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
})

const createMatchHistory = (index: number) => ({
  id: `history-${index}`,
  playedAt: `2026-05-03T12:30:${String(index).padStart(2, '0')}Z`,
  winnerTeam: 'blue',
  mismatchCount: 0,
  teamsSnapshot: [],
  playerResults: [],
})

const createPlayersPayload = (matchHistoryCount = 0) => ({
  id: 'team-1',
  version: '0.0.1',
  playersTotalCount: 1,
  players: [createPlayerJson()],
  matchHistories: Array.from({ length: matchHistoryCount }, (_, index) =>
    createMatchHistory(index)
  ),
})

const toNextApiRequest = (request: MinimalRequest): NextApiRequest => {
  // テスト用の最小構造体を NextApiRequest として扱うため、unknown ブリッジで明示的に変換する
  return request as unknown as NextApiRequest
}

const createMockResponse = (): MockResponse => {
  const response = {
    statusCode: 200,
    body: null as unknown,
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

  // テスト用モックのため、unknown ブリッジで NextApiResponse 互換へ変換する
  return response as unknown as MockResponse
}

describe('pages/api/teams/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('id が未指定の場合に 400 を返すこと', async () => {
    const req = {
      method: 'GET',
      query: {},
    }
    const res = createMockResponse()

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid or missing team ID' })
    expect(mockRedis.connect).not.toHaveBeenCalled()
  })

  test('不正な PUT ボディで 400 を返すこと', async () => {
    const req = {
      method: 'PUT',
      query: { id: 'team-1' },
      body: { invalid: true },
    }
    // テスト用モックのため、NextApiRequest 互換へ最小限キャストする
    const res = createMockResponse()

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body' })
    expect(mockRedis.connect).not.toHaveBeenCalled()
  })

  test('未対応メソッドで 405 を返すこと', async () => {
    const req = {
      method: 'PATCH',
      query: { id: 'team-1' },
    }
    const res = createMockResponse()

    await handler(toNextApiRequest(req), res)

    expect(res.setHeader).toHaveBeenCalledWith('Allow', [
      'GET',
      'PUT',
      'DELETE',
    ])
    expect(res.statusCode).toBe(405)
    expect(res.body).toEqual({ error: 'Method PATCH Not Allowed' })
  })

  test('Redis 例外発生時に 500 を返すこと', async () => {
    mockRedis.connect.mockRejectedValueOnce(new Error('connection error'))

    const req = {
      method: 'GET',
      query: { id: 'team-1' },
    }
    const res = createMockResponse()

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'Internal Server Error' })
  })

  test('REDIS_URL 未設定時に 500 を返すこと', async () => {
    const originalRedisUrl = process.env.REDIS_URL
    delete process.env.REDIS_URL

    const req = {
      method: 'GET',
      query: { id: 'team-1' },
    }
    const res = createMockResponse()

    const redisMock = VercelRedis as unknown as jest.Mock
    redisMock.mockImplementationOnce(() => {
      throw new Error('REDIS_URL is not configured')
    })

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'Internal Server Error' })

    process.env.REDIS_URL = originalRedisUrl
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

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body' })
  })

  test('履歴削除で更新後データを返すこと', async () => {
    mockRedis.getTeamPlayers.mockResolvedValueOnce({
      ...createPlayersPayload(),
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

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(200)
    expect(mockRedis.setTeamPlayers).toHaveBeenCalled()
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 'team-1',
        matchHistories: [],
      })
    )
  })

  test('保存と復元で履歴件数が最大50件に正規化されること', async () => {
    const putReq = {
      method: 'PUT',
      query: { id: 'team-1' },
      body: createPlayersPayload(51),
    }
    const putRes = createMockResponse()

    await handler(toNextApiRequest(putReq), putRes)

    expect(putRes.statusCode).toBe(200)
    expect(mockRedis.setTeamPlayers).toHaveBeenCalled()

    const savedPayload = mockRedis.setTeamPlayers.mock.calls[0]?.[1]
    expect(savedPayload).toEqual(
      expect.objectContaining({
        id: 'team-1',
      })
    )

    if (!hasMatchHistories(savedPayload)) {
      throw new Error('保存された payload の形式が不正です。')
    }

    expect(savedPayload.matchHistories.length).toBe(50)

    mockRedis.getTeamPlayers.mockResolvedValueOnce(savedPayload)

    const getReq = {
      method: 'GET',
      query: { id: 'team-1' },
    }
    const getRes = createMockResponse()

    await handler(toNextApiRequest(getReq), getRes)

    expect(getRes.statusCode).toBe(200)
    expect(getRes.body).toEqual(
      expect.objectContaining({
        id: 'team-1',
        matchHistories: expect.any(Array),
      })
    )

    if (!hasMatchHistories(getRes.body)) {
      throw new Error('復元レスポンスの形式が不正です。')
    }

    expect(getRes.body.matchHistories.length).toBe(50)
  })

  test('履歴IDなしの DELETE で 400 を返すこと', async () => {
    const req = {
      method: 'DELETE',
      query: { id: 'team-1' },
    }
    const res = createMockResponse()

    await handler(toNextApiRequest(req), res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid or missing history ID' })
  })

  test('保存時に既存の Redis キー形式を維持すること', async () => {
    mockRedis.setTeamPlayers.mockResolvedValueOnce(undefined)

    const req = {
      method: 'PUT',
      query: { id: 'team-1' },
      body: createPlayersPayload(),
    }
    const res = createMockResponse()

    await handler(toNextApiRequest(req), res)

    expect(mockRedis.setTeamPlayers).toHaveBeenCalledWith(
      'team-1',
      expect.any(Object)
    )
  })
})
