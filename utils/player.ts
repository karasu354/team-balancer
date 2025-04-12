import { calcurateRating, rankEnum, tierEnum } from './rank'

export class Player {
  // サモナー名とタグ名
  private readonly name: string
  private readonly tagLine: string

  // 希望ロールの初期値
  private desiredRole: number[] = [1, 1, 1, 1, 1]

  // ランク情報
  private tier: tierEnum = tierEnum.gold
  private rank: rankEnum = rankEnum.two
  private rating: number

  constructor(name: string, tagLine: string) {
    this.name = name
    this.tagLine = tagLine
    this.rating = calcurateRating(this.tier, this.rank)
  }

  /**
   * 希望ロールを切り替える
   * @param role ロール番号 (0:TOP, 1:JUNGLE, 2:MID, 3:ADC, 4:SUPPORT)
   */
  setRole(role: number): void {
    if (role < 0 || role >= this.desiredRole.length) {
      throw new Error('無効なロール番号です')
    }
    this.desiredRole[role] = 1 - this.desiredRole[role]
  }

  /**
   * ランクを設定し、レーティングを更新する
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
  }

  /**
   * ランクとティアを表示する文字列を取得する
   * @returns ランク＋ティアの文字列
   */
  getDisplayRank(): string {
    if (
      this.tier === tierEnum.master ||
      this.tier === tierEnum.grandmaster ||
      this.tier === tierEnum.challenger
    ) {
      return this.tier
    }
    return `${this.tier} ${this.rank}`
  }

  // Getter メソッドを追加して外部からプロパティを参照可能にする
  getName(): string {
    return this.name
  }

  getTagLine(): string {
    return this.tagLine
  }

  getDesiredRole(): number[] {
    return [...this.desiredRole] // 配列のコピーを返す
  }

  getTier(): tierEnum {
    return this.tier
  }

  getRank(): rankEnum {
    return this.rank
  }

  getRating(): number {
    return this.rating
  }
}
