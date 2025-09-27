import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.js$/,
  timeout: 30000,
  retries: 0,
  use: {
    // baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer: {
  //   command: 'npm run dev',
  //   port: 5173,
  //   reuseExistingServer: !process.env.CI,
  // },
  reporter: [['list'], ['html', { outputFolder: 'test-results/e2e-report' }]],
});
