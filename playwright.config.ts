import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // E2E_USE_REAL_REDIS=true のとき @integration テストのみ実行し、
  // false（デフォルト）のとき @integration タグを除外して実行する。
  // これにより --grep フラグをスクリプトに書かずに制御できる。
  grep:
    process.env.E2E_USE_REAL_REDIS === 'true'
      ? /@integration/
      : /^(?!.*@integration)/,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
