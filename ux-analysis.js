const { chromium } = require('playwright');

async function analyzeCarreiraPro() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  const page = await context.newPage();
  const results = {};

  console.log('🚀 Starting Carreira Pro UX Analysis...\n');

  try {
    // Test 1: Homepage Navigation and User Flows
    console.log('📍 Test 1: Homepage Navigation and User Flows');
    await page.goto('http://localhost:55310', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Capture basic page info
    const title = await page.title();
    const url = page.url();
    console.log(`✅ Page loaded: ${title}`);
    console.log(`📍 Current URL: ${url}`);

    // Take homepage screenshot
    await page.screenshot({ path: 'homepage-desktop.png', fullPage: true });

    // Analyze navigation elements
    const navigationElements = await page.evaluate(() => {
      const navElements = [];
      
      // Find navigation links and buttons
      const selectors = ['nav a', 'header a', '[role="navigation"] a', 'button', '.nav-link'];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(elem => {
          if (elem.textContent.trim()) {
            navElements.push({
              text: elem.textContent.trim(),
              href: elem.href || elem.getAttribute('href') || '',
              tagName: elem.tagName,
              visible: elem.offsetParent !== null,
              className: elem.className
            });
          }
        });
      });
      
      return navElements;
    });

    console.log(`🧭 Found ${navigationElements.length} navigation elements:`);
    navigationElements.slice(0, 15).forEach(elem => {
      const status = elem.visible ? '✅' : '❌';
      console.log(`  ${status} ${elem.tagName}: "${elem.text}" ${elem.href ? '→ ' + elem.href : ''}`);
    });

    // Test navigation clicks
    const mainNavLinks = ['Login', 'Documentos', 'Vagas', 'Perfil', 'Planos'];
    const navigationResults = {};
    
    for (const linkText of mainNavLinks) {
      try {
        const linkElement = await page.getByText(linkText, { exact: false }).first();
        if (await linkElement.isVisible()) {
          console.log(`🔗 Testing navigation to: ${linkText}`);
          await linkElement.click();
          await page.waitForLoadState('networkidle', { timeout: 5000 });
          const currentUrl = page.url();
          navigationResults[linkText] = {
            accessible: true,
            url: currentUrl,
            loaded: !currentUrl.includes('error')
          };
          console.log(`  ✅ ${linkText} → ${currentUrl}`);
          
          // Go back to home for next test
          await page.goto('http://localhost:55310', { waitUntil: 'networkidle' });
        }
      } catch (error) {
        navigationResults[linkText] = {
          accessible: false,
          error: error.message
        };
        console.log(`  ❌ ${linkText} failed: ${error.message}`);
      }
    }

    results.navigation = {
      elements: navigationElements,
      mainNavResults: navigationResults
    };

  } catch (error) {
    console.log(`❌ Homepage test failed: ${error.message}`);
    results.navigation = { error: error.message };
  }

  // Test 2: Mobile Responsiveness
  console.log('\n📱 Test 2: Mobile Responsiveness');
  
  try {
    const mobileViewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Galaxy S21', width: 360, height: 800 }
    ];

    const mobileResults = {};

    for (const viewport of mobileViewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:55310', { waitUntil: 'networkidle' });
      
      // Check for mobile menu
      const hasMobileMenu = await page.evaluate(() => {
        // Look for common mobile menu patterns
        const mobileMenuSelectors = [
          '.hamburger', '.mobile-menu', '[aria-label*="menu"]', 
          'button[aria-expanded]', '.menu-toggle', '.navbar-toggler'
        ];
        
        return mobileMenuSelectors.some(selector => 
          document.querySelector(selector) && 
          document.querySelector(selector).offsetParent !== null
        );
      });

      // Check for horizontal scrolling
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Test touch interactions
      let touchTestResult = false;
      try {
        const firstButton = await page.locator('button, a').first();
        if (await firstButton.isVisible()) {
          await firstButton.tap();
          touchTestResult = true;
        }
      } catch (error) {
        console.log(`  ⚠️ Touch interaction failed: ${error.message}`);
      }

      await page.screenshot({ path: `mobile-${viewport.name.toLowerCase().replace(' ', '-')}.png` });

      mobileResults[viewport.name] = {
        viewport,
        hasMobileMenu,
        hasHorizontalScroll: hasHorizontalScroll ? '❌ Yes' : '✅ No',
        touchInteractions: touchTestResult ? '✅ Working' : '❌ Issues',
      };

      console.log(`  Mobile Menu: ${hasMobileMenu ? '✅ Found' : '❌ Missing'}`);
      console.log(`  Horizontal Scroll: ${hasHorizontalScroll ? '❌ Yes' : '✅ No'}`);
      console.log(`  Touch Interactions: ${touchTestResult ? '✅ Working' : '❌ Issues'}`);
    }

    results.mobile = mobileResults;

  } catch (error) {
    console.log(`❌ Mobile test failed: ${error.message}`);
    results.mobile = { error: error.message };
  }

  // Test 3: Theme Toggle Functionality
  console.log('\n🎨 Test 3: Theme Toggle Functionality');
  
  try {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:55310', { waitUntil: 'networkidle' });

    // Look for theme toggle button
    const themeToggleSelectors = [
      '[data-theme]', '.theme-toggle', '[aria-label*="theme"]',
      'button[title*="theme"]', '.dark-mode-toggle', 'button[class*="theme"]'
    ];

    let themeToggleFound = false;
    let themeToggleTest = { found: false, functional: false };

    for (const selector of themeToggleSelectors) {
      const toggleElement = page.locator(selector).first();
      if (await toggleElement.count() > 0 && await toggleElement.isVisible()) {
        console.log(`🔘 Found theme toggle: ${selector}`);
        themeToggleFound = true;
        
        try {
          // Get initial theme state
          const initialTheme = await page.evaluate(() => {
            return {
              bodyClass: document.body.className,
              htmlClass: document.documentElement.className,
              dataTheme: document.documentElement.getAttribute('data-theme')
            };
          });

          // Click the toggle
          await toggleElement.click();
          await page.waitForTimeout(500); // Wait for theme transition

          // Get new theme state
          const newTheme = await page.evaluate(() => {
            return {
              bodyClass: document.body.className,
              htmlClass: document.documentElement.className,
              dataTheme: document.documentElement.getAttribute('data-theme')
            };
          });

          // Check if theme changed
          const themeChanged = 
            initialTheme.bodyClass !== newTheme.bodyClass ||
            initialTheme.htmlClass !== newTheme.htmlClass ||
            initialTheme.dataTheme !== newTheme.dataTheme;

          themeToggleTest = {
            found: true,
            functional: themeChanged,
            initialTheme,
            newTheme
          };

          console.log(`  Theme Change: ${themeChanged ? '✅ Working' : '❌ Not working'}`);
          if (themeChanged) {
            console.log(`  Initial: ${JSON.stringify(initialTheme)}`);
            console.log(`  After toggle: ${JSON.stringify(newTheme)}`);
          }
        } catch (error) {
          console.log(`  ❌ Theme toggle test failed: ${error.message}`);
        }
        break;
      }
    }

    if (!themeToggleFound) {
      console.log('❌ No theme toggle button found');
    }

    results.themeToggle = themeToggleTest;

  } catch (error) {
    console.log(`❌ Theme toggle test failed: ${error.message}`);
    results.themeToggle = { error: error.message };
  }

  // Test 4: Performance Metrics (Core Web Vitals)
  console.log('\n⚡ Test 4: Performance Metrics (Core Web Vitals)');
  
  try {
    await page.goto('http://localhost:55310', { waitUntil: 'networkidle' });

    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          vitals.cls = clsScore;
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay is harder to measure programmatically
        // Get basic performance metrics instead
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          vitals.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
          vitals.loadComplete = navigation.loadEventEnd - navigation.navigationStart;
          vitals.firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
          vitals.firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
          resolve(vitals);
        }, 3000);
      });
    });

    console.log('📊 Performance Metrics:');
    console.log(`  🎨 First Paint: ${metrics.firstPaint?.toFixed(2)}ms`);
    console.log(`  🖼️  First Contentful Paint: ${metrics.firstContentfulPaint?.toFixed(2)}ms`);
    console.log(`  📄 DOM Content Loaded: ${metrics.domContentLoaded?.toFixed(2)}ms`);
    console.log(`  ✅ Load Complete: ${metrics.loadComplete?.toFixed(2)}ms`);
    console.log(`  🖼️  LCP: ${metrics.lcp?.toFixed(2)}ms ${metrics.lcp > 2500 ? '❌ Poor' : metrics.lcp > 1500 ? '⚠️ Needs Improvement' : '✅ Good'}`);
    console.log(`  📏 CLS: ${metrics.cls?.toFixed(4)} ${metrics.cls > 0.25 ? '❌ Poor' : metrics.cls > 0.1 ? '⚠️ Needs Improvement' : '✅ Good'}`);

    results.performance = metrics;

  } catch (error) {
    console.log(`❌ Performance test failed: ${error.message}`);
    results.performance = { error: error.message };
  }

  // Test 5: Accessibility Check
  console.log('\n♿ Test 5: Accessibility Analysis');
  
  try {
    await page.goto('http://localhost:55310', { waitUntil: 'networkidle' });

    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for missing alt text on images
      document.querySelectorAll('img').forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push(`Image ${index + 1} missing alt text`);
        }
      });

      // Check for form labels
      document.querySelectorAll('input, select, textarea').forEach((input, index) => {
        const hasLabel = input.labels?.length > 0 || 
                        input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby');
        if (!hasLabel) {
          issues.push(`Form control ${index + 1} (${input.type || input.tagName}) missing label`);
        }
      });

      // Check for heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        if (index === 0 && level !== 1) {
          issues.push('First heading is not h1');
        }
        if (level > lastLevel + 1) {
          issues.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
        }
        lastLevel = level;
      });

      // Check for keyboard focusable elements
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Check for proper focus indicators
      const elementsWithoutFocusStyle = Array.from(focusableElements).filter(elem => {
        const styles = getComputedStyle(elem);
        return !styles.outline && !styles.boxShadow && !styles.border.includes('blue');
      });

      if (elementsWithoutFocusStyle.length > 0) {
        issues.push(`${elementsWithoutFocusStyle.length} focusable elements may lack focus indicators`);
      }

      return {
        issues,
        stats: {
          images: document.querySelectorAll('img').length,
          formControls: document.querySelectorAll('input, select, textarea').length,
          headings: headings.length,
          focusableElements: focusableElements.length
        }
      };
    });

    console.log(`🔍 Accessibility Analysis:`);
    console.log(`  📊 Images: ${accessibilityIssues.stats.images}`);
    console.log(`  📝 Form Controls: ${accessibilityIssues.stats.formControls}`);
    console.log(`  📄 Headings: ${accessibilityIssues.stats.headings}`);
    console.log(`  ⌨️  Focusable Elements: ${accessibilityIssues.stats.focusableElements}`);
    
    if (accessibilityIssues.issues.length > 0) {
      console.log(`\n⚠️ Accessibility Issues Found (${accessibilityIssues.issues.length}):`);
      accessibilityIssues.issues.forEach(issue => console.log(`  • ${issue}`));
    } else {
      console.log('✅ No major accessibility issues detected');
    }

    results.accessibility = accessibilityIssues;

  } catch (error) {
    console.log(`❌ Accessibility test failed: ${error.message}`);
    results.accessibility = { error: error.message };
  }

  await browser.close();
  
  console.log('\n🏁 Analysis Complete!');
  return results;
}

// Run the analysis
analyzeCarreiraPro().then(results => {
  console.log('\n📋 FULL ANALYSIS RESULTS:');
  console.log('='.repeat(50));
  console.log(JSON.stringify(results, null, 2));
}).catch(error => {
  console.error('Analysis failed:', error);
});