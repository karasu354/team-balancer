import { calculateRating, rankEnum, tierEnum } from './rank'

export interface PlayerJson {
  name: string
  desiredRoles: boolean[]
  isRoleFixed: boolean
  tier: string
  rank: string
  displayRank: string
  rating: number
}
export class Player {
  name: string = ''
  isParticipatingInGame: boolean = false

  tier: tierEnum = tierEnum.gold
  rank: rankEnum = rankEnum.two
  displayRank: string = ''
  rating: number = 0

  desiredRoles: boolean[] = Array(5).fill(true)
  isRoleFixed: boolean = false

  constructor(
    name: string,
    tier: tierEnum = tierEnum.gold,
    rank: rankEnum = rankEnum.two
  ) {
    this.name = name
    this.setRank(tier, rank)
  }

  setRank(tier: tierEnum, rank: rankEnum): void {
    if (
      !Object.values(tierEnum).includes(tier) ||
      !Object.values(rankEnum).includes(rank)
    ) {
      throw new Error('無効なティアまたはランクです。')
    }
    this.tier = tier
    this.rank = rank
    this.rating = calculateRating(tier, rank)

    this.displayRank =
      this.tier === tierEnum.master ||
      this.tier === tierEnum.grandmaster ||
      this.tier === tierEnum.challenger
        ? this.tier
        : `${this.tier} ${this.rank}`
  }

  setDesiredRoleByIndex(index: number): void {
    if (index < 0 || index >= this.desiredRoles.length) {
      throw new Error('無効なロール番号です。')
    }
    this.desiredRoles[index] = !this.desiredRoles[index]
  }

  get playerInfo(): PlayerJson {
    return {
      name: this.name,
      desiredRoles: this.desiredRoles,
      isRoleFixed: this.isRoleFixed,
      tier: this.tier,
      rank: this.rank,
      displayRank: this.displayRank,
      rating: this.rating,
    }
  }
}
