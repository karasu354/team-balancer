import { Player } from '../../utils/player'
import { calcurateRating, rankEnum, tierEnum } from '../../utils/rank'

describe('Player', () => {
  let player: Player

  beforeEach(() => {
    player = new Player('TestPlayer', 'Test#1234')
  })

  describe('setDesiredRoleByIndex', () => {
    it('希望ロールを正しく切り替えられることを確認する', () => {
      player.setDesiredRoleByIndex(0) // TOPロールを切り替え
      expect(player.desiredRoles).toEqual([false, true, true, true, true])

      player.setDesiredRoleByIndex(0) // TOPロールを元に戻す
      expect(player.desiredRoles).toEqual([true, true, true, true, true])
    })

    it('無効なロール番号を指定した場合にエラーがスローされることを確認する', () => {
      expect(() => player.setDesiredRoleByIndex(-1)).toThrow(
        'Invalid role index.'
      )
      expect(() => player.setDesiredRoleByIndex(5)).toThrow(
        'Invalid role index.'
      )
    })
  })

  describe('setRank', () => {
    it('ランク、レーティング、ランク表示が正しく更新されることを確認する', () => {
      player.setRank(tierEnum.platinum, rankEnum.one)
      expect(player.tier).toBe(tierEnum.platinum)
      expect(player.rank).toBe(rankEnum.one)
      expect(player.rating).toBe(
        calcurateRating(tierEnum.platinum, rankEnum.one)
      )
      expect(player.displayRank).toBe('PLATINUM I')
      player.setRank(tierEnum.master, rankEnum.two)
      expect(player.displayRank).toBe(tierEnum.master)
    })

    it('無効なティアまたはランクを設定した場合にエラーがスローされることを確認する', () => {
      expect(() =>
        player.setRank('invalidTier' as tierEnum, rankEnum.one)
      ).toThrow('無効なティアまたはランクです')
      expect(() =>
        player.setRank(tierEnum.gold, 'invalidRank' as rankEnum)
      ).toThrow('無効なティアまたはランクです')
    })
  })
})
