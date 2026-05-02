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

  await page.locator('#textarea-field').fill(CHAT_LOG)
  await page.getByRole('button', { name: 'Import' }).first().click()

  await expect(
    page.locator('p.font-bold', { hasText: 'Player01' }).first()
  ).toBeVisible()
  await expect(
    page.locator('p.font-bold', { hasText: 'Player02' }).first()
  ).toBeVisible()
  await expect(
    page.locator('p.font-bold', { hasText: 'Player05' }).first()
  ).toBeVisible()
})
