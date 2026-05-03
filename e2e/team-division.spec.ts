import { expect, test } from '@playwright/test'

import { addPlayer, addTenPlayers } from './helpers/playerHelpers'

// E-2: 10人参加状態でチーム分割を実行し、結果が表示される
test('10人いるときチーム分割が実行できる', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: '3. チーム分割' })
  ).toBeVisible()

  await addTenPlayers(page)

  await page.getByRole('button', { name: 'チーム分け' }).click()

  // 分割完了まで待機（最大10秒）
  await expect(page.getByText('青チーム', { exact: true })).toBeVisible({
    timeout: 10000,
  })
  await expect(page.getByText('赤チーム', { exact: true })).toBeVisible({
    timeout: 10000,
  })
})

// E-5: 参加プレイヤーが10人未満のとき分割ボタンが非活性
test('10人未満のときチーム分けボタンが非活性', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByText('分割条件: 参加中プレイヤー 10人', { exact: false })
  ).toBeVisible()

  await addPlayer(page, 'OnlyOnePlayer')

  const divideButton = page.getByRole('button', { name: 'チーム分け' })
  await expect(divideButton).toBeDisabled()
})

test('勝敗確定後に履歴が表示される', async ({ page }) => {
  await page.goto('/')

  await addTenPlayers(page)
  await page.getByRole('button', { name: 'チーム分け' }).click()

  await expect(page.getByText('青チーム', { exact: true })).toBeVisible({
    timeout: 10000,
  })

  await page.getByRole('button', { name: '青チーム勝利' }).click()
  await page.getByRole('button', { name: '結果を確定' }).click()

  await expect(
    page.getByText('試合結果を確定し、履歴に保存しました。')
  ).toBeVisible()
  await expect(page.getByText('試合履歴')).toBeVisible()
  const firstHistoryRow = page.getByTestId('match-history-row').first()
  await expect(firstHistoryRow).toContainText('青チーム勝利')
  await expect(firstHistoryRow).toContainText(/\d{2}:\d{2}:\d{2}/)
  await expect(firstHistoryRow).not.toContainText('ミスマッチ')
  await expect(firstHistoryRow).not.toContainText('勝 5')
  await expect(firstHistoryRow).not.toContainText('敗 5')

  await page.getByRole('button', { name: 'チーム分け' }).click()
  await expect(page.getByText('青チーム', { exact: true })).toBeVisible({
    timeout: 10000,
  })
  await page.getByRole('button', { name: '赤チーム勝利' }).click()
  await page.getByRole('button', { name: '結果を確定' }).click()

  const historyList = page.getByTestId('match-history-list')
  await expect(historyList).toHaveClass(/max-h-80/)
  await expect(historyList).toHaveClass(/overflow-y-auto/)
  await expect(historyList).toHaveClass(/divide-y/)

  const historyRows = page.getByTestId('match-history-row')
  await expect(historyRows).toHaveCount(2)

  await page.getByTestId('match-history-row').first().click()
  const accordion = page.getByTestId('match-history-accordion')
  await expect(page.getByRole('heading', { name: '履歴詳細' })).toBeVisible()
  await expect(accordion.getByText('青チーム', { exact: true })).toBeVisible()
  await expect(accordion.getByText('赤チーム', { exact: true })).toBeVisible()
  await expect(accordion).toContainText(/\d+\s\([+-]\d+\)/)
  await expect(
    accordion.getByRole('button', { name: '履歴を削除' })
  ).toBeVisible()
})

test('履歴削除でアコーディオンが閉じて件数が減る', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })

  await page.goto('/')
  await addTenPlayers(page)
  await page.getByRole('button', { name: 'チーム分け' }).click()
  await expect(page.getByText('青チーム', { exact: true })).toBeVisible({
    timeout: 10000,
  })

  await page.getByRole('button', { name: '青チーム勝利' }).click()
  await page.getByRole('button', { name: '結果を確定' }).click()

  const historyRows = page.getByTestId('match-history-row')
  await expect(historyRows).toHaveCount(1)

  await historyRows.first().click()
  await page.getByRole('button', { name: '履歴を削除' }).click()

  await expect(page.getByTestId('match-history-row')).toHaveCount(0)
  await expect(
    page.getByText(
      'まだ試合履歴はありません。分割結果で勝敗を確定すると履歴が追加されます。'
    )
  ).toBeVisible()
})
