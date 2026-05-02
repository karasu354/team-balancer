import { expect, test } from '@playwright/test'

import { addTenPlayers } from './helpers/playerHelpers'
import { setupTeamApiMock } from './helpers/apiMock'

// E-3: ID保存→読み込みでプレイヤー一覧が復元される（Fast E2E: API モック）
test('ID保存→読み込みでプレイヤー一覧が復元される', async ({ page }) => {
  await setupTeamApiMock(page)

  const testId = `e2e-test-${Date.now()}`

  // プレイヤーを追加して保存
  await page.goto('/')
  await addTenPlayers(page)

  const idInput = page.getByPlaceholder('Input ID')
  await idInput.fill(testId)
  await page.getByRole('button', { name: 'Save' }).click()

  // ページをリロードして読み込み
  await page.goto('/')
  await idInput.fill(testId)
  await page.getByRole('button', { name: 'Import' }).first().click()

  await expect(page.getByText('Player01')).toBeVisible({ timeout: 5000 })
})

// E-6: 存在しない ID で読み込んだときエラーが表示される（Fast E2E: API モック）
test('存在しない ID で読み込むとエラーが表示される', async ({ page }) => {
  await setupTeamApiMock(page)

  await page.goto('/')

  const idInput = page.getByPlaceholder('Input ID')
  await idInput.fill('nonexistent-id-xyz-12345')

  // alert をキャプチャする
  const alertPromise = page.waitForEvent('dialog')
  await page.getByRole('button', { name: 'Import' }).first().click()
  const dialog = await alertPromise
  expect(dialog.message()).toContain('見つかりません')
  await dialog.dismiss()
})
