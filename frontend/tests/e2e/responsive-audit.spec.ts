import { test, expect } from '@playwright/test';

/**
 * Responsive Design Audit: M3 [DEPRECATED_STYLE] Shapes
 *
 * Tests the responsive behavior of M3 [DEPRECATED_STYLE] border-radius shapes
 * across mobile (iPhone 14) and tablet (iPad Pro) viewports.
 *
 * Checks for:
 * - Overflow issues
 * - Awkward border radius scaling
 * - Touch target sizing
 * - Text wrapping
 */

const VIEWPORTS = {
  desktop: { width: 1280, height: 720, name: 'Desktop' },
  iphone14: { width: 390, height: 844, name: 'iPhone 14' },
  ipadPro: { width: 1024, height: 1366, name: 'iPad Pro' },
};

test.describe('Responsive M3 Design Audit', () => {
  test.use({ storageState: undefined });

  for (const [key, viewport] of Object.entries(VIEWPORTS)) {
    test(`${viewport.name} (${viewport.width}x${viewport.height}) - M3 Shapes Audit`, async ({
      page,
    }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      console.log(`\n🎨 Testing ${viewport.name} viewport...`);

      // Step 1: Login Page
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `test-results/responsive-${key}-01-login.png`,
        fullPage: true,
      });

      // Check login card border radius
      const loginCard = page.locator('div.rounded-tech, div.rounded-pebble').first();
      if (await loginCard.isVisible()) {
        const cardStyles = await loginCard.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            borderRadius: computed.borderRadius,
            padding: computed.padding,
            width: computed.width,
            overflow: computed.overflow,
          };
        });

        console.log(`📱 ${viewport.name} - Login Card Styles:`, cardStyles);

        // Check for overflow
        const hasOverflow = await loginCard.evaluate((el) => {
          return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        });

        if (hasOverflow) {
          console.log(`⚠️ ${viewport.name} - OVERFLOW DETECTED on login card`);
        }
      }

      // Check guest button
      const guestButton = page.locator(':has-text("Explore as Guest")').first();
      if (await guestButton.isVisible()) {
        const buttonStyles = await guestButton.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            borderRadius: computed.borderRadius,
            height: computed.height,
            touchTargetSize: `${rect.width}x${rect.height}`,
            fontSize: computed.fontSize,
          };
        });

        console.log(`📱 ${viewport.name} - Guest Button:`, buttonStyles);

        // Check touch target size (should be at least 44x44 for mobile)
        const rect = await guestButton.boundingBox();
        if (rect && (rect.width < 44 || rect.height < 44) && viewport.width < 768) {
          console.log(`⚠️ ${viewport.name} - Touch target too small: ${rect.width}x${rect.height}`);
        }
      }

      // Step 2: Click guest button and go to Opportunities
      await guestButton.click();
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `test-results/responsive-${key}-02-dashboard.png`,
        fullPage: true,
      });

      // Navigate to Opportunities
      await page.goto('http://localhost:5173/opportunities?demo=true');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `test-results/responsive-${key}-03-opportunities.png`,
        fullPage: true,
      });

      // Check job cards if any exist (may need to trigger search first)
      const jobCards = page.locator('div.rounded-pebble, div.rounded-leaf');
      const cardCount = await jobCards.count();

      console.log(`📱 ${viewport.name} - Found ${cardCount} cards with [DEPRECATED_STYLE] shapes`);

      if (cardCount > 0) {
        // Check first card
        const firstCard = jobCards.first();
        const cardStyles = await firstCard.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            borderRadius: computed.borderRadius,
            borderTopLeftRadius: computed.borderTopLeftRadius,
            borderTopRightRadius: computed.borderTopRightRadius,
            borderBottomLeftRadius: computed.borderBottomLeftRadius,
            borderBottomRightRadius: computed.borderBottomRightRadius,
            padding: computed.padding,
            width: computed.width,
            maxWidth: computed.maxWidth,
          };
        });

        console.log(`📱 ${viewport.name} - Card [DEPRECATED_STYLE] Shape:`, cardStyles);

        // Check if border radius values are too large for small screens
        const radii = [
          cardStyles.borderTopLeftRadius,
          cardStyles.borderTopRightRadius,
          cardStyles.borderBottomLeftRadius,
          cardStyles.borderBottomRightRadius,
        ].map((r) => parseFloat(r));

        const maxRadius = Math.max(...radii);
        const cardWidth = parseFloat(cardStyles.width);

        if (maxRadius > cardWidth * 0.15) {
          console.log(
            `⚠️ ${viewport.name} - Border radius (${maxRadius}px) may be too large for card width (${cardWidth}px)`
          );
        }
      }

      // Check search input responsiveness
      const searchInput = page.locator('input[type="search"]').first();
      if (await searchInput.isVisible()) {
        const inputStyles = await searchInput.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            width: computed.width,
            fontSize: computed.fontSize,
            padding: computed.padding,
            borderRadius: computed.borderRadius,
          };
        });

        console.log(`📱 ${viewport.name} - Search Input:`, inputStyles);

        // Test typing to ensure no overflow
        await searchInput.fill('Software Engineer Test');
        const hasInputOverflow = await searchInput.evaluate((el: HTMLInputElement) => {
          return el.scrollWidth > el.clientWidth;
        });

        if (hasInputOverflow) {
          console.log(`⚠️ ${viewport.name} - Input text overflow detected`);
        }

        await searchInput.clear();
      }

      // Summary for this viewport
      console.log(`✅ ${viewport.name} audit complete\n`);
    });
  }

  test('Generate Responsive Audit Report', async ({ page }) => {
    // This test just generates a summary report
    console.log('\n📊 Responsive Audit Summary\n');
    console.log('Check test-results/ for screenshots:');
    console.log('- responsive-desktop-*.png');
    console.log('- responsive-iphone14-*.png');
    console.log('- responsive-ipadPro-*.png');
    console.log('\nReview console output above for specific issues and recommendations.');
  });
});
