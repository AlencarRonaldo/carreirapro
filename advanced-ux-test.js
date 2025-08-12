const { chromium } = require('playwright');

async function advancedUXTests() {
  console.log('🔬 Advanced UX Testing - Authentication, Theme Toggle, and User Flows\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
    slowMo: 100 // Slow down for better visual testing
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  const results = {};

  try {
    // Test 1: Theme Toggle Functionality
    console.log('🎨 Test 1: Theme Toggle Deep Analysis');
    
    await page.goto('http://localhost:55310', { waitUntil: 'domcontentloaded' });

    // Look for theme toggle button with various selectors
    const themeToggleInfo = await page.evaluate(() => {
      const selectors = [
        'button:has-text("Tema escuro")',
        'button:has-text("Tema claro")', 
        '[data-theme-toggle]',
        '.theme-toggle',
        'button[aria-label*="tema"]',
        'button[title*="tema"]'
      ];

      let toggleButton = null;
      let selector = null;

      for (const sel of selectors) {
        try {
          const elements = document.querySelectorAll('button');
          for (const btn of elements) {
            if (btn.textContent.includes('Tema') || 
                btn.getAttribute('aria-label')?.includes('tema') ||
                btn.getAttribute('title')?.includes('tema') ||
                btn.className.includes('theme')) {
              toggleButton = btn;
              selector = 'Theme button found';
              break;
            }
          }
          if (toggleButton) break;
        } catch (e) { continue; }
      }

      if (!toggleButton) return { found: false };

      return {
        found: true,
        text: toggleButton.textContent,
        className: toggleButton.className,
        visible: toggleButton.offsetParent !== null,
        position: {
          x: toggleButton.getBoundingClientRect().left,
          y: toggleButton.getBoundingClientRect().top
        }
      };
    });

    if (themeToggleInfo.found) {
      console.log('✅ Theme toggle found:', themeToggleInfo.text);
      
      // Test theme switching
      const initialState = await page.evaluate(() => ({
        bodyClass: document.body.className,
        htmlClass: document.documentElement.className,
        dataTheme: document.documentElement.getAttribute('data-theme'),
        computedBg: getComputedStyle(document.body).backgroundColor
      }));

      // Click the theme toggle
      await page.getByText('Tema', { exact: false }).first().click();
      await page.waitForTimeout(500);

      const newState = await page.evaluate(() => ({
        bodyClass: document.body.className,
        htmlClass: document.documentElement.className,
        dataTheme: document.documentElement.getAttribute('data-theme'),
        computedBg: getComputedStyle(document.body).backgroundColor
      }));

      const themeChanged = JSON.stringify(initialState) !== JSON.stringify(newState);
      
      console.log(`🔄 Theme switching: ${themeChanged ? '✅ Working' : '❌ Not working'}`);
      console.log(`  Initial background: ${initialState.computedBg}`);
      console.log(`  New background: ${newState.computedBg}`);

      await page.screenshot({ path: 'theme-after-toggle.png' });

      results.themeToggle = {
        found: true,
        functional: themeChanged,
        initialState,
        newState
      };
    } else {
      console.log('❌ Theme toggle not found');
      results.themeToggle = { found: false };
    }

    // Test 2: Authentication Flow Testing
    console.log('\n🔐 Test 2: Authentication Flow Analysis');
    
    // Navigate to login page
    await page.goto('http://localhost:55310/login', { waitUntil: 'domcontentloaded' });
    
    const loginPageAnalysis = await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input');
      const buttons = document.querySelectorAll('button');
      
      const formData = Array.from(forms).map(form => ({
        action: form.action,
        method: form.method,
        inputs: Array.from(form.querySelectorAll('input')).map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          required: input.required,
          hasLabel: input.labels?.length > 0 || !!input.getAttribute('aria-label')
        }))
      }));

      const buttonTexts = Array.from(buttons).map(btn => btn.textContent.trim()).filter(text => text);

      return {
        hasLoginForm: forms.length > 0,
        formCount: forms.length,
        inputCount: inputs.length,
        buttonCount: buttons.length,
        forms: formData,
        buttonTexts,
        hasEmailInput: Array.from(inputs).some(input => 
          input.type === 'email' || 
          input.name?.includes('email') || 
          input.placeholder?.toLowerCase().includes('email')
        ),
        hasPasswordInput: Array.from(inputs).some(input => input.type === 'password')
      };
    });

    console.log(`📝 Login Page Analysis:`);
    console.log(`  Forms found: ${loginPageAnalysis.formCount}`);
    console.log(`  Inputs found: ${loginPageAnalysis.inputCount}`);
    console.log(`  Has email field: ${loginPageAnalysis.hasEmailInput ? '✅' : '❌'}`);
    console.log(`  Has password field: ${loginPageAnalysis.hasPasswordInput ? '✅' : '❌'}`);
    console.log(`  Available buttons: ${loginPageAnalysis.buttonTexts.join(', ')}`);

    await page.screenshot({ path: 'login-page.png', fullPage: true });

    // Test protected routes
    console.log('\n🛡️ Testing Protected Routes');
    
    const protectedRoutes = ['/profile', '/documents', '/jobs', '/applications'];
    const routeTests = {};

    for (const route of protectedRoutes) {
      try {
        console.log(`🔍 Testing ${route}...`);
        await page.goto(`http://localhost:55310${route}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        const currentUrl = page.url();
        const isRedirected = !currentUrl.endsWith(route);
        const redirectedToLogin = currentUrl.includes('/login');
        
        routeTests[route] = {
          accessible: !isRedirected,
          redirected: isRedirected,
          redirectedToLogin,
          finalUrl: currentUrl
        };

        const status = isRedirected 
          ? (redirectedToLogin ? '🔒 Protected (redirects to login)' : '↪️  Redirected') 
          : '🔓 Accessible';
        
        console.log(`  ${route}: ${status}`);

      } catch (error) {
        routeTests[route] = {
          error: error.message,
          accessible: false
        };
        console.log(`  ${route}: ❌ Error - ${error.message}`);
      }
    }

    results.authentication = {
      loginPage: loginPageAnalysis,
      protectedRoutes: routeTests
    };

    // Test 3: User Journey Flow
    console.log('\n🚶 Test 3: User Journey Analysis');
    
    await page.goto('http://localhost:55310', { waitUntil: 'domcontentloaded' });
    
    // Test main call-to-action flows
    const ctaTests = [];
    
    const ctaButtons = [
      { text: 'Começar grátis', expected: '/login' },
      { text: 'Ver planos', expected: '#plans' },
      { text: 'Login', expected: '/login' }
    ];

    for (const cta of ctaButtons) {
      try {
        console.log(`🎯 Testing CTA: "${cta.text}"`);
        
        await page.goto('http://localhost:55310', { waitUntil: 'domcontentloaded' });
        
        const ctaElement = page.getByText(cta.text, { exact: false }).first();
        
        if (await ctaElement.isVisible()) {
          await ctaElement.click();
          await page.waitForTimeout(1000);
          
          const newUrl = page.url();
          const worksCorrectly = newUrl.includes(cta.expected.replace('#', ''));
          
          ctaTests.push({
            button: cta.text,
            expected: cta.expected,
            actualUrl: newUrl,
            works: worksCorrectly
          });

          console.log(`  ✅ "${cta.text}" → ${newUrl} ${worksCorrectly ? '✅' : '⚠️'}`);
        } else {
          ctaTests.push({
            button: cta.text,
            error: 'Button not visible'
          });
          console.log(`  ❌ "${cta.text}" not found or not visible`);
        }
      } catch (error) {
        ctaTests.push({
          button: cta.text,
          error: error.message
        });
        console.log(`  ❌ "${cta.text}" failed: ${error.message}`);
      }
    }

    results.userJourney = { ctaTests };

    // Test 4: Advanced Mobile Testing
    console.log('\n📱 Test 4: Advanced Mobile UX');
    
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:55310', { waitUntil: 'domcontentloaded' });

    const mobileUXAnalysis = await page.evaluate(() => {
      // Test touch target sizes
      const interactiveElements = document.querySelectorAll('button, a, input, select');
      const smallTargets = [];
      
      interactiveElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const area = rect.width * rect.height;
        const minTouchSize = 44; // 44px minimum recommended
        
        if ((rect.width < minTouchSize || rect.height < minTouchSize) && el.offsetParent !== null) {
          smallTargets.push({
            index,
            tagName: el.tagName,
            text: el.textContent?.trim().substring(0, 30) || '',
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          });
        }
      });

      // Check for viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const hasViewportMeta = !!viewportMeta;
      const viewportContent = viewportMeta?.content || '';

      // Check for mobile-specific CSS
      const stylesheets = Array.from(document.styleSheets);
      let hasMobileCSS = false;
      
      try {
        stylesheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            hasMobileCSS = rules.some(rule => 
              rule.media && (
                rule.media.mediaText.includes('max-width') ||
                rule.media.mediaText.includes('mobile')
              )
            );
          } catch (e) {
            // Cross-origin stylesheet access error
          }
        });
      } catch (e) {
        // Ignore cross-origin errors
      }

      return {
        smallTouchTargets: smallTargets,
        hasViewportMeta,
        viewportContent,
        hasMobileCSS
      };
    });

    console.log(`📱 Mobile UX Analysis:`);
    console.log(`  Viewport meta: ${mobileUXAnalysis.hasViewportMeta ? '✅' : '❌'} ${mobileUXAnalysis.viewportContent}`);
    console.log(`  Mobile CSS detected: ${mobileUXAnalysis.hasMobileCSS ? '✅' : '❓'}`);
    console.log(`  Small touch targets: ${mobileUXAnalysis.smallTouchTargets.length}`);
    
    if (mobileUXAnalysis.smallTouchTargets.length > 0) {
      console.log(`  Small targets found:`);
      mobileUXAnalysis.smallTouchTargets.slice(0, 5).forEach(target => {
        console.log(`    • ${target.tagName}: "${target.text}" (${target.width}×${target.height}px)`);
      });
    }

    await page.screenshot({ path: 'mobile-advanced.png', fullPage: true });

    results.advancedMobile = mobileUXAnalysis;

    console.log('\n✅ Advanced UX Analysis Complete!');

  } catch (error) {
    console.error('❌ Advanced test failed:', error.message);
    results.error = error.message;
  } finally {
    await browser.close();
  }

  return results;
}

// Run the advanced analysis
advancedUXTests().then(results => {
  console.log('\n📋 ADVANCED ANALYSIS RESULTS:');
  console.log('='.repeat(60));
  console.log(JSON.stringify(results, null, 2));
}).catch(error => {
  console.error('Advanced analysis failed:', error);
});