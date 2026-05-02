import { Page } from '@playwright/test'

/**
 * プレイヤーを1人追加する補助関数。
 * Single タブが選択済みの状態で呼び出すこと。
 */
export const addPlayer = async (page: Page, name: string): Promise<void> => {
  await page.getByLabel('Player Name').fill(name)
  await page.getByRole('button', { name: 'Add Player' }).click()

  // Divide Teams は「参加中プレイヤーが10人」で有効になるため、
  // E2E では追加直後に参加トグルを ON に統一する。
  await page.getByTitle('Toggle Participation').last().click()
}

/**
 * 10人のプレイヤーを追加してチーム分割可能な状態にする補助関数。
 */
export const addTenPlayers = async (page: Page): Promise<void> => {
  const names = [
    'Player01',
    'Player02',
    'Player03',
    'Player04',
    'Player05',
    'Player06',
    'Player07',
    'Player08',
    'Player09',
    'Player10',
  ]
  for (const name of names) {
    await addPlayer(page, name)
  }
}
