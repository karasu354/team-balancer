import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'
import { roleEnum } from '../../utils/role'
import {
  MANUAL_SLOT_ORDER,
  MAX_MATCH_HISTORIES,
  PlayersJson,
  TeamBalancer,
  buildEmptyManualAssignment,
  normalizeMatchHistories,
  validateManualAssignment,
} from '../../utils/teamBalancer'
import { generateInternalId } from '../../utils/utils'

describe('TeamBalancer クラス', () => {
  let teamBalancer: TeamBalancer
  const id = generateInternalId()

  beforeEach(() => {
    teamBalancer = new TeamBalancer()
  })

  describe('constructor', () => {
    test('初期化時にプレイヤーリストが空であること', () => {
      expect(teamBalancer.players).toEqual([])
    })

    test('初期化時にチーム分割データが正しく初期化されていること', () => {
      expect(Object.keys(teamBalancer.balancedTeamsByMissMatch).length).toBe(11)
      for (const key in teamBalancer.balancedTeamsByMissMatch) {
        expect(teamBalancer.balancedTeamsByMissMatch[key].players).toEqual([])
        expect(teamBalancer.balancedTeamsByMissMatch[key].evaluationScore).toBe(
          Infinity
        )
        expect(
          teamBalancer.balancedTeamsByMissMatch[key].mismatchDetails
        ).toEqual([])
      }
    })
  })

  describe('fromJson', () => {
    test('PlayersJson から正しく TeamBalancer インスタンスを生成できること', () => {
      const playersJson = {
        id: 'team-id-123',
        version: '0.0.1',
        playersTotalCount: 2,
        players: [
          {
            id: 'player-id-1',
            name: 'Alice',
            tier: tierEnum.gold,
            rank: rankEnum.two,
            displayRank: 'GOLD II',
            rating: 1400,
            mainRole: roleEnum.top,
            subRole: roleEnum.jg,
            desiredRoles: [roleEnum.top, roleEnum.jg],
            isRoleFixed: false,
          },
          {
            id: 'player-id-2',
            name: 'Bob',
            tier: tierEnum.platinum,
            rank: rankEnum.one,
            displayRank: 'PLATINUM I',
            rating: 1900,
            mainRole: roleEnum.mid,
            subRole: roleEnum.bot,
            desiredRoles: [roleEnum.mid, roleEnum.bot],
            isRoleFixed: true,
          },
        ],
      }

      const teamBalancer = TeamBalancer.fromJson(playersJson)

      expect(teamBalancer.id).toBe('team-id-123')
      expect(teamBalancer.playersTotalCount).toBe(2)
      expect(teamBalancer.players.length).toBe(2)

      const player1 = teamBalancer.players[0]
      expect(player1.id).toBe('player-id-1')
      expect(player1.name).toBe('Alice')
      expect(player1.tier).toBe(tierEnum.gold)
      expect(player1.rank).toBe(rankEnum.two)
      expect(player1.displayRank).toBe('GOLD II')
      expect(player1.rating).toBe(1400)
      expect(player1.mainRole).toBe(roleEnum.top)
      expect(player1.subRole).toBe(roleEnum.jg)
      expect(player1.desiredRoles).toEqual([roleEnum.top, roleEnum.jg])
      expect(player1.isRoleFixed).toBe(false)
      expect(player1.isParticipatingInGame).toBe(false)

      const player2 = teamBalancer.players[1]
      expect(player2.id).toBe('player-id-2')
      expect(player2.name).toBe('Bob')
      expect(player2.tier).toBe(tierEnum.platinum)
      expect(player2.rank).toBe(rankEnum.one)
      expect(player2.displayRank).toBe('PLATINUM I')
      expect(player2.rating).toBe(1900)
      expect(player2.mainRole).toBe(roleEnum.mid)
      expect(player2.subRole).toBe(roleEnum.bot)
      expect(player2.desiredRoles).toEqual([roleEnum.mid, roleEnum.bot])
      expect(player2.isRoleFixed).toBe(true)
      expect(player2.isParticipatingInGame).toBe(false)
    })

    test('旧形式JSONの matchHistories 欠損を補完できること', () => {
      const legacyJson = {
        id: 'legacy-team-id',
        version: '0.0.1',
        playersTotalCount: 1,
        players: [
          {
            id: 'legacy-player-id-1',
            name: 'LegacyAlice',
            tier: tierEnum.gold,
            rank: rankEnum.two,
            displayRank: 'GOLD II',
            rating: 1400,
            mainRole: roleEnum.top,
            subRole: roleEnum.jg,
            desiredRoles: [roleEnum.top],
            isRoleFixed: false,
          },
        ],
      }

      const loaded = TeamBalancer.fromJson(legacyJson)
      expect(loaded.matchHistories).toEqual([])
    })

    test('旧履歴で mismatchDetails 欠損でも読み込みできること', () => {
      const legacyJson: PlayersJson = {
        id: 'legacy-team-id',
        version: '0.0.1',
        playersTotalCount: 1,
        players: [
          {
            id: 'legacy-player-id-1',
            name: 'LegacyAlice',
            tier: tierEnum.gold,
            rank: rankEnum.two,
            displayRank: 'GOLD II',
            rating: 1400,
            mainRole: roleEnum.top,
            subRole: roleEnum.jg,
            desiredRoles: [roleEnum.top],
            isRoleFixed: false,
          },
        ],
        matchHistories: [
          {
            id: 'history-1',
            playedAt: new Date().toISOString(),
            winnerTeam: 'blue',
            mismatchCount: 1,
            teamsSnapshot: [],
            playerResults: [],
          },
        ],
      }

      const loaded = TeamBalancer.fromJson(legacyJson)
      expect(loaded.matchHistories).toHaveLength(1)
      expect(loaded.matchHistories[0].mismatchDetails).toEqual([])
    })

    test('51件以上の履歴を playedAt 降順で最大50件に正規化できること', () => {
      const loaded = TeamBalancer.fromJson({
        id: 'team-id-123',
        version: '0.0.1',
        playersTotalCount: 0,
        players: [],
        matchHistories: Array.from({ length: 51 }, (_, index) => ({
          id: `history-${index}`,
          playedAt: `2026-05-03T12:30:${String(index).padStart(2, '0')}Z`,
          winnerTeam: 'blue',
          mismatchCount: 0,
          teamsSnapshot: [],
          playerResults: [],
        })),
      })

      expect(loaded.matchHistories).toHaveLength(MAX_MATCH_HISTORIES)
      expect(loaded.matchHistories[0].id).toBe('history-50')
      expect(
        loaded.matchHistories.some((history) => history.id === 'history-0')
      ).toBe(false)
    })
  })

  describe('normalizeMatchHistories', () => {
    test('undefined 入力なら空配列を返すこと', () => {
      expect(normalizeMatchHistories(undefined)).toEqual([])
    })

    test('不正な履歴は除外し、有効な履歴のみを返すこと', () => {
      const invalidHistoryInput: unknown[] = [
        {
          id: 'history-valid',
          playedAt: '2026-05-03T12:30:00Z',
          winnerTeam: 'blue',
          mismatchCount: 0,
          teamsSnapshot: [],
          playerResults: [],
        },
        {
          id: 'history-invalid',
          winnerTeam: 'blue',
        },
      ]

      const histories = normalizeMatchHistories(
        invalidHistoryInput as unknown as PlayersJson['matchHistories']
      )

      expect(histories).toHaveLength(1)
      expect(histories[0].id).toBe('history-valid')
    })
  })

  describe('validateManualAssignment', () => {
    const createParticipatingPlayers = (count: number): Player[] => {
      return Array.from({ length: count }, (_, index) => {
        const player = new Player(`ManualPlayer${index + 1}`)
        player.isParticipatingInGame = true
        return player
      })
    }

    test('10人が重複なく全ロールに配置されていれば有効と判定されること', () => {
      const participatingPlayers = createParticipatingPlayers(10)
      const assignment = buildEmptyManualAssignment()

      MANUAL_SLOT_ORDER.forEach((slot, index) => {
        assignment[slot] = participatingPlayers[index].id
      })

      const result = validateManualAssignment(participatingPlayers, assignment)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
      expect(result.missingSlots).toEqual([])
      expect(result.duplicatedPlayerIds).toEqual([])
    })

    test('参加人数が10人でない場合は無効になること', () => {
      const participatingPlayers = createParticipatingPlayers(9)
      const assignment = buildEmptyManualAssignment()
      MANUAL_SLOT_ORDER.forEach((slot, index) => {
        assignment[slot] = participatingPlayers[index]?.id ?? null
      })

      const result = validateManualAssignment(participatingPlayers, assignment)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        '手動割り当ては参加プレイヤーが10人ちょうどの場合のみ確定できます。'
      )
    })

    test('同一プレイヤー重複配置を検出できること', () => {
      const participatingPlayers = createParticipatingPlayers(10)
      const assignment = buildEmptyManualAssignment()

      MANUAL_SLOT_ORDER.forEach((slot, index) => {
        assignment[slot] = participatingPlayers[index].id
      })
      assignment['red-SUP'] = participatingPlayers[0].id

      const result = validateManualAssignment(participatingPlayers, assignment)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        '同一プレイヤーが複数ロールに配置されています。'
      )
      expect(result.duplicatedPlayerIds).toContain(participatingPlayers[0].id)
    })

    test('未配置ロールがある場合は無効になること', () => {
      const participatingPlayers = createParticipatingPlayers(10)
      const assignment = buildEmptyManualAssignment()

      MANUAL_SLOT_ORDER.slice(0, 9).forEach((slot, index) => {
        assignment[slot] = participatingPlayers[index].id
      })

      const result = validateManualAssignment(participatingPlayers, assignment)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        '未配置のロールがあります。全ロールを埋めてください。'
      )
      expect(result.missingSlots.length).toBe(1)
    })
  })

  describe('playersInfo', () => {
    test('プレイヤー情報が正しく取得できること', () => {
      const player1 = new Player('Alice', tierEnum.gold, rankEnum.two)
      const player2 = new Player('Bob', tierEnum.platinum, rankEnum.one)
      teamBalancer.addPlayer(player1)
      teamBalancer.addPlayer(player2)

      const playersInfo = teamBalancer.playersInfo
      expect(playersInfo.version).toBe('0.0.1')
      expect(playersInfo.playersTotalCount).toBe(2)
      expect(playersInfo.players).toEqual([
        {
          id: player1.id,
          name: 'Alice',
          tier: tierEnum.gold,
          rank: rankEnum.two,
          displayRank: 'GOLD II',
          rating: 1400,
          mainRole: roleEnum.all,
          subRole: roleEnum.all,
          desiredRoles: Object.values(roleEnum).filter(
            (role) => role !== roleEnum.all
          ),
          isRoleFixed: false,
        },
        {
          id: player2.id,
          name: 'Bob',
          tier: tierEnum.platinum,
          rank: rankEnum.one,
          displayRank: 'PLATINUM I',
          rating: 1900,
          mainRole: roleEnum.all,
          subRole: roleEnum.all,
          desiredRoles: Object.values(roleEnum).filter(
            (role) => role !== roleEnum.all
          ),
          isRoleFixed: false,
        },
      ])
    })

    test('プレイヤーがいない場合、空のリストが返されること', () => {
      const playersInfo = teamBalancer.playersInfo
      expect(playersInfo.version).toBe('0.0.1')
      expect(playersInfo.playersTotalCount).toBe(0)
      expect(playersInfo.players).toEqual([])
    })
  })

  describe('addPlayer', () => {
    test('プレイヤーを正しく追加できること', () => {
      const player = new Player('Alice', tierEnum.gold, rankEnum.two)
      teamBalancer.addPlayer(player)
      expect(teamBalancer.players).toContain(player)
    })

    test('同じ名前のプレイヤーを追加しないこと', () => {
      const player = new Player('Alice', tierEnum.gold, rankEnum.two)
      teamBalancer.addPlayer(player)
      teamBalancer.addPlayer(player)
      expect(teamBalancer.players.length).toBe(1)
    })

    test('プレイヤー数が上限を超えた場合、エラーがスローされること', () => {
      for (let i = 0; i < 50; i++) {
        teamBalancer.addPlayer(new Player(`Player${i}`))
      }
      expect(() => teamBalancer.addPlayer(new Player('ExtraPlayer'))).toThrow(
        'これ以上プレイヤーを追加できません。最大人数に達しました。'
      )
    })
  })

  describe('divideTeams', () => {
    test('プレイヤー数が不足している場合、エラーがスローされること', () => {
      expect(() => teamBalancer.divideTeams()).toThrow(
        '現在のプレイヤーではチーム分割ができません。'
      )
    })

    test('同一入力で連続実行しても分割結果が安定すること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }

      const getFirstBalancedPlayers = (): Player[] => {
        for (let mismatch = 0; mismatch <= 10; mismatch++) {
          const candidate = teamBalancer.balancedTeamsByMissMatch[mismatch]
          if (candidate.players.length === 10) {
            return candidate.players
          }
        }

        throw new Error('有効な分割結果が見つかりません。')
      }

      teamBalancer.divideTeams()
      const firstResult = getFirstBalancedPlayers().map((player) => player.id)

      teamBalancer.divideTeams()
      const secondResult = getFirstBalancedPlayers().map((player) => player.id)

      expect(secondResult).toEqual(firstResult)
    })

    test('固定ロール制約で候補がない場合はエラーになること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        player.desiredRoles = [roleEnum.top]
        player.isRoleFixed = true
        teamBalancer.addPlayer(player)
      }

      expect(() => teamBalancer.divideTeams()).toThrow(
        '条件を満たすチーム分割候補が見つかりません。'
      )
    })

    test('ミスマッチ対象者の内訳を保持できること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        player.desiredRoles = [roleEnum.top]
        player.isRoleFixed = false
        teamBalancer.addPlayer(player)
      }

      teamBalancer.divideTeams()

      const candidate = Object.values(
        teamBalancer.balancedTeamsByMissMatch
      ).find((team) => team.players.length === 10)
      expect(candidate).toBeDefined()

      if (!candidate) {
        throw new Error('有効な分割結果が見つかりません。')
      }

      expect(candidate.players).toHaveLength(10)
      expect(candidate.mismatchDetails.length).toBeGreaterThan(0)

      candidate.mismatchDetails.forEach((detail) => {
        expect(detail.playerId).toBeTruthy()
        expect(detail.playerName).toBeTruthy()
        expect(detail.desiredRoles.length).toBeGreaterThan(0)
        expect(detail.desiredRoles.includes(detail.assignedRole)).toBe(false)
      })
    })

    test('ミスマッチ比較表示で使う評価スコアが候補ごとに保持されること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }

      teamBalancer.divideTeams()

      const availableCandidates = Object.values(
        teamBalancer.balancedTeamsByMissMatch
      ).filter((candidate) => candidate.players.length === 10)

      expect(availableCandidates.length).toBeGreaterThan(0)
      expect(
        availableCandidates.every((candidate) =>
          Number.isFinite(candidate.evaluationScore)
        )
      ).toBe(true)
    })
  })

  describe('isDividable', () => {
    test('プレイヤー数が十分でない場合、false を返すこと', () => {
      expect(teamBalancer.isDividable()).toBe(false)
    })

    test('プレイヤー数が十分な場合、true を返すこと', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }
      expect(teamBalancer.isDividable()).toBe(true)
    })

    test('参加するプレイヤーが多い場合、false を返すこと', () => {
      for (let i = 0; i < 11; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }
      expect(teamBalancer.isDividable()).toBe(false)
    })
  })

  describe('removePlayerByIndex', () => {
    test('指定したインデックスのプレイヤーを削除できること', () => {
      const player1 = new Player('Alice')
      const player2 = new Player('Bob')
      teamBalancer.addPlayer(player1)
      teamBalancer.addPlayer(player2)

      teamBalancer.removePlayerByIndex(0)
      expect(teamBalancer.players).not.toContain(player1)
      expect(teamBalancer.players).toContain(player2)
    })

    test('無効なインデックスを指定した場合、エラーがスローされること', () => {
      expect(() => teamBalancer.removePlayerByIndex(-1)).toThrow(
        '無効なインデックスです。'
      )
      expect(() => teamBalancer.removePlayerByIndex(10)).toThrow(
        '無効なインデックスです。'
      )
    })
  })

  describe('finalizeMatchResult', () => {
    const setupTenPlayers = (): Player[] => {
      const players: Player[] = []

      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
        players.push(player)
      }

      return players
    }

    const createHistory = (id: string, playedAt: string) => ({
      id,
      playedAt,
      winnerTeam: 'blue' as const,
      mismatchCount: 0,
      teamsSnapshot: [],
      playerResults: [],
      mismatchDetails: [],
    })

    test('結果確定で履歴が追加され、プレイヤー結果が保存されること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }

      teamBalancer.divideTeams()
      const balanced = Object.values(
        teamBalancer.balancedTeamsByMissMatch
      ).find((team) => team.players.length === 10)
      expect(balanced).toBeDefined()
      if (!balanced) {
        throw new Error('有効な分割結果が見つかりません。')
      }

      const history = teamBalancer.finalizeMatchResult(
        balanced.players,
        'blue',
        0
      )

      expect(teamBalancer.matchHistories.length).toBe(1)
      expect(history.winnerTeam).toBe('blue')
      expect(history.teamsSnapshot).toHaveLength(10)
      expect(history.playerResults).toHaveLength(10)
      expect(
        history.playerResults.filter((result) => result.result === 'win').length
      ).toBe(5)
      expect(
        history.playerResults.filter((result) => result.result === 'lose')
          .length
      ).toBe(5)
      expect(history.playerResults[0].ratingDelta).toBeGreaterThan(0)
    })

    test('履歴が50件未満ならそのまま追加されること', () => {
      const arrangedPlayers = setupTenPlayers()

      teamBalancer.matchHistories = Array.from({ length: 49 }, (_, index) =>
        createHistory(`history-${index}`, `2026-01-01T00:00:${index}Z`)
      )

      teamBalancer.finalizeMatchResult(arrangedPlayers, 'blue', 0)

      expect(teamBalancer.matchHistories).toHaveLength(50)
    })

    test('51件目追加時に最古履歴が削除されること', () => {
      const arrangedPlayers = setupTenPlayers()

      teamBalancer.matchHistories = Array.from({ length: 50 }, (_, index) =>
        createHistory(`history-${index}`, `2026-01-01T00:00:${index}Z`)
      )

      teamBalancer.finalizeMatchResult(arrangedPlayers, 'blue', 0)

      expect(teamBalancer.matchHistories).toHaveLength(50)
      expect(
        teamBalancer.matchHistories.some(
          (history) => history.id === 'history-00'
        )
      ).toBe(false)
    })

    test('10人未満の結果確定はエラーになること', () => {
      const player = new Player('OnlyOne')
      player.isParticipatingInGame = true
      teamBalancer.addPlayer(player)

      expect(() =>
        teamBalancer.finalizeMatchResult(teamBalancer.players, 'blue', 0)
      ).toThrow('試合結果の確定には10人の分割結果が必要です。')
    })

    test('履歴削除時にレートを基準値へ戻して残存履歴を再計算できること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }

      const baseRatings = new Map(
        teamBalancer.players.map((player) => [player.id, player.rating])
      )

      teamBalancer.divideTeams()
      const balanced = Object.values(
        teamBalancer.balancedTeamsByMissMatch
      ).find((team) => team.players.length === 10)

      if (!balanced) {
        throw new Error('有効な分割結果が見つかりません。')
      }

      const firstHistory = teamBalancer.finalizeMatchResult(
        balanced.players,
        'blue',
        0
      )
      const secondHistory = teamBalancer.finalizeMatchResult(
        balanced.players,
        'red',
        0
      )

      expect(teamBalancer.matchHistories).toHaveLength(2)
      expect(teamBalancer.players[0].rating).not.toBe(
        baseRatings.get(teamBalancer.players[0].id)
      )

      teamBalancer.deleteMatchHistory(firstHistory.id)

      expect(teamBalancer.matchHistories).toHaveLength(1)
      expect(teamBalancer.matchHistories[0].id).toBe(secondHistory.id)

      const remainingHistory = teamBalancer.matchHistories[0]
      const expectedDeltaByPlayerId = new Map(
        remainingHistory.playerResults.map((result) => [
          result.playerId,
          result.ratingDelta,
        ])
      )

      teamBalancer.players.forEach((player) => {
        const expectedRating =
          (baseRatings.get(player.id) ?? 0) +
          (expectedDeltaByPlayerId.get(player.id) ?? 0)
        expect(player.rating).toBe(expectedRating)
      })
    })

    test('履歴削除後の再計算後も件数上限を満たすこと', () => {
      const arrangedPlayers = setupTenPlayers()

      for (let i = 0; i < 50; i++) {
        teamBalancer.finalizeMatchResult(
          arrangedPlayers,
          i % 2 === 0 ? 'blue' : 'red',
          0
        )
      }

      const deleteTargetHistoryId = teamBalancer.matchHistories[10]?.id
      if (!deleteTargetHistoryId) {
        throw new Error('削除対象の履歴が見つかりません。')
      }

      teamBalancer.deleteMatchHistory(deleteTargetHistoryId)

      expect(teamBalancer.matchHistories.length).toBeLessThanOrEqual(50)
    })

    test('存在しない履歴削除はエラーになること', () => {
      expect(() => teamBalancer.deleteMatchHistory('missing-history')).toThrow(
        '削除対象の履歴が見つかりません。'
      )
    })

    test('ELO計算ではレート差が大きい勝利ほど増分が小さくなること', () => {
      const arrangedPlayers: Player[] = []

      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
        arrangedPlayers.push(player)
      }

      // [blue top, blue jg, blue mid, blue bot, blue sup, red top, red jg, red mid, red bot, red sup]
      arrangedPlayers[0].rating = 2000
      arrangedPlayers[5].rating = 1200
      arrangedPlayers[2].rating = 1500
      arrangedPlayers[7].rating = 1480

      const history = teamBalancer.finalizeMatchResult(
        arrangedPlayers,
        'blue',
        0
      )

      const topBlueResult = history.playerResults.find(
        (result) => result.playerId === arrangedPlayers[0].id
      )
      const midBlueResult = history.playerResults.find(
        (result) => result.playerId === arrangedPlayers[2].id
      )

      expect(topBlueResult).toBeDefined()
      expect(midBlueResult).toBeDefined()

      if (!topBlueResult || !midBlueResult) {
        throw new Error('検証用のプレイヤー結果が見つかりません。')
      }

      expect(topBlueResult.ratingDelta).toBeGreaterThan(0)
      expect(midBlueResult.ratingDelta).toBeGreaterThan(0)
      expect(topBlueResult.ratingDelta).toBeLessThan(midBlueResult.ratingDelta)
    })
  })
})
