import { calculateRating, rankEnum, tierEnum } from './rank'
import { roleEnum } from './role'
import { generateInternalId } from './utils'

export interface PlayerJson {
  id: string
  name: string
  tier: tierEnum
  rank: rankEnum
  displayRank: string
  rating: number
  mainRole: roleEnum
  subRole: roleEnum
  desiredRoles: roleEnum[]
  isRoleFixed: boolean
}

export class Player {
  private static readonly ROLE_RATING_MULTIPLIER_FOR_SUB = 0.9
  private static readonly ROLE_RATING_MULTIPLIER_FOR_NOT_DESIRED = 0.8

  id: string = ''
  name: string = ''
  isParticipatingInGame: boolean = false

  _tier: tierEnum = tierEnum.gold
  _rank: rankEnum = rankEnum.two
  displayRank: string = ''
  rating: number = 0

  mainRole: roleEnum
  subRole: roleEnum
  desiredRoles: roleEnum[] = Object.values(roleEnum).filter(
    (role) => role !== roleEnum.all
  )
  isRoleFixed: boolean = false

  constructor(
    name: string = '',
    tier: tierEnum = tierEnum.gold,
    rank: rankEnum = rankEnum.two,
    mainRole: roleEnum = roleEnum.all,
    subRole: roleEnum = roleEnum.all
  ) {
    this.id = generateInternalId()
    this.name = name
    this.tier = tier
    this.rank = rank
    this.mainRole = mainRole
    this.subRole = subRole
  }

  static fromJson(playerJson: PlayerJson): Player {
    const player = new Player(
      playerJson.name,
      playerJson.tier,
      playerJson.rank,
      playerJson.mainRole,
      playerJson.subRole
    )
    player.id = playerJson.id
    player.displayRank = playerJson.displayRank
    player.rating = playerJson.rating
    player.desiredRoles = playerJson.desiredRoles
    player.isRoleFixed = playerJson.isRoleFixed
    return player
  }

  get tier(): tierEnum {
    return this._tier
  }
  set tier(value: tierEnum) {
    this._tier = value
    this.setCalculatedRating()
    this.setDisplayRank()
  }
  get rank(): rankEnum {
    return this._rank
  }
  set rank(value: rankEnum) {
    this._rank = value
    this.setCalculatedRating()
    this.setDisplayRank()
  }

  getRatingByRole(role: roleEnum): number {
    if (this.mainRole === roleEnum.all || this.mainRole === role) {
      return this.rating
    }
    if (this.subRole === roleEnum.all || this.subRole === role) {
      return this.rating * Player.ROLE_RATING_MULTIPLIER_FOR_SUB
    }
    return this.rating * Player.ROLE_RATING_MULTIPLIER_FOR_NOT_DESIRED
  }

  setCalculatedRating(): void {
    this.rating = calculateRating(this.tier, this.rank)
  }

  setDisplayRank(): void {
    if (
      [tierEnum.master, tierEnum.grandmaster, tierEnum.challenger].includes(
        this.tier
      )
    ) {
      this.displayRank = this.tier.toUpperCase()
    } else {
      this.displayRank = `${this.tier.toUpperCase()} ${this.rank}`
    }
  }

  setDesiredRoleByRole(role: roleEnum): void {
    if (this.desiredRoles.includes(role)) {
      this.desiredRoles = this.desiredRoles.filter((r) => r !== role)
    } else {
      this.desiredRoles.push(role)
    }
  }

  get playerInfo(): PlayerJson {
    return {
      id: this.id,
      name: this.name,
      tier: this.tier,
      rank: this.rank,
      displayRank: this.displayRank,
      rating: this.rating,
      mainRole: this.mainRole,
      subRole: this.subRole,
      desiredRoles: this.desiredRoles,
      isRoleFixed: this.isRoleFixed,
    }
  }
}

// アプリの操作に慣れるためのサンプルデータ（10人分）を生成する
export const generateSamplePlayers = (): Player[] => {
  const configs: {
    name: string
    tier: tierEnum
    rank: rankEnum
    mainRole: roleEnum
    subRole: roleEnum
  }[] = [
    {
      name: 'Sample_Top1',
      tier: tierEnum.diamond,
      rank: rankEnum.two,
      mainRole: roleEnum.top,
      subRole: roleEnum.mid,
    },
    {
      name: 'Sample_Jg1',
      tier: tierEnum.emerald,
      rank: rankEnum.one,
      mainRole: roleEnum.jg,
      subRole: roleEnum.top,
    },
    {
      name: 'Sample_Mid1',
      tier: tierEnum.emerald,
      rank: rankEnum.three,
      mainRole: roleEnum.mid,
      subRole: roleEnum.bot,
    },
    {
      name: 'Sample_Bot1',
      tier: tierEnum.platinum,
      rank: rankEnum.one,
      mainRole: roleEnum.bot,
      subRole: roleEnum.sup,
    },
    {
      name: 'Sample_Sup1',
      tier: tierEnum.gold,
      rank: rankEnum.one,
      mainRole: roleEnum.sup,
      subRole: roleEnum.jg,
    },
    {
      name: 'Sample_Top2',
      tier: tierEnum.gold,
      rank: rankEnum.two,
      mainRole: roleEnum.top,
      subRole: roleEnum.jg,
    },
    {
      name: 'Sample_Jg2',
      tier: tierEnum.silver,
      rank: rankEnum.one,
      mainRole: roleEnum.jg,
      subRole: roleEnum.mid,
    },
    {
      name: 'Sample_Mid2',
      tier: tierEnum.gold,
      rank: rankEnum.three,
      mainRole: roleEnum.mid,
      subRole: roleEnum.top,
    },
    {
      name: 'Sample_Bot2',
      tier: tierEnum.platinum,
      rank: rankEnum.two,
      mainRole: roleEnum.bot,
      subRole: roleEnum.mid,
    },
    {
      name: 'Sample_Sup2',
      tier: tierEnum.silver,
      rank: rankEnum.two,
      mainRole: roleEnum.sup,
      subRole: roleEnum.bot,
    },
  ]

  return configs.map(({ name, tier, rank, mainRole, subRole }) => {
    const player = new Player(name, tier, rank, mainRole, subRole)
    player.isParticipatingInGame = true
    return player
  })
}
