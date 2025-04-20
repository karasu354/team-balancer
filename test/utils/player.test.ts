import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'
import { roleEnum } from '../../utils/role'

describe('Player', () => {
  let player: Player

  beforeEach(() => {
    player = new Player('Player')
    player.desiredRoles = [roleEnum.top]
  })

  describe('constructor', () => {
    test('プレイヤー名が正しく設定されること', () => {
      expect(player.name).toBe('Player')
    })

    test('デフォルトのティアとランクが正しく設定されること', () => {
      expect(player.tier).toBe(tierEnum.gold)
      expect(player.rank).toBe(rankEnum.two)
    })

    test('デフォルトのロールが正しく設定されること', () => {
      expect(player.mainRole).toBe(roleEnum.all)
      expect(player.subRole).toBe(roleEnum.all)
    })

    test('デフォルトの希望ロールが正しく設定されること', () => {
      expect(player.desiredRoles).toEqual([roleEnum.top])
    })

    test('レーティングが正しく計算されること', () => {
      expect(player.rating).toBe(1400) // GOLD II のレーティング
    })
  })

  describe('fromJson', () => {
    test('PlayerJson から正しくインスタンスを生成できること', () => {
      const playerJson = {
        name: 'Alice',
        tier: tierEnum.platinum,
        rank: rankEnum.one,
        displayRank: 'PLATINUM I',
        rating: 1900,
        mainRole: roleEnum.mid,
        subRole: roleEnum.jungle,
        desiredRoles: [roleEnum.mid, roleEnum.jungle],
        isRoleFixed: true,
      }

      const player = Player.fromJson(playerJson)

      expect(player.name).toBe('Alice')
      expect(player.tier).toBe(tierEnum.platinum)
      expect(player.rank).toBe(rankEnum.one)
      expect(player.displayRank).toBe('PLATINUM I')
      expect(player.rating).toBe(1900)
      expect(player.mainRole).toBe(roleEnum.mid)
      expect(player.subRole).toBe(roleEnum.jungle)
      expect(player.desiredRoles).toEqual([roleEnum.mid, roleEnum.jungle])
      expect(player.isRoleFixed).toBe(true)
    })
  })

  describe('setRank', () => {
    test('ティアとランクを正しく設定できること', () => {
      player.setRank(tierEnum.platinum, rankEnum.one)
      expect(player.tier).toBe(tierEnum.platinum)
      expect(player.rank).toBe(rankEnum.one)
      expect(player.rating).toBe(1900)
    })
  })

  describe('setDesiredRoleByRole', () => {
    test('希望ロールを追加できること', () => {
      player.setDesiredRoleByRole(roleEnum.mid)
      expect(player.desiredRoles).toContain(roleEnum.mid)
    })

    test('希望ロールを削除できること', () => {
      player.setDesiredRoleByRole(roleEnum.top)
      expect(player.desiredRoles).not.toContain(roleEnum.top)
    })

    test('希望ロールが正しく切り替えられること', () => {
      player.setDesiredRoleByRole(roleEnum.mid)
      expect(player.desiredRoles).toContain(roleEnum.mid)

      player.setDesiredRoleByRole(roleEnum.mid)
      expect(player.desiredRoles).not.toContain(roleEnum.mid)
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
      expect(info.desiredRoles).toEqual([roleEnum.top])
      expect(info.isRoleFixed).toBe(false)
    })
  })
})
