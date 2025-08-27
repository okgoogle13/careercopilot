const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Simple integration test...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext().then(c => c.newPage());

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.error('❌ Page Error:', error.message);
  });

  try {
    // Navigate to the document generation page directly
    console.log('📍 Navigating to document generation page...');
    await page.goto('http://localhost:5173/document-generation');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check page title or main content
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check if main content is loaded
    const bodyText = await page.locator('body').textContent();
    if (bodyText.includes('TemplateSelector') || bodyText.includes('template') || bodyText.includes('Templates')) {
      console.log('✅ Template-related content found on page');
    } else {
      console.log('❌ No template-related content found');
    }
    
    // Take a screenshot for manual inspection
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as test-screenshot.png');
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser opened for manual inspection. Check the page manually and close the browser when done.');
    console.log('Navigate to: http://localhost:5173/document-generation');
    
    // Wait for manual browser close instead of auto-closing
    await page.waitForTimeout(60000); // Wait 1 minute for manual inspection
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  } finally {
    await browser.close();
  }
})();