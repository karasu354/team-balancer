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
            subRole: roleEnum.jungle,
            desiredRoles: [roleEnum.top, roleEnum.jungle],
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
      expect(player1.subRole).toBe(roleEnum.jungle)
      expect(player1.desiredRoles).toEqual([roleEnum.top, roleEnum.jungle])
      expect(player1.isRoleFixed).toBe(false)
      expect(player1.isParticipatingInGame).toBe(true)

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
      expect(player2.isParticipatingInGame).toBe(true)
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
    test('チーム分割が成功すること', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i}`, tierEnum.gold, rankEnum.two)
        player.isParticipatingInGame = true
        teamBalancer.addPlayer(player)
      }
      teamBalancer.divideTeams()
      const team1 = teamBalancer.balancedTeamsByMissMatch[0].players.slice(0, 5)
      const team2 = teamBalancer.balancedTeamsByMissMatch[0].players.slice(5)
      expect(team1.length).toBe(5)
      expect(team2.length).toBe(5)
    })

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
})
