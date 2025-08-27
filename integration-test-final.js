const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Final Integration Test - Firebase Images & Backend Calls');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext().then(c => c.newPage());

  // Track all network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      type: request.resourceType()
    });
    
    if (request.url().includes('firebase') || request.url().includes('127.0.0.1:8000') || request.url().includes('localhost:8000')) {
      console.log(`🌐 REQUEST: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('firebase') || response.url().includes('127.0.0.1:8000') || response.url().includes('localhost:8000')) {
      console.log(`📥 RESPONSE: ${response.status()} ${response.url()}`);
    }
  });

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ CONSOLE ERROR: ${msg.text()}`);
    } else if (msg.type() === 'warn') {
      console.log(`⚠️  CONSOLE WARNING: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });

  try {
    console.log('\n=== STEP 1: Navigate to Document Generation Page ===');
    await page.goto('http://localhost:5173/document-generation');
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== STEP 2: Check if page loaded successfully ===');
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Check if TemplateSelector content appears
    const pageContent = await page.textContent('body');
    if (pageContent.includes('Document Generation')) {
      console.log('✅ Document Generation page loaded');
    } else {
      console.log('❌ Document Generation page not found');
    }

    console.log('\n=== STEP 3: Wait for templates to load ===');
    await page.waitForTimeout(3000); // Wait for templates to load
    
    console.log('\n=== STEP 4: Check for template elements ===');
    const templates = await page.locator('.template-item, .template-card, [data-testid*="template"], img[src*="firebase"]').all();
    console.log(`📋 Found ${templates.length} template-related elements`);

    console.log('\n=== STEP 5: Check for Firebase images ===');
    const images = await page.locator('img').all();
    let firebaseImageCount = 0;
    let totalImages = 0;
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      totalImages++;
      
      if (src && src.includes('firebase')) {
        firebaseImageCount++;
        console.log(`✅ Firebase image found: ${alt || 'unnamed'} - ${src.substring(0, 100)}...`);
        
        // Check if image loads successfully
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        const naturalHeight = await img.evaluate(el => el.naturalHeight);
        
        if (naturalWidth > 0 && naturalHeight > 0) {
          console.log(`  📐 Image dimensions: ${naturalWidth}x${naturalHeight} - LOADED`);
        } else {
          console.log(`  ❌ Image failed to load or still loading`);
        }
      } else if (src) {
        console.log(`📷 Non-firebase image: ${src.substring(0, 60)}...`);
      }
    }
    
    console.log(`\n📊 Image Summary: ${firebaseImageCount} Firebase images out of ${totalImages} total images`);

    console.log('\n=== STEP 6: Test template selection ===');
    // Try to find and click a template
    const templateCards = await page.locator('.template-item, .template-card, button:has-text("Template"), [role="button"]').all();
    
    if (templateCards.length > 0) {
      console.log(`🖱️  Found ${templateCards.length} clickable template elements`);
      try {
        await templateCards[0].click();
        console.log('✅ Clicked first template');
        await page.waitForTimeout(2000); // Wait for any backend calls
      } catch (error) {
        console.log(`❌ Failed to click template: ${error.message}`);
      }
    } else {
      console.log('❌ No clickable template elements found');
    }

    console.log('\n=== STEP 7: Check backend API calls ===');
    const backendCalls = networkRequests.filter(req => 
      req.url.includes('127.0.0.1:8000') || req.url.includes('localhost:8000')
    );
    
    console.log(`🔗 Backend API calls made: ${backendCalls.length}`);
    backendCalls.forEach(call => {
      console.log(`  ${call.method} ${call.url}`);
    });

    console.log('\n=== STEP 8: Final checks ===');
    const firebaseRequests = networkRequests.filter(req => req.url.includes('firebase'));
    console.log(`🔥 Firebase requests made: ${firebaseRequests.length}`);
    
    // Take a screenshot for manual review
    await page.screenshot({ path: 'final-integration-test.png', fullPage: true });
    console.log('📸 Screenshot saved as final-integration-test.png');

    console.log('\n🏁 TEST RESULTS SUMMARY:');
    console.log(`✅ Page loaded: ${pageContent.includes('Document Generation')}`);
    console.log(`✅ Templates found: ${templates.length > 0}`);
    console.log(`✅ Firebase images: ${firebaseImageCount}`);
    console.log(`✅ Backend calls: ${backendCalls.length}`);
    console.log(`✅ Firebase requests: ${firebaseRequests.length}`);

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
  }
})();