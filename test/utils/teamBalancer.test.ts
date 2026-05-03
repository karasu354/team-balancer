import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'
import { roleEnum } from '../../utils/role'
import { TeamBalancer } from '../../utils/teamBalancer'
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
