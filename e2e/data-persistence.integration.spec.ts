import { expect, test } from '@playwright/test'

import { addTenPlayers } from './helpers/playerHelpers'

const ensureIntegrationEnv = (): void => {
  if (process.env.E2E_USE_REAL_REDIS !== 'true') {
    throw new Error(
      'E2E_USE_REAL_REDIS=true を設定して integration テストを実行してください。'
    )
  }

  if (!process.env.REDIS_URL) {
    throw new Error(
      'REDIS_URL が未設定です。integration テストは REDIS_URL を設定して実行してください。'
    )
  }
}

// E-3: ID保存→読み込みでプレイヤー一覧が復元される（Integration: 実Redis）
test('@integration ID保存→読み込みでプレイヤー一覧が復元される', async ({
  page,
}) => {
  ensureIntegrationEnv()

  const testId = `e2e-integration-${Date.now()}`

  await page.goto('/')
  await addTenPlayers(page)

  const idInput = page.getByPlaceholder('IDを入力')
  await idInput.fill(testId)
  await page.getByRole('button', { name: '保存する' }).click()

  await page.goto('/')
  await idInput.fill(testId)
  await page.getByRole('button', { name: '読み込む' }).first().click()

  await expect(page.getByText('Player01')).toBeVisible({ timeout: 5000 })
})

// E-6: 存在しない ID で読み込んだときエラーが表示される（Integration: 実Redis）
test('@integration 存在しない ID で読み込むとエラーが表示される', async ({
  page,
}) => {
  ensureIntegrationEnv()

  await page.goto('/')

  const idInput = page.getByPlaceholder('IDを入力')
  await idInput.fill('nonexistent-id-xyz-12345')

  await page.getByRole('button', { name: '読み込む' }).first().click()
  await expect(
    page.getByText('チームデータが見つかりませんでした。')
  ).toBeVisible()
})
