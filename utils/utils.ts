export function parseChatLogs(logs: string): string[] {
  const result: string[] = []
  const joinLogRegex = /^(.+?) #\d+がロビーに参加しました。$/
  const leaveLogRegex = /^(.+?) #\d+がロビーから退出しました。$/

  logs.split('\n').forEach((line) => {
    const trimmedLine = line.trim()

    if (joinLogRegex.test(trimmedLine)) {
      const name = trimmedLine.match(joinLogRegex)?.[1]
      if (name) result.push(name)
    } else if (leaveLogRegex.test(trimmedLine)) {
      const name = trimmedLine.match(leaveLogRegex)?.[1]
      if (name) {
        const index = result.indexOf(name)
        if (index !== -1) result.splice(index, 1)
      }
    }
  })

  return result
}

export function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1)
}

export function generateRandomPermutations<T>(
  array: T[],
  count: number
): T[][] {
  if (array.length === 0) return []

  const permute = (arr: T[], m: T[] = []): T[][] => {
    if (arr.length === 0) return [m]
    return arr.flatMap((_, i) => {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
      return permute(rest, [...m, arr[i]])
    })
  }

  const shuffle = <T>(arr: T[]): T[] => {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  const allPermutations = shuffle(permute(array))
  return allPermutations.slice(0, Math.min(count, allPermutations.length))
}

export function generateInternalId(): string {
  const timestamp = Date.now()
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  return `${timestamp}-${randomPart}`
}
