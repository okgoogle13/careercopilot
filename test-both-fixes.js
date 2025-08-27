const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Testing Both Fixes - Images & Backend Integration');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext().then(c => c.newPage());

  // Track network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      timestamp: new Date()
    });
    
    if (request.url().includes('127.0.0.1:8000') || request.url().includes('picsum.photos')) {
      console.log(`🌐 ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('127.0.0.1:8000') || response.url().includes('picsum.photos')) {
      console.log(`📥 ${response.status()} ${response.url()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'log' && (msg.text().includes('✅') || msg.text().includes('Template selection'))) {
      console.log(`📱 ${msg.text()}`);
    } else if (msg.type() === 'error') {
      console.log(`❌ ${msg.text()}`);
    }
  });

  try {
    console.log('\n=== STEP 1: Login ===');
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('input[type="email"], input[type="text"]', { timeout: 10000 });
    await page.fill('input[type="email"], input[type="text"]', 'demo@careercopilot.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await page.waitForTimeout(2000);
    console.log('✅ Logged in');

    console.log('\n=== STEP 2: Navigate to Document Generation ===');
    await page.goto('http://localhost:5173/document-generation');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for templates to load
    console.log('✅ Navigated to document generation page');

    console.log('\n=== STEP 3: Check Image Loading (Fix #1) ===');
    const images = await page.locator('img').all();
    let loadedImages = 0;
    let picsumImages = 0;
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && src.includes('picsum.photos')) {
        picsumImages++;
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        if (naturalWidth > 0) {
          loadedImages++;
          console.log(`✅ Image loaded: ${src.substring(0, 50)}... (${naturalWidth}px wide)`);
        } else {
          console.log(`⏳ Image still loading: ${src.substring(0, 50)}...`);
        }
      }
    }
    
    console.log(`📊 Image Status: ${loadedImages}/${picsumImages} Picsum images loaded`);
    
    console.log('\n=== STEP 4: Test Template Selection (Fix #2) ===');
    const templateCards = await page.locator('.template-card, .template-item, button').all();
    console.log(`🔍 Found ${templateCards.length} potential template elements`);
    
    if (templateCards.length > 0) {
      console.log('🖱️  Clicking first template...');
      await templateCards[0].click();
      
      // Wait for backend calls and UI updates
      await page.waitForTimeout(5000);
      
      // Check for backend API calls
      const backendCalls = networkRequests.filter(req => 
        req.url.includes('127.0.0.1:8000') && 
        req.timestamp > new Date(Date.now() - 10000) // Last 10 seconds
      );
      
      console.log(`🔗 Backend calls made: ${backendCalls.length}`);
      backendCalls.forEach(call => {
        console.log(`   ${call.method} ${call.url}`);
      });
      
      // Check for status messages
      const statusElements = await page.locator('text=Contacting backend, text=generating, text=successfully, text=Error').all();
      if (statusElements.length > 0) {
        const statusText = await statusElements[0].textContent();
        console.log(`📱 Status message: ${statusText}`);
      }
      
      // Check for document preview
      const previewElements = await page.locator('text=Preview:, [data-testid="document-preview"], .document-preview').all();
      if (previewElements.length > 0) {
        console.log('✅ Document preview appeared');
      } else {
        console.log('❌ No document preview found');
      }
      
    } else {
      console.log('❌ No template elements found to click');
    }

    console.log('\n=== STEP 5: Final Summary ===');
    const totalBackendCalls = networkRequests.filter(req => req.url.includes('127.0.0.1:8000')).length;
    const totalImageRequests = networkRequests.filter(req => req.url.includes('picsum.photos')).length;
    
    console.log(`📊 RESULTS:`);
    console.log(`   🖼️  Images loaded: ${loadedImages}/${picsumImages} template images`);
    console.log(`   🔗 Backend calls: ${totalBackendCalls} total API requests`);
    console.log(`   📥 Image requests: ${totalImageRequests} image requests`);
    
    console.log('\n✅ FIX #1 (Images): ' + (loadedImages > 0 ? 'WORKING' : 'FAILED'));
    console.log('✅ FIX #2 (Backend): ' + (totalBackendCalls > 0 ? 'WORKING' : 'FAILED'));
    
    // Take final screenshot
    await page.screenshot({ path: 'both-fixes-test-result.png', fullPage: true });
    console.log('📸 Screenshot saved as both-fixes-test-result.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();