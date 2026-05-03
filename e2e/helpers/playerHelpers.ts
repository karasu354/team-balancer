import { Page, expect } from '@playwright/test'

/**
 * プレイヤーを1人追加する補助関数。
 * Single タブが選択済みの状態で呼び出すこと。
 */
export const addPlayer = async (page: Page, name: string): Promise<void> => {
  await page.getByLabel('プレイヤー名').fill(name)
  await page.getByRole('button', { name: 'プレイヤーを追加' }).click()

  // Divide Teams は「参加中プレイヤーが10人」で有効になるため、
  // E2E では追加直後に参加トグルを ON に統一する。
  await page.getByTitle('参加切替').last().click()
}

/**
 * 10人のプレイヤーを追加してチーム分割可能な状態にする補助関数。
 * 全員のトグルが確定し「10/10」が表示されるまで待機する。
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
  // CI 低速環境でトグル操作が揃いきる前にチーム分けが押されないよう、
  // ヘッダーの「参加中」ラベル直後の段落（例: "10/10"）が表示されるまで待機する。
  // getByText('10/10') は複数要素に一致するため CSS 隣接兄弟セレクタで特定する。
  await expect(page.locator('p:has-text("参加中") + p')).toHaveText('10/10', {
    timeout: 15000,
  })
}
