const { test, expect } = require('@playwright/test');

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the settings API endpoint
    await page.route('/api/user/settings', async (route) => {
      const json = {
        userId: 'user-123',
        email: 'test@example.com',
        theme: 'dark',
        notifications: { newOpportunities: true, analysisComplete: false },
      };
      await route.fulfill({ json });
    });
    await page.goto('/settings');
  });

  test('should display user settings correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Theme')).toHaveValue('dark');
    await expect(page.getByLabel('New Opportunity Notifications')).toBeChecked();
    await expect(page.getByLabel('Analysis Complete Notifications')).not.toBeChecked();
  });
});
