import { expect, test } from '@playwright/test'

const CHAT_LOG = `Player01 #JP1がロビーに参加しました。
Player02 #meowがロビーに参加しました。
Player03 #catがロビーに参加しました。
Player04 #dogがロビーに参加しました。
Player05 #fishがロビーに参加しました。`

// E-4: チャットログを貼り付けて複数プレイヤーが追加される
test('チャットログ取り込みで複数プレイヤーが追加される', async ({ page }) => {
  await page.goto('/')

  // Multi タブへ切り替え
  await page.getByRole('button', { name: 'Multi' }).click()

  await page.getByRole('textbox').fill(CHAT_LOG)
  await page.getByRole('button', { name: 'Import' }).click()

  await expect(page.getByText('Player01')).toBeVisible()
  await expect(page.getByText('Player02')).toBeVisible()
  await expect(page.getByText('Player05')).toBeVisible()
})
