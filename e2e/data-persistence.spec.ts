import { expect, test } from '@playwright/test'

import { setupTeamApiMock } from './helpers/apiMock'
import { addTenPlayers } from './helpers/playerHelpers'

// E-3: ID保存→読み込みでプレイヤー一覧が復元される（Fast E2E: API モック）
test('ID保存→読み込みでプレイヤー一覧が復元される', async ({ page }) => {
  await setupTeamApiMock(page)

  const testId = `e2e-test-${Date.now()}`

  // プレイヤーを追加して保存
  await page.goto('/')
  await addTenPlayers(page)

  const idForm = page
    .locator('div')
    .filter({ has: page.getByPlaceholder('IDを入力') })
    .first()
  const idInput = page.getByPlaceholder('IDを入力')
  await idInput.fill(testId)
  await idForm.getByRole('button', { name: '保存する' }).click()

  // ページをリロードして読み込み
  await page.goto('/')
  await idInput.fill(testId)
  await idForm.getByRole('button', { name: '読み込む' }).click()

  await expect(
    page.locator('p.font-bold', { hasText: 'Player01' }).first()
  ).toBeVisible({ timeout: 5000 })
})

// E-6: 存在しない ID で読み込んだときエラーが表示される（Fast E2E: API モック）
test('存在しない ID で読み込むとエラーが表示される', async ({ page }) => {
  await setupTeamApiMock(page)

  await page.goto('/')

  const idInput = page.getByPlaceholder('IDを入力')
  const idForm = page.locator('div').filter({ has: idInput }).first()
  await idInput.fill('nonexistent-id-xyz-12345')

  await idForm.getByRole('button', { name: '読み込む' }).click()

  await expect(
    page.getByText('チームデータが見つかりませんでした。')
  ).toBeVisible()
})
