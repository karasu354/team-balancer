import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'

describe('Player', () => {
  let player: Player

  beforeEach(() => {
    player = new Player('Player')
  })

  describe('constructor', () => {
    test('プレイヤー名が正しく設定されること', () => {
      expect(player.name).toBe('Player')
    })

    test('デフォルトのティアとランクが正しく設定されること', () => {
      expect(player.tier).toBe(tierEnum.gold)
      expect(player.rank).toBe(rankEnum.two)
    })

    test('レーティングが正しく計算されること', () => {
      expect(player.rating).toBe(1400)
    })
  })

  describe('setRank', () => {
    test('ティアとランクを正しく設定できること', () => {
      player.setRank(tierEnum.platinum, rankEnum.one)
      expect(player.tier).toBe(tierEnum.platinum)
      expect(player.rank).toBe(rankEnum.one)
      expect(player.rating).toBe(1900)
    })

    test('無効なティアを設定した場合、エラーがスローされること', () => {
      expect(() => player.setRank('INVALID' as tierEnum, rankEnum.one)).toThrow(
        '無効なティアまたはランクです。'
      )
    })

    test('無効なランクを設定した場合、エラーがスローされること', () => {
      expect(() =>
        player.setRank(tierEnum.gold, 'INVALID' as rankEnum)
      ).toThrow('無効なティアまたはランクです。')
    })
  })

  describe('setDesiredRoleByIndex', () => {
    test('希望ロールを正しく切り替えられること', () => {
      player.setDesiredRoleByIndex(0)
      expect(player.desiredRoles[0]).toBe(false)
    })

    test('無効なインデックスを指定した場合、エラーがスローされること', () => {
      expect(() => player.setDesiredRoleByIndex(-1)).toThrow(
        '無効なロール番号です。'
      )
      expect(() => player.setDesiredRoleByIndex(5)).toThrow(
        '無効なロール番号です。'
      )
    })
  })

  describe('playerInfo', () => {
    test('プレイヤー情報が正しく取得できること', () => {
      const info = player.playerInfo
      expect(info.name).toBe('Player')
      expect(info.tier).toBe(tierEnum.gold)
      expect(info.rank).toBe(rankEnum.two)
      expect(info.displayRank).toBe('GOLD II')
      expect(info.rating).toBe(1400)
      expect(info.desiredRoles).toEqual([true, true, true, true, true])
      expect(info.isRoleFixed).toBe(false)
    })
  })
})
