import { calcurateRating, rankEnum, tierEnum } from './rank'

export interface PlayerJson {
  name: string
  tagLine: string
  desiredRoles: boolean[]
  isRoleFixed: boolean
  tier: string
  rank: string
  displayRank: string
  rating: number
}
export class Player {
  readonly name: string
  readonly tagLine: string
  isParticipatingInGame: boolean = false
  desiredRoles: boolean[] = Array(5).fill(true)
  isRoleFixed: boolean = false
  tier: tierEnum
  rank: rankEnum
  displayRank: string = ''
  rating: number = 0

  constructor(
    name: string,
    tagLine: string,
    tier: tierEnum = tierEnum.gold,
    rank: rankEnum = rankEnum.two
  ) {
    this.name = name
    this.tagLine = tagLine
    this.tier = tier
    this.rank = rank
    this.setRank(this.tier, this.rank)
  }

  setDesiredRoleByIndex(index: number): void {
    if (index < 0 || index >= this.desiredRoles.length) {
      throw new Error('Invalid role index.')
    }
    this.desiredRoles[index] = !this.desiredRoles[index]
  }

  setRank(tier: tierEnum, rank: rankEnum): void {
    if (
      !Object.values(tierEnum).includes(tier) ||
      !Object.values(rankEnum).includes(rank)
    ) {
      throw new Error('無効なティアまたはランクです')
    }
    this.tier = tier
    this.rank = rank
    this.rating = calcurateRating(tier, rank)

    this.displayRank =
      this.tier === tierEnum.master ||
      this.tier === tierEnum.grandmaster ||
      this.tier === tierEnum.challenger
        ? this.tier
        : `${this.tier} ${this.rank}`
  }

  get playerInfo(): PlayerJson {
    return {
      name: this.name,
      tagLine: this.tagLine,
      desiredRoles: this.desiredRoles,
      isRoleFixed: this.isRoleFixed,
      tier: this.tier,
      rank: this.rank,
      displayRank: this.displayRank,
      rating: this.rating,
    }
  }
}
