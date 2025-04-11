/**
 * プレイヤー情報を取得するAPI呼び出し関数
 * @param apiKey Riot APIキー
 * @param gameName サモナー名
 * @param tagLine タグ名
 * @returns プレイヤー情報のPromise
 */
export async function fetchPlayerInfo(
  apiKey: string,
  gameName: string,
  tagLine: string
): Promise<any> {
  try {
    const response = await fetch('/api/playerInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, gameName, tagLine }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch player info: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in fetchPlayerInfo:', error)
    throw error
  }
}
