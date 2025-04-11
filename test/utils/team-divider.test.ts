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

      const players = teamDivider.getPlayers()
      expect(players).toHaveLength(10)
      expect(players[0]?.getName()).toBe('Player1')
      expect(players.slice(1).every((p) => p === null)).toBe(true)
    })

    it('プレイヤーが最大数を超える場合、エラーがスローされることを確認する', () => {
      for (let i = 0; i < 10; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
      }

      expect(() =>
        teamDivider.addPlayer(new Player('ExtraPlayer', 'Tag#9999'))
      ).toThrow('Cannot add more players. Maximum limit reached.')
    })

    it('最初の空きスロットにプレイヤーが追加されることを確認する', () => {
      const player1 = new Player('Player1', 'Tag#1234')
      const player2 = new Player('Player2', 'Tag#5678')
      teamDivider.addPlayer(player1)
      teamDivider.addPlayer(player2)

      teamDivider.removePlayer(0) // Player1を削除
      teamDivider.addPlayer(new Player('Player3', 'Tag#9999'))

      const players = teamDivider.getPlayers()
      expect(players[0]?.getName()).toBe('Player2')
      expect(players[1]?.getName()).toBe('Player3')
      expect(players.slice(2).every((p) => p === null)).toBe(true)
    })
  })

  describe('removePlayer', () => {
    it('プレイヤーを削除できることを確認する', () => {
      const player1 = new Player('Player1', 'Tag#1234')
      const player2 = new Player('Player2', 'Tag#5678')
      teamDivider.addPlayer(player1)
      teamDivider.addPlayer(player2)

      teamDivider.removePlayer(0)

      const players = teamDivider.getPlayers()
      expect(players).toHaveLength(10)
      expect(players[0]?.getName()).toBe('Player2')
      expect(players[1]).toBeNull()
      expect(players.slice(2).every((p) => p === null)).toBe(true)
    })

    it('無効なインデックスでプレイヤーを削除しようとするとエラーがスローされることを確認する', () => {
      expect(() => teamDivider.removePlayer(0)).toThrow('Invalid index')
    })
  })

  describe('getPlayers', () => {
    it('プレイヤーリストが正しく取得できることを確認する', () => {
      const player1 = new Player('Player1', 'Tag#1234')
      const player2 = new Player('Player2', 'Tag#5678')
      teamDivider.addPlayer(player1)
      teamDivider.addPlayer(player2)

      const players = teamDivider.getPlayers()
      expect(players).toHaveLength(10)
      expect(players[0]?.getName()).toBe('Player1')
      expect(players[1]?.getName()).toBe('Player2')
      expect(players.slice(2).every((p) => p === null)).toBe(true)
    })
  })

  describe('getPlayersByLog', () => {
    it('チャットログからプレイヤーを正しく追加できることを確認する', () => {
      const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
ひろし #123がロビーに参加しました。`

      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.getPlayers()
      expect(players[0]?.getName()).toBe('Player1')
      expect(players[1]?.getName()).toBe('Player2')
      expect(players[2]?.getName()).toBe('ひろし')
      expect(players.slice(3).every((p) => p === null)).toBe(true)
    })

    it('退室ログでプレイヤーが正しく削除されることを確認する', () => {
      const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。`

      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.getPlayers()
      expect(players[0]?.getName()).toBe('Player2')
      expect(players.slice(1).every((p) => p === null)).toBe(true)
    })

    it('入室と退室が混在するログを正しく処理できることを確認する', () => {
      const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。
ひろし #123がロビーに参加しました。`

      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.getPlayers()
      expect(players[0]?.getName()).toBe('Player2')
      expect(players[1]?.getName()).toBe('ひろし')
      expect(players.slice(2).every((p) => p === null)).toBe(true)
    })

    it('空のログを渡した場合、プレイヤーリストが空であることを確認する', () => {
      const logs = ''

      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.getPlayers()
      expect(players.every((p) => p === null)).toBe(true)
    })

    it('空のログを渡した場合、プレイヤーリストが変更されないことを確認する', () => {
      // 初期状態でプレイヤーを追加
      const player1 = new Player('Player1', 'Tag#1234')
      const player2 = new Player('Player2', 'Tag#5678')
      teamDivider.addPlayer(player1)
      teamDivider.addPlayer(player2)

      const logs = '' // 空のログ
      teamDivider.getPlayersByLog(logs)

      const players = teamDivider.getPlayers()
      expect(players[0]?.getName()).toBe('Player1')
      expect(players[1]?.getName()).toBe('Player2')
      expect(players.slice(2).every((p) => p === null)).toBe(true)
    })
  })

  describe('isDividable', () => {
    it('プレイヤーが10人未満の場合、チーム分けができないことを確認する', () => {
      for (let i = 0; i < 9; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
      }

      expect(teamDivider.isDividable()).toBe(false)
    })

    it('プレイヤーが10人の場合、チーム分けが可能であることを確認する', () => {
      for (let i = 0; i < 10; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`))
      }

      expect(teamDivider.isDividable()).toBe(true)
    })
  })
})
