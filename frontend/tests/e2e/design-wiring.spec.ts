import { test, expect } from '@playwright/test';

// Mission: Verify Wiring (Data Load) and Design (M3 Specs)
test.describe('Design & Wiring Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Auth by using demo mode which acts as a logged-in state bypass
    // This satisfies "Mock the auth state" while ensuring we can reach the dashboard.
    // We assume the app is running (handled by webServer in config)
    await page.goto('/dashboard?demo=true');
    // Ensure we are on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Test A (Wiring): Dashboard successfully loads data', async ({ page }) => {
    // Wait for the "Active Applications" text to be visible
    const statsLabel = page.getByText('ACTIVE APPLICATIONS');
    await expect(statsLabel).toBeVisible();

    // Find the number associated with it. use .last() to find the innermost container
    const card = page.locator('div').filter({ has: statsLabel }).last();
    const countText = card.locator('p.text-\\[64px\\]');

    await expect(countText).toBeVisible();

    const text = await countText.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
    console.log(`Wiring Check: Found ${text} Active Applications.`);
  });

  test('Test B (Visuals): Theme and Geometry match specs', async ({ page }) => {
    // 1. Verify Background Color: #121212 (Deep Charcoal)
    // The main layout generic background usually applies to body or a main wrapper.
    // In Layout.tsx: <div className="min-h-screen bg-surface relative">
    // In index.css: body { background-color: var(--sys-color-surface); }
    // We can check the body background color.
    const body = page.locator('body');
    // Allow slight variations or verify computed style in test
    // Deep Charcoal #121212 is rgb(18, 18, 18).
    await expect(body).toHaveCSS('background-color', 'rgb(18, 18, 18)');

    // 2. Verify Dashboard Navigation Pill
    // "Select the 'Dashboard' navigation pill."
    // Since we are at /dashboard, the Dashboard link in Sidebar should be active.
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    await expect(dashboardLink).toBeVisible();

    // Debug: Check class list and computed color
    const classList = await dashboardLink.getAttribute('class');
    console.log('Dashboard Link Class:', classList);

    const bgColor = await dashboardLink.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    console.log('Computed Background Color:', bgColor);

    // Verify Primary Accent (Sage Green): #B4D8AE -> rgb(180, 216, 174)
    // The active link has 'bg-primary' class.
    await expect(dashboardLink).toHaveCSS('background-color', 'rgb(180, 216, 174)');

    // 3. Verify Geometry: Pill shape (border-radius >= 20px)
    // We get the computed style for border-radius.
    // "matching a pill shape" usually implies a very large value (like 9999px) or at least 20px.
    const borderRadius = await dashboardLink.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });

    // borderRadius might be "9999px" or "20px" or similar.
    // We allow passing if it parses to >= 20.
    const radiusValue = parseFloat(borderRadius);
    expect(radiusValue).toBeGreaterThanOrEqual(20);
  });
});
