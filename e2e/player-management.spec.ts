import { expect, test } from '@playwright/test'

// E-1: プレイヤーを1人追加し、一覧に表示されることを確認
test('プレイヤーを1人追加すると一覧に表示される', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Player Name').fill('TestPlayer')
  await page.getByRole('button', { name: 'Add Player' }).click()

  await expect(page.locator('p.font-bold', { hasText: 'TestPlayer' }).first()).toBeVisible()
})
