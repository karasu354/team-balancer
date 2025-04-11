import {
  computeDeterminant,
  getCombinations,
  parseChatLogs,
} from '../../utils/utils'

describe('getCombinations', () => {
  test('配列から指定されたサイズのすべての組み合わせを取得できる', () => {
    const array = [1, 2, 3, 4]
    const k = 2
    const expected = [
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4],
    ]
    expect(getCombinations(array, k)).toEqual(expected)
  })

  test('空の配列を渡した場合、空の結果を返す', () => {
    const array: number[] = []
    const k = 2
    expect(getCombinations(array, k)).toEqual([])
  })

  test('組み合わせのサイズが 0 の場合、空の配列を返す', () => {
    const array = [1, 2, 3]
    const k = 0
    expect(getCombinations(array, k)).toEqual([[]])
  })

  test('組み合わせのサイズが配列の長さを超える場合、空の配列を返す', () => {
    const array = [1, 2]
    const k = 3
    expect(getCombinations(array, k)).toEqual([])
  })
})

describe('computeDeterminant', () => {
  test('1x1 行列の行列式を正しく計算できる', () => {
    const matrix = [[5]]
    expect(computeDeterminant(matrix)).toBe(5)
  })

  test('2x2 行列の行列式を正しく計算できる', () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ]
    expect(computeDeterminant(matrix)).toBe(-2)
  })

  test('3x3 行列の行列式を正しく計算できる', () => {
    const matrix = [
      [6, 1, 1],
      [4, -2, 5],
      [2, 8, 7],
    ]
    expect(computeDeterminant(matrix)).toBe(-306)
  })

  test('行列が空の場合、エラーをスローする', () => {
    const matrix: number[][] = []
    expect(() => computeDeterminant(matrix)).toThrow('行列が空です')
  })

  test('非正方行列の場合、エラーをスローする', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ]
    expect(() => computeDeterminant(matrix)).toThrow('非正方行列です')
  })

  test('非正則行列 (行列式が 0) の場合、行列式が 0 を返す', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    expect(computeDeterminant(matrix)).toBe(0)
  })
})

describe('parseChatLogs', () => {
  test('入室ログからプレイヤー名とタグ名を正しく抽出できる', () => {
    const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
ひろし #123がロビーに参加しました。`

    const expected = [
      ['Player1', 'JP1'],
      ['Player2', 'meow'],
      ['ひろし', '123'],
    ]

    expect(parseChatLogs(logs)).toEqual(expected)
  })

  test('退室ログでプレイヤーが削除されることを確認する', () => {
    const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。`

    const expected = [['Player2', 'meow']]

    expect(parseChatLogs(logs)).toEqual(expected)
  })

  test('入室ログと退室ログが混在している場合の処理を確認する', () => {
    const logs = `Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。
ひろし #123がロビーに参加しました。`

    const expected = [
      ['Player2', 'meow'],
      ['ひろし', '123'],
    ]

    expect(parseChatLogs(logs)).toEqual(expected)
  })

  test('空のログを渡した場合、空の結果を返す', () => {
    const logs = ''
    expect(parseChatLogs(logs)).toEqual([])
  })
})
