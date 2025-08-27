const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting integration test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console logs and errors
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`❌ ${type.toUpperCase()}: ${msg.text()}`);
    } else {
      console.log(`ℹ️  ${type}: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.error('❌ Page Error:', error.message);
  });

  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('firebase') || request.url().includes('127.0.0.1:8000')) {
      console.log(`🌐 Request: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('firebase') || response.url().includes('127.0.0.1:8000')) {
      console.log(`📥 Response: ${response.status()} ${response.url()}`);
    }
  });

  try {
    // Navigate to the app
    console.log('📍 Navigating to app...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Navigate to document generation page
    console.log('📍 Navigating to document generation page...');
    await page.goto('http://localhost:5173/document-generation');
    await page.waitForTimeout(3000);

    // Check if TemplateSelector is loaded
    console.log('🔍 Checking if TemplateSelector is loaded...');
    const templateSelector = await page.locator('[data-testid="template-selector"], .template-selector, .templates-grid').first();
    
    if (await templateSelector.isVisible({ timeout: 5000 })) {
      console.log('✅ TemplateSelector component is visible');
    } else {
      console.log('❌ TemplateSelector component not found');
    }

    // Check for Firebase images
    console.log('🖼️  Checking for Firebase images...');
    await page.waitForTimeout(3000);
    const images = await page.locator('img').all();
    let firebaseImages = 0;
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && src.includes('firebase')) {
        firebaseImages++;
        console.log(`✅ Firebase image found: ${src.substring(0, 80)}...`);
      }
    }
    
    if (firebaseImages === 0) {
      console.log('⚠️  No Firebase images found');
    } else {
      console.log(`✅ Found ${firebaseImages} Firebase images`);
    }

    // Try to find and click a template
    console.log('🖱️  Testing template selection...');
    const templates = await page.locator('.template-item, [data-testid="template-item"], button').all();
    
    if (templates.length > 0) {
      console.log(`📋 Found ${templates.length} potential template elements`);
      // Click the first template
      await templates[0].click();
      await page.waitForTimeout(2000);
      console.log('✅ Template clicked successfully');
    } else {
      console.log('❌ No template elements found to click');
    }

    // Wait a bit more to see any network calls
    await page.waitForTimeout(3000);
    console.log('🏁 Test completed');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  } finally {
    await browser.close();
  }
})();