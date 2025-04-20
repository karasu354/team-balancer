export function parseChatLogs(logs: string): string[] {
  const result: string[] = []
  const lines = logs.split('\n')
  const joinLogRegex = /^(.+?) #(.+?)がロビーに参加しました。$/
  const leaveLogRegex = /^(.+?) #(.+?)がロビーから退出しました。$/

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex !== -1 && trimmedLine.lastIndexOf('#', colonIndex) === -1)
      return

    const joinMatch = trimmedLine.match(joinLogRegex)
    if (joinMatch) {
      const [name] = joinMatch.slice(1, 2)
      result.push(name)
      return
    }

    const leaveMatch = trimmedLine.match(leaveLogRegex)
    if (leaveMatch) {
      const [name] = leaveMatch.slice(1, 2)
      const index = result.findIndex((n) => n === name)
      if (index !== -1) {
        result.splice(index, 1)
      }
    }
  })

  return result
}

export function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1)
}

export function generateRandomPermutations(
  array: number[],
  count: number
): number[][] {
  if (array.length === 0) return []
  const result: Set<string> = new Set()
  const maxCount = factorial(array.length)

  while (result.size < maxCount && result.size < count) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    result.add(shuffled.join(','))
  }

  return Array.from(result).map((str) => str.split(',').map(Number))
}
