import { getCombinations, parseChatLogs } from '../../utils/utils'

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
