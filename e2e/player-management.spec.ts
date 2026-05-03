import { expect, test } from '@playwright/test'

// E-1: プレイヤーを1人追加し、一覧に表示されることを確認
test('プレイヤーを1人追加すると一覧に表示される', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('プレイヤー名').fill('TestPlayer')
  await page.getByRole('button', { name: 'プレイヤーを追加' }).click()

  await expect(
    page.locator('p.font-bold', { hasText: 'TestPlayer' }).first()
  ).toBeVisible()
  await expect(page.getByText(/レート:\s*\d+/).first()).toBeVisible()
})

// E-6: サンプルデータ投入で10人が一覧に追加される
test('サンプルデータを投入すると10人が一覧に追加される', async ({ page }) => {
  await page.goto('/')

  await page
    .getByRole('button', { name: 'サンプル投入（10人）' })
    .click()

  await expect(
    page.locator('p.font-bold', { hasText: 'Sample_Top1' }).first()
  ).toBeVisible()
  await expect(page.getByText('合計:').first()).toBeVisible()
  await expect(page.getByText('10').first()).toBeVisible()
})
