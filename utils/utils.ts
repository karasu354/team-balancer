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

export function parseChatLogs(logs: string): [string, string][] {
  const result: [string, string][] = []
  const lines = logs.split('\n') // 改行で分割
  const joinLogRegex = /^(.+?) #(.+?)がロビーに参加しました。$/
  const leaveLogRegex = /^(.+?) #(.+?)がロビーから退出しました。$/

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex !== -1 && trimmedLine.lastIndexOf('#', colonIndex) === -1)
      return

    const joinMatch = trimmedLine.match(joinLogRegex)
    if (joinMatch) {
      const [, name, tag] = joinMatch
      result.push([name, tag])
      return
    }

    const leaveMatch = trimmedLine.match(leaveLogRegex)
    if (leaveMatch) {
      const [, name, tag] = leaveMatch
      const index = result.findIndex(([n, t]) => n === name && t === tag)
      if (index !== -1) {
        result.splice(index, 1)
      }
    }
  })

  return result
}
