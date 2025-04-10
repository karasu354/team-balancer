import { Player } from '../../utils/player'
import { calcurateRating, rankEnum, tierEnum } from '../../utils/rank'

describe('Player', () => {
  let player: Player

  beforeEach(() => {
    player = new Player('TestPlayer', 'Test#1234')
  })

  describe('constructor', () => {
    it('初期値が正しく設定されていることを確認する', () => {
      expect(player.getName()).toBe('TestPlayer')
      expect(player.getTagLine()).toBe('Test#1234')
      expect(player.getDesiredRole()).toEqual([1, 1, 1, 1, 1])
      expect(player.getTier()).toBe(tierEnum.gold)
      expect(player.getRank()).toBe(rankEnum.two)
      expect(player.getRating()).toBe(
        calcurateRating(tierEnum.gold, rankEnum.two)
      )
    })
  })

  describe('setRole', () => {
    it('希望ロールを正しく切り替えられることを確認する', () => {
      player.setRole(0) // TOPロールを切り替え
      expect(player.getDesiredRole()).toEqual([0, 1, 1, 1, 1])

      player.setRole(0) // TOPロールを元に戻す
      expect(player.getDesiredRole()).toEqual([1, 1, 1, 1, 1])
    })

    it('無効なロール番号を指定した場合にエラーがスローされることを確認する', () => {
      expect(() => player.setRole(-1)).toThrow('無効なロール番号です')
      expect(() => player.setRole(5)).toThrow('無効なロール番号です')
    })
  })

  describe('setRank', () => {
    it('ランクを設定し、レーティングが正しく更新されることを確認する', () => {
      player.setRank(tierEnum.platinum, rankEnum.one)
      expect(player.getTier()).toBe(tierEnum.platinum)
      expect(player.getRank()).toBe(rankEnum.one)
      expect(player.getRating()).toBe(
        calcurateRating(tierEnum.platinum, rankEnum.one)
      )
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

  describe('getter methods', () => {
    it('getName が正しい名前を返すことを確認する', () => {
      expect(player.getName()).toBe('TestPlayer')
    })

    it('getTagLine が正しいタグラインを返すことを確認する', () => {
      expect(player.getTagLine()).toBe('Test#1234')
    })

    it('getDesiredRole が希望ロールのコピーを返すことを確認する', () => {
      const desiredRole = player.getDesiredRole()
      expect(desiredRole).toEqual([1, 1, 1, 1, 1])

      // コピーであることを確認
      desiredRole[0] = 0
      expect(player.getDesiredRole()).toEqual([1, 1, 1, 1, 1])
    })

    it('getTier が正しいティアを返すことを確認する', () => {
      expect(player.getTier()).toBe(tierEnum.gold)
    })

    it('getRank が正しいランクを返すことを確認する', () => {
      expect(player.getRank()).toBe(rankEnum.two)
    })

    it('getRating が正しいレーティングを返すことを確認する', () => {
      expect(player.getRating()).toBe(
        calcurateRating(tierEnum.gold, rankEnum.two)
      )
    })
  })
})
