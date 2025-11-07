const { test, expect } = require('@playwright/test');

test('Dashboard Page should load correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Welcome back, user!')).toBeVisible(); // Example text
});
