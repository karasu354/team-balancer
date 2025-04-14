import { Player } from '../../utils/player'
import { TeamDivider } from '../../utils/teamDivider'

describe('TeamDivider', () => {
  let teamDivider: TeamDivider

  beforeEach(() => {
    teamDivider = new TeamDivider()
  })

  describe('addPlayer', () => {
    it('プレイヤーを追加できることを確認する', () => {
      const player = new Player('Player1', 'Tag#1234')
      teamDivider.addPlayer(player)

      const players = teamDivider.players
      expect(players).toHaveLength(1)
      expect(players[0]).toBe(player)
    })

    it('プレイヤーが最大数を超える場合、エラーがスローされることを確認する', () => {
      for (let i = 0; i < 50; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
      }

      expect(() =>
        teamDivider.addPlayer(new Player('ExtraPlayer', 'Tag#9999'))
      ).toThrow('Cannot add more players. Maximum limit reached.')
    })
  })

  describe('removePlayerByIndex', () => {
    it('プレイヤーを削除できることを確認する', () => {
      const player1 = new Player('Player1', 'Tag#1234')
      const player2 = new Player('Player2', 'Tag#5678')
      teamDivider.addPlayer(player1)
      teamDivider.addPlayer(player2)

      teamDivider.removePlayerByIndex(0)

      const players = teamDivider.players
      expect(players).toHaveLength(1)
      expect(players[0]).toBe(player2)
    })

    it('無効なインデックスでプレイヤーを削除しようとするとエラーがスローされることを確認する', () => {
      expect(() => teamDivider.removePlayerByIndex(0)).toThrow('Invalid index')
    })
  })

  describe('getPlayersByLog', () => {
    it('チャットログからプレイヤーを正しく追加できることを確認する', () => {
      const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
ひろし #123がロビーに参加しました。`

      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.players
      expect(players).toHaveLength(3)
      expect(players[0].name).toBe('Player1')
      expect(players[1].name).toBe('Player2')
      expect(players[2].name).toBe('ひろし')
    })

    it('11人以上のプレイヤーが追加される場合、エラーがスローされることを確認する', () => {
      const logs = Array.from(
        { length: 51 },
        (_, i) => `Player${i + 1} #Tag${i + 1}がロビーに参加しました。`
      ).join('\n')

      expect(() => teamDivider.getPlayersByLog(logs)).toThrow(
        'Cannot add more players. Maximum limit reached.'
      )
    })

    it('入室と退室が混在するログを正しく処理できることを確認する', () => {
      const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。
ひろし #123がロビーに参加しました。`

      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.players
      expect(players[0].name).toBe('Player2')
      expect(players[1].name).toBe('ひろし')
    })

    it('空のログを渡した場合、プレイヤーリストが空であることを確認する', () => {
      const logs = ''
      const player1 = new Player('Player1', 'Tag#1234')

      teamDivider.addPlayer(player1)
      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.players
      expect(players.length).toBe(1)
      expect(players[0]).toBe(player1)
    })

    it('空のログを渡した場合、プレイヤーリストが変更されないことを確認する', () => {
      const player1 = new Player('Player1', 'Tag#1234')
      const player2 = new Player('Player2', 'Tag#5678')
      teamDivider.addPlayer(player1)
      teamDivider.addPlayer(player2)

      const logs = ''
      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.players
      expect(players.length).toBe(2)
      expect(players[0]).toBe(player1)
      expect(players[1]).toBe(player2)
    })
  })

  describe('isDividable', () => {
    it('参加するプレイヤーが10人未満の場合、チーム分けができないことを確認する', () => {
      for (let i = 0; i < 30; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
      }

      expect(teamDivider.isDividable()).toBe(false)
    })
    it('参加するプレイヤーが10人の場合、チーム分けができることを確認する', () => {
      for (let i = 0; i < 30; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
        if (i < 10) teamDivider.players[i].isParticipatingInGame = true
      }

      expect(teamDivider.isDividable()).toBe(true)
    })
    it('参加するプレイヤーが11人以上の場合、チーム分けができることを確認する', () => {
      for (let i = 0; i < 30; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
        teamDivider.players[i].isParticipatingInGame = true
      }

      expect(teamDivider.isDividable()).toBe(false)
    })
  })
})
