import { parseChatLogs } from '../../utils/utils'

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
