import { expect, test } from '@playwright/test'

import { addPlayer, addTenPlayers } from './helpers/playerHelpers'

// E-2: 10人参加状態でチーム分割を実行し、結果が表示される
test('10人いるときチーム分割が実行できる', async ({ page }) => {
  await page.goto('/')

  await addTenPlayers(page)

  await page.getByRole('button', { name: 'Divide Teams' }).click()

  // 分割完了まで待機（最大10秒）
  await expect(page.getByText('Blue')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Red')).toBeVisible({ timeout: 10000 })
})

// E-5: 参加プレイヤーが10人未満のとき分割ボタンが非活性
test('10人未満のとき Divide Teams ボタンが非活性', async ({ page }) => {
  await page.goto('/')

  await addPlayer(page, 'OnlyOnePlayer')

  const divideButton = page.getByRole('button', { name: 'Divide Teams' })
  await expect(divideButton).toBeDisabled()
})
