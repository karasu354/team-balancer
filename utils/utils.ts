/**
 * 配列から指定されたサイズのすべての組み合わせを取得する関数
 * @param array 元の配列
 * @param k 組み合わせのサイズ
 * @returns 組み合わせの配列
 */
export function getCombinations<T>(array: T[], k: number): T[][] {
  const result: T[][] = []

  const generate = (index: number, current: T[]) => {
    if (current.length === k) {
      result.push([...current])
      return
    }
    for (let i = index; i < array.length; i++) {
      current.push(array[i])
      generate(i + 1, current)
      current.pop()
    }
  }

  generate(0, [])
  return result
}

/**
 * 行列の行列式を計算する関数
 * @param matrix 行列 (二次元配列)
 * @returns 行列式の値
 */
export function computeDeterminant(matrix: number[][]): number {
  const n = matrix.length

  // 行列が空の場合
  if (n === 0) {
    throw new Error('行列が空です')
  }

  // 非正方行列の場合
  if (!matrix.every((row) => row.length === n)) {
    throw new Error('非正方行列です')
  }

  // 1x1 行列の場合
  if (n === 1) return matrix[0][0]

  // 2x2 行列の場合
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  }

  // n > 2 の場合、再帰的に計算
  let determinant = 0
  for (let col = 0; col < n; col++) {
    // サブ行列 (余因子) を作成
    const subMatrix = matrix
      .slice(1)
      .map((row) => row.filter((_, j) => j !== col))
    const sign = col % 2 === 0 ? 1 : -1 // 交互に符号を切り替える
    determinant += sign * matrix[0][col] * computeDeterminant(subMatrix)
  }

  return determinant
}

/**
 * カスタムマッチのチャットログを解析してプレイヤー名とタグ名を抽出する関数
 * @param logs 改行コードを含むチャットログの文字列
 * @returns プレイヤー名とタグ名の二重リスト
 */
export function parseChatLogs(logs: string): [string, string][] {
  const result: [string, string][] = []
  const lines = logs.split('\n') // 改行で分割

  // 入室ログの正規表現
  const joinLogRegex = /^(.+?) #(.+?)がロビーに参加しました。$/
  // 退室ログの正規表現
  const leaveLogRegex = /^(.+?) #(.+?)がロビーから退出しました。$/

  lines.forEach((line) => {
    // 文前後の空白を削除
    const trimmedLine = line.trim()

    // コロンが含まれる場合、そのコロンの前にシャープがない場合は無視
    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex !== -1 && trimmedLine.lastIndexOf('#', colonIndex) === -1)
      return

    // 入室ログの処理
    const joinMatch = trimmedLine.match(joinLogRegex)
    if (joinMatch) {
      const [, name, tag] = joinMatch
      result.push([name, tag])
      return
    }

    // 退室ログの処理
    const leaveMatch = trimmedLine.match(leaveLogRegex)
    if (leaveMatch) {
      const [, name, tag] = leaveMatch
      // 退室したプレイヤーを結果から削除
      const index = result.findIndex(([n, t]) => n === name && t === tag)
      if (index !== -1) {
        result.splice(index, 1)
      }
    }
  })

  return result
}
