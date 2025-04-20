import { generateRandomPermutations, parseChatLogs } from '../../utils/utils'

describe('parseChatLogs', () => {
  test('ロビーに参加したプレイヤー名を正しく取得できること', () => {
    const logs = `
      Alice #1234がロビーに参加しました。
      Bob #5678がロビーに参加しました。
    `
    const result = parseChatLogs(logs)
    expect(result).toEqual(['Alice', 'Bob'])
  })

  test('ロビーから退出したプレイヤー名がリストから削除されること', () => {
    const logs = `
      Alice #1234がロビーに参加しました。
      Bob #5678がロビーに参加しました。
      Alice #1234がロビーから退出しました。
    `
    const result = parseChatLogs(logs)
    expect(result).toEqual(['Bob'])
  })

  test('無関係なログが無視されること', () => {
    const logs = `
      Alice #1234がロビーに参加しました。
      無関係なログメッセージ
      Bob #5678がロビーに参加しました。
      システムメッセージ: サーバーが再起動されました。
    `
    const result = parseChatLogs(logs)
    expect(result).toEqual(['Alice', 'Bob'])
  })

  test('空のログを渡した場合、空のリストが返されること', () => {
    const logs = ''
    const result = parseChatLogs(logs)
    expect(result).toEqual([])
  })

  test('ロビーに参加した後、全員が退出した場合、空のリストが返されること', () => {
    const logs = `
      Alice #1234がロビーに参加しました。
      Bob #5678がロビーに参加しました。
      Alice #1234がロビーから退出しました。
      Bob #5678がロビーから退出しました。
    `
    const result = parseChatLogs(logs)
    expect(result).toEqual([])
  })
})

describe('generateRandomPermutations', () => {
  test('指定された数のユニークな順列が生成されること', () => {
    const array = [0, 1, 2]
    const count = 5
    const result = generateRandomPermutations(array, count)

    expect(result.length).toBe(count)

    const uniqueResults = new Set(result.map((perm) => perm.join(',')))
    expect(uniqueResults.size).toBe(count)
  })

  test('生成された順列が元の配列の要素をすべて含むこと', () => {
    const array = [0, 1, 2]
    const count = 5
    const result = generateRandomPermutations(array, count)

    result.forEach((perm) => {
      expect(perm.sort()).toEqual(array.sort())
    })
  })

  test('生成する順列の数が全順列数を超えないこと', () => {
    const array = [0, 1, 2]
    const count = 10
    const result = generateRandomPermutations(array, count)

    expect(result.length).toBeLessThanOrEqual(6)
  })

  test('空の配列を渡した場合、空の順列リストが返されること', () => {
    const count = 5
    const result = generateRandomPermutations([], count)

    expect(result).toEqual([])
  })

  test('count が 0 の場合、空のリストが返されること', () => {
    const array = [0, 1, 2]
    const count = 0
    const result = generateRandomPermutations(array, count)

    expect(result).toEqual([])
  })
})
