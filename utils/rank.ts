export enum tierEnum {
  iron = 'IRON',
  bronze = 'BRONZE',
  silver = 'SILVER',
  gold = 'GOLD',
  platinum = 'PLATINUM',
  emerald = 'EMERALD',
  diamond = 'DIAMOND',
  master = 'MASTER',
  grandmaster = 'GRANDMASTER',
  challenger = 'CHALLENGER',
}

export enum rankEnum {
  one = 'I',
  two = 'II',
  three = 'III',
  four = 'IV',
}

const tierScores: Record<tierEnum, number> = {
  [tierEnum.iron]: 0,
  [tierEnum.bronze]: 400,
  [tierEnum.silver]: 800,
  [tierEnum.gold]: 1200,
  [tierEnum.platinum]: 1600,
  [tierEnum.emerald]: 2000,
  [tierEnum.diamond]: 2400,
  [tierEnum.master]: 2800,
  [tierEnum.grandmaster]: 3200,
  [tierEnum.challenger]: 3600,
}

const rankScores: Record<rankEnum, number> = {
  [rankEnum.one]: 300,
  [rankEnum.two]: 200,
  [rankEnum.three]: 100,
  [rankEnum.four]: 0,
}

/**
 * ティアとランクからレーティングを計算する
 * @param tier ティア (例: tierEnum.gold)
 * @param rank ランク (例: rankEnum.two)
 * @returns レーティング (数値)
 */
export const calcurateRating = (tier: tierEnum, rank: rankEnum): number => {
  if (
    !Object.values(tierEnum).includes(tier) ||
    !Object.values(rankEnum).includes(rank)
  ) {
    throw new Error('無効なティアまたはランクです')
  }

  // 上位ティアはランクを考慮しない
  if (
    tier === tierEnum.master ||
    tier === tierEnum.grandmaster ||
    tier === tierEnum.challenger
  ) {
    return tierScores[tier]
  }
  return tierScores[tier] + rankScores[rank]
}

/**
 * 文字列が tierEnum のいずれかに該当するかを判定する
 * @param value 判定する文字列
 * @returns 該当する場合は true、それ以外は false
 */
export const isValidTier = (value: string): boolean => {
  return Object.values(tierEnum).includes(value as tierEnum)
}

/**
 * 文字列が rankEnum のいずれかに該当するかを判定する
 * @param value 判定する文字列
 * @returns 該当する場合は true、それ以外は false
 */
export const isValidRank = (value: string): boolean => {
  return Object.values(rankEnum).includes(value as rankEnum)
}

/**
 * ティアのリストを取得する
 * @returns ティアのリスト
 */
export const getTierList = (): string[] => {
  return Object.values(tierEnum)
}

/**
 * ランクのリストを取得する
 * @returns ランクのリスト
 */
export const getRankList = (): string[] => {
  return Object.values(rankEnum)
}
