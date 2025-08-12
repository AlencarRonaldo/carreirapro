const { chromium } = require('playwright');

async function runUXTests() {
  console.log('🚀 Starting Carreira Pro UX Analysis...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'] 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();
  const results = {};

  try {
    // Test 1: Basic Homepage Loading
    console.log('📍 Test 1: Homepage Loading');
    const startTime = Date.now();
    
    await page.goto('http://localhost:55310', { 
      waitUntil: 'domcontentloaded',
      timeout: 20000 
    });

    const loadTime = Date.now() - startTime;
    const title = await page.title();
    
    console.log(`✅ Page loaded in ${loadTime}ms`);
    console.log(`📄 Title: ${title}`);
    
    await page.screenshot({ path: 'homepage-test.png', fullPage: true });

    // Basic page elements check
    const hasHeader = await page.locator('header, [role="banner"], nav').count();
    const hasMain = await page.locator('main, [role="main"], .main-content').count();
    const hasFooter = await page.locator('footer, [role="contentinfo"]').count();

    console.log(`🏗️  Structure: Header(${hasHeader}) Main(${hasMain}) Footer(${hasFooter})`);

    results.homepage = {
      loadTime,
      title,
      hasHeader: hasHeader > 0,
      hasMain: hasMain > 0,
      hasFooter: hasFooter > 0
    };

    // Test 2: Navigation Elements
    console.log('\n🧭 Test 2: Navigation Analysis');
    
    const navLinks = await page.evaluate(() => {
      const links = [];
      const elements = document.querySelectorAll('a, button');
      elements.forEach(el => {
        if (el.textContent.trim() && el.offsetParent !== null) {
          links.push({
            text: el.textContent.trim(),
            tag: el.tagName,
            href: el.href || el.getAttribute('href') || '',
            visible: true
          });
        }
      });
      return links.slice(0, 20); // First 20 elements
    });

    console.log(`🔗 Found ${navLinks.length} interactive elements:`);
    navLinks.forEach(link => {
      console.log(`  ${link.tag}: "${link.text}" ${link.href ? '→ ' + link.href : ''}`);
    });

    results.navigation = { links: navLinks };

    // Test 3: Mobile Responsiveness
    console.log('\n📱 Test 3: Mobile Responsiveness');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Check for horizontal scroll
    const horizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    // Look for mobile menu
    const mobileMenus = await page.evaluate(() => {
      const selectors = ['.hamburger', '.mobile-menu', '[aria-label*="menu"]', '.menu-toggle', 'button[aria-expanded]'];
      return selectors.some(selector => {
        const element = document.querySelector(selector);
        return element && element.offsetParent !== null;
      });
    });

    console.log(`📱 Mobile Analysis:`);
    console.log(`  Horizontal Scroll: ${horizontalScroll ? '❌ Yes (bad)' : '✅ No (good)'}`);
    console.log(`  Mobile Menu: ${mobileMenus ? '✅ Found' : '❌ Missing'}`);

    await page.screenshot({ path: 'mobile-test.png', fullPage: true });

    results.mobile = {
      horizontalScroll,
      hasMobileMenu: mobileMenus
    };

    // Test 4: Form Elements & Accessibility
    console.log('\n♿ Test 4: Basic Accessibility Check');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:55310', { waitUntil: 'domcontentloaded' });

    const accessibilityInfo = await page.evaluate(() => {
      const issues = [];
      const stats = {};

      // Count images and check alt text
      const images = document.querySelectorAll('img');
      stats.images = images.length;
      let imagesWithoutAlt = 0;
      
      images.forEach(img => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          imagesWithoutAlt++;
        }
      });

      if (imagesWithoutAlt > 0) {
        issues.push(`${imagesWithoutAlt} images missing alt text`);
      }

      // Check form controls
      const formControls = document.querySelectorAll('input, select, textarea');
      stats.formControls = formControls.length;
      let controlsWithoutLabels = 0;

      formControls.forEach(control => {
        const hasLabel = control.labels?.length > 0 || 
                        control.getAttribute('aria-label') || 
                        control.getAttribute('aria-labelledby');
        if (!hasLabel) {
          controlsWithoutLabels++;
        }
      });

      if (controlsWithoutLabels > 0) {
        issues.push(`${controlsWithoutLabels} form controls missing labels`);
      }

      // Check headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      stats.headings = headings.length;
      
      if (headings.length === 0) {
        issues.push('No heading elements found');
      } else if (!document.querySelector('h1')) {
        issues.push('No h1 element found');
      }

      return { issues, stats };
    });

    console.log(`🔍 Accessibility Status:`);
    console.log(`  Images: ${accessibilityInfo.stats.images} total`);
    console.log(`  Form Controls: ${accessibilityInfo.stats.formControls} total`);
    console.log(`  Headings: ${accessibilityInfo.stats.headings} total`);

    if (accessibilityInfo.issues.length > 0) {
      console.log(`⚠️  Issues Found:`);
      accessibilityInfo.issues.forEach(issue => console.log(`    • ${issue}`));
    } else {
      console.log(`✅ No major accessibility issues detected`);
    }

    results.accessibility = accessibilityInfo;

    // Test 5: Performance Metrics
    console.log('\n⚡ Test 5: Performance Check');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (!navigation) return {};
      
      return {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.navigationStart),
        firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
        firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0)
      };
    });

    console.log(`📊 Performance Metrics:`);
    console.log(`  DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`  Load Complete: ${performanceMetrics.loadComplete}ms`);
    console.log(`  First Paint: ${performanceMetrics.firstPaint}ms`);
    console.log(`  First Contentful Paint: ${performanceMetrics.firstContentfulPaint}ms`);

    // Basic performance assessment
    const isDomFast = performanceMetrics.domContentLoaded < 3000;
    const isLoadFast = performanceMetrics.loadComplete < 5000;
    
    console.log(`📈 Performance Assessment:`);
    console.log(`  DOM Loading: ${isDomFast ? '✅ Good' : '⚠️ Could be better'} (${performanceMetrics.domContentLoaded}ms)`);
    console.log(`  Full Loading: ${isLoadFast ? '✅ Good' : '⚠️ Could be better'} (${performanceMetrics.loadComplete}ms)`);

    results.performance = {
      ...performanceMetrics,
      isDomFast,
      isLoadFast
    };

    // Test 6: Check for broken elements/errors
    console.log('\n🔧 Test 6: Error Detection');
    
    // Get console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Check for 404 images
    const broken404s = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.complete || img.naturalWidth === 0).length;
    });

    console.log(`🚨 Error Check:`);
    console.log(`  Console Errors: ${consoleErrors.length}`);
    console.log(`  Broken Images: ${broken404s}`);

    if (consoleErrors.length > 0) {
      console.log(`  Recent Console Errors:`);
      consoleErrors.slice(0, 3).forEach(error => console.log(`    • ${error}`));
    }

    results.errors = {
      consoleErrors: consoleErrors.length,
      brokenImages: broken404s
    };

    console.log('\n✅ UX Analysis Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    results.error = error.message;
  } finally {
    await browser.close();
  }

  return results;
}

// Run the analysis
runUXTests().then(results => {
  console.log('\n📋 ANALYSIS SUMMARY:');
  console.log('='.repeat(50));
  console.log(JSON.stringify(results, null, 2));
}).catch(error => {
  console.error('Analysis failed:', error);
});