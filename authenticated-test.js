const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Authenticated Integration Test - Login then test templates');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext().then(c => c.newPage());

  // Track network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method()
    });
    
    if (request.url().includes('firebase') || request.url().includes('127.0.0.1:8000')) {
      console.log(`🌐 ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('firebase') || response.url().includes('127.0.0.1:8000')) {
      console.log(`📥 ${response.status()} ${response.url()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ ${msg.text()}`);
    }
  });

  try {
    console.log('\n=== STEP 1: Navigate to app and login ===');
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Wait for login form to appear
    console.log('⏳ Waiting for login form...');
    await page.waitForSelector('input[type="email"], input[type="text"]', { timeout: 10000 });
    
    // Fill login form with demo credentials
    console.log('📝 Filling login form...');
    await page.fill('input[type="email"], input[type="text"]', 'demo@careercopilot.com');
    await page.fill('input[type="password"]', 'demo123');
    
    // Submit login
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    console.log('🔑 Login submitted');
    
    // Wait for redirect to dashboard
    console.log('⏳ Waiting for authentication...');
    await page.waitForTimeout(3000);
    
    // Check if we're logged in by looking for dashboard content
    const pageContent = await page.textContent('body');
    if (pageContent.includes('Dashboard') || pageContent.includes('Document Generation') || !pageContent.includes('Sign In')) {
      console.log('✅ Successfully logged in');
    } else {
      console.log('❌ Login failed or still on login page');
      console.log('Current page content preview:', pageContent.substring(0, 200));
    }
    
    console.log('\n=== STEP 2: Navigate to Document Generation ===');
    await page.goto('http://localhost:5173/document-generation');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const docContent = await page.textContent('body');
    if (docContent.includes('Document Generation')) {
      console.log('✅ Document Generation page loaded');
    } else {
      console.log('❌ Document Generation page not found');
      console.log('Page content preview:', docContent.substring(0, 200));
    }
    
    console.log('\n=== STEP 3: Wait for templates to load ===');
    await page.waitForTimeout(3000);
    
    console.log('\n=== STEP 4: Check for Firebase images ===');
    const images = await page.locator('img').all();
    let firebaseCount = 0;
    let totalImages = images.length;
    
    console.log(`🖼️  Found ${totalImages} images on page`);
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      if (src && src.includes('firebase')) {
        firebaseCount++;
        console.log(`✅ Firebase image: ${alt || 'unnamed'}`);
        console.log(`   ${src.substring(0, 120)}...`);
        
        // Check load status
        try {
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          if (naturalWidth > 0) {
            console.log(`   📐 Loaded successfully (${naturalWidth}px wide)`);
          } else {
            console.log(`   ⏳ Still loading or failed to load`);
          }
        } catch (e) {
          console.log(`   ❌ Error checking image: ${e.message}`);
        }
      } else if (src) {
        console.log(`📷 Other image: ${src.substring(0, 50)}...`);
      }
    }
    
    console.log(`\n📊 Found ${firebaseCount} Firebase images out of ${totalImages} total`);
    
    console.log('\n=== STEP 5: Look for template elements ===');
    const templateElements = await page.locator('.template, .template-item, .template-card, [data-testid*="template"]').all();
    console.log(`📋 Found ${templateElements.length} template elements`);
    
    // Try to find clickable template buttons
    const clickableTemplates = await page.locator('button, [role="button"], .clickable, .template-item, .template-card').all();
    console.log(`🖱️  Found ${clickableTemplates.length} potentially clickable elements`);
    
    if (clickableTemplates.length > 0) {
      console.log('\n=== STEP 6: Test template selection ===');
      try {
        await clickableTemplates[0].click();
        console.log('✅ Clicked first clickable element');
        await page.waitForTimeout(2000);
        
        // Check for any new backend requests
        const newBackendCalls = networkRequests.filter(req => 
          (req.url.includes('127.0.0.1:8000') || req.url.includes('localhost:8000')) &&
          new Date() - req.timestamp < 5000 // last 5 seconds
        );
        console.log(`📡 Backend calls after click: ${newBackendCalls.length}`);
        
      } catch (error) {
        console.log(`❌ Failed to click: ${error.message}`);
      }
    }
    
    console.log('\n=== STEP 7: Final Summary ===');
    const backendCalls = networkRequests.filter(req => 
      req.url.includes('127.0.0.1:8000') || req.url.includes('localhost:8000')
    );
    const firebaseRequests = networkRequests.filter(req => req.url.includes('firebase'));
    
    console.log(`🔗 Total backend API calls: ${backendCalls.length}`);
    console.log(`🔥 Total Firebase requests: ${firebaseRequests.length}`);
    console.log(`🖼️  Firebase images loaded: ${firebaseCount}`);
    console.log(`📋 Template elements found: ${templateElements.length}`);
    
    // Take screenshot
    await page.screenshot({ path: 'authenticated-test-result.png', fullPage: true });
    console.log('📸 Screenshot saved as authenticated-test-result.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'authenticated-test-error.png' });
  } finally {
    await browser.close();
  }
})();