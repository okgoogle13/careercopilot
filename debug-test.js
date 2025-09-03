const { chromium } = require('@playwright/test');

(async () => {
  console.log('🔍 Debug Test - Check for JavaScript errors');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext().then(c => c.newPage());

  // Capture all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.name, error.message);
    console.error('Stack:', error.stack);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.error('❌ FAILED REQUEST:', request.url(), request.failure()?.errorText);
  });

  try {
    console.log('📍 Navigating to main page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Wait for React to render
    await page.waitForTimeout(5000);

    console.log('📍 Checking if app loaded...');
    const rootContent = await page.locator('#root').textContent();
    console.log('Root content length:', rootContent?.length || 0);

    if (rootContent && rootContent.trim().length > 0) {
      console.log('✅ React app rendered successfully');

      // Navigate to document generation
      console.log('📍 Navigating to document generation...');
      await page.goto('http://localhost:5173/document-generation', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const docGenContent = await page.textContent('body');
      console.log('Document generation content includes "Document Generation":', docGenContent.includes('Document Generation'));

    } else {
      console.log('❌ React app failed to render - checking for errors above');
    }

    // Keep browser open for manual inspection
    console.log('🔍 Browser opened for manual inspection (will close in 30 seconds)...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Debug test error:', error.message);
  } finally {
    await browser.close();
  }
})();