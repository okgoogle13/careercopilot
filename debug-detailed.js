const { chromium } = require('@playwright/test');

(async () => {
  console.log('🔍 Detailed Debug - Check what\'s actually happening');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext().then(c => c.newPage());

  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    // Login
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('input[type="email"], input[type="text"]');
    await page.fill('input[type="email"], input[type="text"]', 'demo@careercopilot.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Go to document generation
    await page.goto('http://localhost:5173/document-generation');
    await page.waitForTimeout(5000);

    // Check page content
    const pageText = await page.textContent('body');
    console.log('\n📄 Page contains "Document Generation":', pageText.includes('Document Generation'));
    console.log('📄 Page contains "Template":', pageText.includes('Template') || pageText.includes('template'));
    console.log('📄 Page contains "Login" or "Sign In":', pageText.includes('Login') || pageText.includes('Sign In'));

    // Check for template cards specifically
    const templateCards = await page.locator('.template-card').count();
    const templateItems = await page.locator('.template-item').count();
    const allButtons = await page.locator('button').count();

    console.log(`\n📋 Template elements found:`);
    console.log(`   .template-card: ${templateCards}`);
    console.log(`   .template-item: ${templateItems}`);
    console.log(`   buttons: ${allButtons}`);

    // Check images
    const allImages = await page.locator('img').count();
    console.log(`\n🖼️  Total images on page: ${allImages}`);

    if (allImages > 0) {
      const images = await page.locator('img').all();
      for (let i = 0; i < Math.min(images.length, 3); i++) {
        const src = await images[i].getAttribute('src');
        console.log(`   Image ${i+1}: ${src ? src.substring(0, 60) + '...' : 'no src'}`);
      }
    }

    // If we have template cards, try clicking one
    if (templateCards > 0) {
      console.log('\n🖱️  Attempting to click first template card...');
      await page.locator('.template-card').first().click();
      await page.waitForTimeout(3000);

      // Check for status messages or changes
      const updatedPageText = await page.textContent('body');
      if (updatedPageText !== pageText) {
        console.log('✅ Page content changed after click');
      } else {
        console.log('❌ Page content unchanged after click');
      }
    }

    // Take screenshot and keep browser open for manual inspection
    await page.screenshot({ path: 'detailed-debug.png', fullPage: true });
    console.log('\n📸 Screenshot saved. Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
})();