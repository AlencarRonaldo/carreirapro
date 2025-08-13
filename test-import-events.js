const playwright = require('playwright');

async function testImportFlow() {
  const browser = await playwright.chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listener para capturar logs do console
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'error') {
      console.log(`🌐 BROWSER: ${msg.text()}`);
    }
  });

  // Listener para capturar eventos customizados
  await page.evaluateOnNewDocument(() => {
    const originalDispatch = window.dispatchEvent;
    window.dispatchEvent = function(event) {
      if (event.type.includes('reload') || event.type.includes('updated')) {
        console.log(`🎯 EVENT DISPATCHED: ${event.type}`, event.detail || 'no detail');
      }
      return originalDispatch.call(this, event);
    };

    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener) {
      if (type.includes('reload') || type.includes('updated')) {
        console.log(`👂 EVENT LISTENER ADDED: ${type}`);
      }
      return originalAddEventListener.call(this, type, listener);
    };
  });

  try {
    console.log('📍 Navegando para a página de perfil...');
    await page.goto('http://localhost:3000/profile');
    
    // Aguardar login se necessário
    try {
      await page.waitForSelector('[data-testid="linkedin-import-form"]', { timeout: 3000 });
    } catch (error) {
      // Se não encontrar o formulário, pode precisar fazer login
      console.log('🔐 Pode precisar fazer login primeiro...');
      await page.goto('http://localhost:3000/login');
      await page.waitForLoadState('networkidle');
    }

    // Voltar para o perfil se fez login
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');

    console.log('📱 Aguardando 3 segundos para componentes carregarem...');
    await page.waitForTimeout(3000);

    // Verificar se os hooks estão sendo usados
    const hookUsage = await page.evaluate(() => {
      const results = {
        hasExperiencesListener: false,
        hasEducationListener: false,
        hasSkillsListener: false,
        profileData: null,
        experiencesData: null,
        educationData: null,
        skillsData: null
      };

      // Verificar se existem dados no state dos componentes
      try {
        // Simular um evento para ver se os listeners estão ativos
        const testEvent = new CustomEvent('experiences-reload');
        window.dispatchEvent(testEvent);
        results.hasExperiencesListener = true;
      } catch (e) {
        console.error('Erro ao testar listener de experiences:', e);
      }

      return results;
    });

    console.log('🔍 Hook usage:', hookUsage);

    // Simular uma importação do LinkedIn
    console.log('📥 Simulando importação do LinkedIn...');
    
    await page.evaluate(() => {
      const mockLinkedInData = {
        experiences: [
          {
            id: 'exp1',
            title: 'Desenvolvedor Senior',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: null,
            description: 'Desenvolvimento de aplicações web modernas'
          }
        ],
        education: [
          {
            id: 'edu1',
            institution: 'Universidade Federal',
            degree: 'Bacharelado em Ciência da Computação',
            startDate: '2016-01-01',
            endDate: '2019-12-31'
          }
        ],
        skills: [
          {
            id: 'skill1',
            name: 'JavaScript',
            level: 4
          }
        ]
      };

      console.log('🎯 Disparando eventos de reload após importação simulada...');
      
      // Simular os eventos que o useProfile dispararia após importação
      window.dispatchEvent(new CustomEvent('experiences-reload'));
      window.dispatchEvent(new CustomEvent('education-reload')); 
      window.dispatchEvent(new CustomEvent('skills-reload'));
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: { profile: mockLinkedInData } }));
    });

    // Aguardar um tempo para ver se os eventos foram processados
    await page.waitForTimeout(2000);

    // Verificar o estado final
    const finalState = await page.evaluate(() => {
      return {
        url: window.location.href,
        consoleErrors: window.console._errors || [],
        timestamp: new Date().toISOString()
      };
    });

    console.log('📊 Estado final:', finalState);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    console.log('🔚 Fechando navegador...');
    await browser.close();
  }
}

testImportFlow().catch(console.error);