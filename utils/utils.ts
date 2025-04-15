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
