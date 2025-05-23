import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'
import { roleEnum } from '../../utils/role'
import { generateInternalId } from '../../utils/utils'

describe('Player', () => {
  let player: Player
  const id = generateInternalId()

  beforeEach(() => {
    player = new Player('Player')
    player.id = id
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
      expect(player.rating).toBe(1400)
    })

    test('IDが生成されること', () => {
      expect(player.id).toBeDefined()
      expect(typeof player.id).toBe('string')
      expect(player.id.length).toBeGreaterThan(0)
    })
  })

  describe('fromJson', () => {
    test('PlayerJson から正しくインスタンスを生成できること', () => {
      const playerJson = {
        id: id,
        name: 'Alice',
        tier: tierEnum.platinum,
        rank: rankEnum.one,
        displayRank: 'PLATINUM I',
        rating: 1900,
        mainRole: roleEnum.mid,
        subRole: roleEnum.jg,
        desiredRoles: [roleEnum.mid, roleEnum.jg],
        isRoleFixed: true,
      }

      const player = Player.fromJson(playerJson)

      expect(player.id).toBe(id)
      expect(player.name).toBe('Alice')
      expect(player.tier).toBe(tierEnum.platinum)
      expect(player.rank).toBe(rankEnum.one)
      expect(player.displayRank).toBe('PLATINUM I')
      expect(player.rating).toBe(1900)
      expect(player.mainRole).toBe(roleEnum.mid)
      expect(player.subRole).toBe(roleEnum.jg)
      expect(player.desiredRoles).toEqual([roleEnum.mid, roleEnum.jg])
      expect(player.isRoleFixed).toBe(true)
    })
  })

  describe('tier setter', () => {
    test('ティアを設定するとレーティングと表示ランクが更新されること', () => {
      player.tier = tierEnum.platinum
      expect(player.tier).toBe(tierEnum.platinum)
      expect(player.rating).toBe(1800)
      expect(player.displayRank).toBe('PLATINUM II')
    })
  })

  describe('rank setter', () => {
    test('ランクを設定するとレーティングと表示ランクが更新されること', () => {
      player.rank = rankEnum.one
      expect(player.rank).toBe(rankEnum.one)
      expect(player.rating).toBe(1500)
      expect(player.displayRank).toBe('GOLD I')
    })
  })

  describe('getRatingByRole', () => {
    test('メインロールの場合、正しいレーティングを返す', () => {
      player.mainRole = roleEnum.top
      expect(player.getRatingByRole(roleEnum.top)).toBe(player.rating)
    })

    test('サブロールの場合、正しいレーティングを返す', () => {
      player.mainRole = roleEnum.top
      player.subRole = roleEnum.jg
      expect(player.getRatingByRole(roleEnum.jg)).toBe(player.rating * 0.9)
    })

    test('希望ロールでない場合、正しいレーティングを返す', () => {
      player.mainRole = roleEnum.top
      player.subRole = roleEnum.jg
      expect(player.getRatingByRole(roleEnum.mid)).toBe(player.rating * 0.8)
    })
  })

  describe('setCalculatedRating', () => {
    test('tier と rank に基づいて rating を正しく計算する', () => {
      player.tier = tierEnum.platinum
      player.rank = rankEnum.one
      player.setCalculatedRating()
      expect(player.rating).toBe(1900) // プラチナ1のレーティング
    })
  })

  describe('setDisplayRank', () => {
    test('ティアがマスター以上の場合、ランクなしで表示されること', () => {
      player.tier = tierEnum.master
      player.setDisplayRank()
      expect(player.displayRank).toBe('MASTER')
    })

    test('ティアがマスター未満の場合、ランク付きで表示されること', () => {
      player.tier = tierEnum.gold
      player.rank = rankEnum.two
      player.setDisplayRank()
      expect(player.displayRank).toBe('GOLD II')
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
      expect(info.id).toBe(player.id)
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
