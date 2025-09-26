import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Tests', () => {
  test('can navigate to external site and verify title', async ({ page }) => {
    // Navigate to a reliable external site for testing
    await page.goto('https://playwright.dev');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the title contains expected text
    await expect(page).toHaveTitle(/Playwright/);

    // Verify some basic elements exist
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('can handle basic browser interactions', async ({ page }) => {
    await page.goto('data:text/html,<html><body><h1>Test Page</h1><button id="testBtn">Click me</button><input id="testInput" placeholder="Type here"></body></html>');

    // Test basic interactions
    await expect(page.locator('h1')).toContainText('Test Page');

    // Test button click
    const button = page.locator('#testBtn');
    await expect(button).toBeVisible();
    await button.click();

    // Test input typing
    const input = page.locator('#testInput');
    await input.fill('Hello Playwright');
    await expect(input).toHaveValue('Hello Playwright');
  });

  test('can take screenshot', async ({ page }) => {
    await page.goto('data:text/html,<html><body><h1 style="color: blue;">Playwright Test</h1></body></html>');

    // Take a screenshot to verify screenshot functionality
    await page.screenshot({ path: 'test-results/basic-screenshot.png' });

    // Verify the page loaded correctly
    await expect(page.locator('h1')).toBeVisible();
  });
});