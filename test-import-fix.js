const playwright = require('playwright');

async function testImportFix() {
  const browser = await playwright.chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar todos os logs do console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    // Filtrar logs relevantes
    if (text.includes('📄') || text.includes('🔍') || text.includes('useProfile') || 
        text.includes('reload') || text.includes('listener') || text.includes('EVENT')) {
      console.log(`🌐 ${type.toUpperCase()}: ${text}`);
    }
  });

  try {
    console.log('📍 Navegando para a página de perfil...');
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    
    console.log('⏳ Aguardando componentes carregarem...');
    await page.waitForTimeout(2000);

    // Verificar se os event listeners estão sendo registrados
    const listenersRegistered = await page.evaluate(() => {
      // Injetar código para monitorar eventos
      let eventsReceived = [];
      
      ['experiences-reload', 'education-reload', 'skills-reload'].forEach(eventType => {
        const handler = (e) => {
          eventsReceived.push({ type: e.type, timestamp: Date.now() });
          console.log(`🎯 EVENT RECEIVED: ${e.type}`);
        };
        
        window.addEventListener(eventType, handler);
        console.log(`👂 LISTENER REGISTERED: ${eventType}`);
      });
      
      // Armazenar na janela para verificar depois
      window._eventTracker = eventsReceived;
      
      return true;
    });

    console.log('✅ Event listeners configurados:', listenersRegistered);

    // Aguardar mais um pouco para garantir que todos os hooks foram inicializados
    await page.waitForTimeout(1000);

    // Simular importação disparando eventos
    console.log('🚀 Simulando importação disparando eventos...');
    
    const eventsDispatched = await page.evaluate(() => {
      console.log('🎯 Disparando evento experiences-reload...');
      window.dispatchEvent(new CustomEvent('experiences-reload'));
      
      console.log('🎯 Disparando evento education-reload...');
      window.dispatchEvent(new CustomEvent('education-reload'));
      
      console.log('🎯 Disparando evento skills-reload...');
      window.dispatchEvent(new CustomEvent('skills-reload'));
      
      return true;
    });

    console.log('✅ Eventos disparados:', eventsDispatched);

    // Aguardar processamento dos eventos
    await page.waitForTimeout(3000);

    // Verificar se os eventos foram recebidos
    const eventsReceived = await page.evaluate(() => {
      return window._eventTracker || [];
    });

    console.log('📊 Eventos recebidos:', eventsReceived);

    // Verificar logs no console da página
    await page.evaluate(() => {
      console.log('✅ TESTE CONCLUÍDO - Verificar logs acima para validar funcionamento');
    });

    // Aguardar um pouco mais para ver resultados
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    console.log('🔚 Teste finalizado. Feche o navegador quando terminar de analisar.');
    // Manter navegador aberto para análise
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testImportFix().catch(console.error);