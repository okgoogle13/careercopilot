import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('Debug Console Logs', async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(5000); // Wait for potential hydration errors

    // Also dump body HTML
    const content = await page.content();
    console.log('PAGE CONTENT:', content.substring(0, 500) + '...');
});
