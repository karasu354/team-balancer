import { calcurateRating, rankEnum, tierEnum } from './rank'

export class Player {
  readonly name: string
  readonly tagLine: string
  isParticipatingInGame: boolean = false
  desiredRoles: boolean[] = Array(5).fill(true)
  isRoleFixed: boolean = false
  tier: tierEnum
  rank: rankEnum
  displayRank: string = ''
  rating: number

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
    this.rating = calcurateRating(this.tier, this.rank)
  }

  /**
   * 希望ロールの更新
   * @param index ロール番号 (0:TOP, 1:JUNGLE, 2:MID, 3:ADC, 4:SUPPORT)
   */
  setDesiredRoleByIndex(index: number): void {
    if (index < 0 || index >= this.desiredRoles.length) {
      throw new Error('Invalid role index.')
    }
    this.desiredRoles[index] = !this.desiredRoles[index]
  }

  /**
   * ランクの設定、レーティング計算、ランク表示の更新
   * @param tier ティア (例: tierEnum.gold)
   * @param rank ランク (例: rankEnum.two)
   */
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
}
