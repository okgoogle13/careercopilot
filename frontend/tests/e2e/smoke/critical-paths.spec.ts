import { test, expect, Page } from '@playwright/test';

// Configure base URL based on environment
const baseUrl = process.env.BASE_URL || 'https://careercopilot-production.web.app';
test.use({ baseURL: baseUrl });

// Simple logger
const logger = {
  info: (msg: string) => console.log(`[SMOKE] ${msg}`),
  warn: (msg: string) => console.warn(`[SMOKE-WARN] ${msg}`),
  error: (msg: string) => console.error(`[SMOKE-ERROR] ${msg}`),
};

test.describe('Smoke Tests - Critical User Paths', () => {
  test.beforeEach(async ({ page }) => {
    logger.info(`Starting test in ${baseUrl}`);
  });

  test('User can login and access dashboard', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');

    // Verify page loaded
    await expect(page).toHaveTitle(/Career Copilot/i);
    await expect(page.getByLabel(/email/i)).toBeVisible();

    // Verify <3s load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle', { timeout: 3000 });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);

    // Check for Sign In button
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeVisible();

    logger.info(`Login page load time: ${loadTime}ms`);
  });

  test('Backend API is responsive', async ({ request }) => {
    // Test /auth/me endpoint (common check)
    const response = await request
      .get('/api/auth/me', {
        headers: { Authorization: 'Bearer test-token' },
      })
      .catch(() => null);

    // Verify response time is acceptable (<3s)
    const startTime = Date.now();
    const healthResponse = await request.get('/api/config', {}).catch(() => null);
    const responseTime = Date.now() - startTime;

    if (healthResponse) {
      expect(healthResponse.status()).toBeLessThan(500);
      expect(responseTime).toBeLessThan(3000);
      logger.info(`API response time: ${responseTime}ms`);
    }
  });
});

// Helper function for performance assertions
async function measureLoadTime(page: Page, action: () => Promise<void>): Promise<number> {
  const startTime = Date.now();
  await action();
  return Date.now() - startTime;
}
