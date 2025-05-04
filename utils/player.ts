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

  tier: tierEnum = tierEnum.gold
  rank: rankEnum = rankEnum.two
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
    this.setCalculatedRating()
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
    this.displayRank = `${this.tier.toUpperCase()} ${this.rank}`
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
