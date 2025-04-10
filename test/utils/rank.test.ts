import {
  calcurateRating,
  tierEnum,
  rankEnum,
  isValidTier,
  isValidRank,
} from '../../utils/rank'

describe('calcurateRating', () => {
  test('ランクが GOLD III のとき、計算が正しいこと', () => {
    const tier = tierEnum.gold
    const rank = rankEnum.three
    expect(calcurateRating(tier, rank)).toBe(1300)
  })

  test('ランクが CHALLENGER のとき、計算が正しいこと (ランクを無視)', () => {
    const tier = tierEnum.challenger
    const rank = rankEnum.three // ランクは無視される
    expect(calcurateRating(tier, rank)).toBe(3600)
  })

  test('ランクが MASTER のとき、計算が正しいこと (ランクを無視)', () => {
    const tier = tierEnum.master
    const rank = rankEnum.one // ランクは無視される
    expect(calcurateRating(tier, rank)).toBe(2800)
  })

  test('ランクが PLATINUM I のとき、計算が正しいこと', () => {
    const tier = tierEnum.platinum
    const rank = rankEnum.one
    expect(calcurateRating(tier, rank)).toBe(1900)
  })

  test('ランクが EMERALD IV のとき、計算が正しいこと', () => {
    const tier = tierEnum.emerald
    const rank = rankEnum.four
    expect(calcurateRating(tier, rank)).toBe(2000)
  })

  test('無効なティアを渡した場合、エラーをスローする', () => {
    const tier = 'invalidTier' as tierEnum
    const rank = rankEnum.one
    expect(() => calcurateRating(tier, rank)).toThrow(
      '無効なティアまたはランクです'
    )
  })

  test('無効なランクを渡した場合、エラーをスローする', () => {
    const tier = tierEnum.gold
    const rank = 'invalidRank' as rankEnum
    expect(() => calcurateRating(tier, rank)).toThrow(
      '無効なティアまたはランクです'
    )
  })
})

describe('isValidTier', () => {
  test('有効なティアを渡した場合、true を返す', () => {
    expect(isValidTier('GOLD')).toBe(true)
    expect(isValidTier('CHALLENGER')).toBe(true)
  })

  test('無効なティアを渡した場合、false を返す', () => {
    expect(isValidTier('INVALID')).toBe(false)
    expect(isValidTier('')).toBe(false)
  })
})

describe('isValidRank', () => {
  test('有効なランクを渡した場合、true を返す', () => {
    expect(isValidRank('I')).toBe(true)
    expect(isValidRank('IV')).toBe(true)
  })

  test('無効なランクを渡した場合、false を返す', () => {
    expect(isValidRank('INVALID')).toBe(false)
    expect(isValidRank('')).toBe(false)
  })
})
