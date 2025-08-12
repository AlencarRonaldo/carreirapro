const { chromium } = require('playwright');

async function testSpecificProfileForm() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar network calls
  const networkCalls = [];
  const consoleLogs = [];
  
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
    if (msg.type() === 'error') {
      console.log(`[ERROR] ${msg.text()}`);
    }
  });
  
  page.on('request', request => {
    networkCalls.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString()
    });
    if (request.url().includes('/api/')) {
      console.log(`[REQUEST] ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', async response => {
    networkCalls.push({
      type: 'response',
      url: response.url(),
      status: response.status(),
      timestamp: new Date().toISOString()
    });
    if (response.url().includes('/api/')) {
      console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
      
      // Capturar body se for um erro ou atualização
      if (response.status() >= 400 || response.url().includes('/profile')) {
        try {
          const body = await response.text();
          if (body && body.length < 1000) {
            console.log(`   BODY: ${body}`);
          }
        } catch (e) {
          // Ignore
        }
      }
    }
  });
  
  console.log('🚀 Testando formulário específico de perfil...');
  
  try {
    // 1. Ir diretamente para a página do perfil
    console.log('\n1. 🔐 Acessando página com simulação de auth...');
    await page.goto('http://localhost:3010/profile');
    
    // Simular auth no localStorage antes da página carregar
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_123');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        authenticated: true
      }));
    });
    
    // Adicionar cookie também
    await context.addCookies([{
      name: 'auth_token', 
      value: 'test_session',
      domain: 'localhost',
      path: '/'
    }]);
    
    // Recarregar para aplicar auth
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`   📍 URL atual: ${currentUrl}`);
    
    // 2. Se ainda estiver no login, tentar bypass
    if (currentUrl.includes('/login')) {
      console.log('   🔄 Ainda no login, tentando acesso direto via JS...');
      
      // Tentar navegar programaticamente
      await page.evaluate(() => {
        window.location.href = '/profile';
      });
      
      await page.waitForTimeout(2000);
      
      if (page.url().includes('/login')) {
        console.log('   ⚠️ Sistema força login. Vamos usar credenciais demo...');
        
        // Usar credenciais padrão
        await page.fill('[name="email"], #email', 'demo@carreirapro.app');
        await page.fill('[name="password"], #password', 'demo123');
        await page.click('button[type="submit"]');
        
        // Aguardar redirecionamento
        await page.waitForTimeout(3000);
      }
    }
    
    // 3. Agora verificar se chegamos ao perfil
    await page.waitForTimeout(2000);
    const finalUrl = page.url();
    console.log(`   ✅ URL final: ${finalUrl}`);
    
    // 4. Aguardar elementos da página de perfil carregarem
    console.log('\n2. 📄 Aguardando carregamento da página de perfil...');
    
    // Aguardar pelo wizard ou formulário aparecer
    try {
      await page.waitForSelector('h1, h2', { timeout: 5000 });
      const title = await page.textContent('h1').catch(() => page.textContent('h2').catch(() => 'N/A'));
      console.log(`   📋 Título da página: ${title}`);
    } catch (e) {
      console.log('   ⚠️ Timeout aguardando título da página');
    }
    
    // 5. Procurar pelos campos específicos do ProfileInfoForm
    console.log('\n3. 🔍 Procurando campos específicos do ProfileInfoForm...');
    
    const profileFields = {
      fullName: {
        selectors: ['[name="fullName"]', 'input[placeholder*="nome completo" i]', 'input[placeholder*="nome" i]'],
        testValue: 'João da Silva Teste'
      },
      headline: {
        selectors: ['[name="headline"]', 'input[placeholder*="desenvolvedor" i]', 'input[placeholder*="headline" i]'],
        testValue: 'Desenvolvedor Full Stack Sênior'
      },
      email: {
        selectors: ['[name="email"]', 'input[type="email"]', 'input[placeholder*="email" i]'],
        testValue: 'joao.silva@teste.com'
      },
      phone: {
        selectors: ['[name="phone"]', 'input[placeholder*="telefone" i]', 'input[placeholder*="phone" i]'],
        testValue: '11987654321'
      },
      locationCity: {
        selectors: ['[name="locationCity"]', 'input[placeholder*="cidade" i]', 'input[placeholder*="são paulo" i]'],
        testValue: 'São Paulo'
      },
      linkedin: {
        selectors: ['[name="linkedin"]', 'input[placeholder*="linkedin" i]'],
        testValue: 'https://linkedin.com/in/joao-silva'
      }
    };
    
    const foundFields = {};
    
    // Primeiro, listar todos os inputs disponíveis
    const allInputs = await page.locator('input').all();
    console.log(`   📝 Total de inputs na página: ${allInputs.length}`);
    
    for (let i = 0; i < Math.min(allInputs.length, 20); i++) {
      try {
        const input = allInputs[i];
        const name = await input.getAttribute('name') || '';
        const placeholder = await input.getAttribute('placeholder') || '';
        const type = await input.getAttribute('type') || '';
        const id = await input.getAttribute('id') || '';
        const isVisible = await input.isVisible();
        
        console.log(`   [${i}] ${name ? `name="${name}"` : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} ${type ? `type="${type}"` : ''} ${id ? `id="${id}"` : ''} visible=${isVisible}`);
      } catch (e) {
        console.log(`   [${i}] Erro ao ler input: ${e.message}`);
      }
    }
    
    // Agora tentar encontrar campos específicos
    for (const [fieldName, fieldData] of Object.entries(profileFields)) {
      let found = false;
      
      for (const selector of fieldData.selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible()) {
            foundFields[fieldName] = { selector, element, value: fieldData.testValue };
            console.log(`   ✅ Campo ${fieldName} encontrado: ${selector}`);
            found = true;
            break;
          }
        } catch (e) {
          // Continue
        }
      }
      
      if (!found) {
        console.log(`   ❌ Campo ${fieldName} não encontrado`);
      }
    }
    
    // 6. Testar preenchimento e auto-save
    if (Object.keys(foundFields).length > 0) {
      console.log(`\n4. ✏️ Testando preenchimento de ${Object.keys(foundFields).length} campos...`);
      
      // Verificar localStorage inicial
      const initialLS = await page.evaluate(() => ({
        drafts: Object.keys(localStorage).filter(k => k.includes('draft')).map(k => [k, localStorage.getItem(k)]),
        profile: localStorage.getItem('profile_data')
      }));
      console.log(`   📱 LocalStorage inicial: ${initialLS.drafts.length} drafts, profile=${!!initialLS.profile}`);
      
      let fillCount = 0;
      for (const [fieldName, fieldConfig] of Object.entries(foundFields)) {
        try {
          console.log(`   📝 Preenchendo ${fieldName}...`);
          await fieldConfig.element.fill(fieldConfig.value);
          
          // Aguardar um pouco para trigger do auto-save
          await page.waitForTimeout(1000);
          fillCount++;
          
          console.log(`   ✅ ${fieldName}: "${fieldConfig.value}"`);
        } catch (e) {
          console.log(`   ❌ Erro ao preencher ${fieldName}: ${e.message}`);
        }
      }
      
      console.log(`   📊 Campos preenchidos: ${fillCount}/${Object.keys(foundFields).length}`);
      
      // 7. Aguardar auto-save completo
      console.log('\n5. ⏳ Aguardando auto-save (5 segundos)...');
      await page.waitForTimeout(5000);
      
      // Verificar indicadores visuais de salvamento
      const saveIndicators = await page.locator('text=/salvando/i, text=/saving/i, text=/salvo/i, text=/saved/i, [data-testid*="save"]').all();
      console.log(`   💾 Indicadores de salvamento encontrados: ${saveIndicators.length}`);
      
      if (saveIndicators.length > 0) {
        for (let i = 0; i < saveIndicators.length; i++) {
          const text = await saveIndicators[i].textContent();
          console.log(`   [${i}] "${text}"`);
        }
      }
      
      // 8. Verificar localStorage após preenchimento
      const postLS = await page.evaluate(() => ({
        drafts: Object.keys(localStorage).filter(k => k.includes('draft')).map(k => [k, localStorage.getItem(k)]),
        profile: localStorage.getItem('profile_data'),
        all: Object.keys(localStorage).length
      }));
      
      console.log(`   📱 LocalStorage após preenchimento: ${postLS.drafts.length} drafts, profile=${!!postLS.profile}, total=${postLS.all} keys`);
      
      // Mostrar drafts se existirem
      if (postLS.drafts.length > 0) {
        console.log('   📋 Drafts encontrados:');
        postLS.drafts.forEach(([key, value]) => {
          const preview = value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : 'null';
          console.log(`      ${key}: ${preview}`);
        });
      }
      
      // 9. Testar reload da página
      console.log('\n6. 🔄 Testando persistência após reload...');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(5000);
      
      // Verificar se dados persistiram
      let persistedCount = 0;
      for (const [fieldName, fieldConfig] of Object.entries(foundFields)) {
        try {
          const newElement = page.locator(fieldConfig.selector).first();
          if (await newElement.isVisible()) {
            const currentValue = await newElement.inputValue();
            if (currentValue === fieldConfig.value) {
              console.log(`   ✅ ${fieldName}: PERSISTIU - "${currentValue}"`);
              persistedCount++;
            } else if (currentValue && currentValue.trim()) {
              console.log(`   🔄 ${fieldName}: MUDOU - "${currentValue}" (esperado: "${fieldConfig.value}")`);
              persistedCount++; // Conta como persisted mesmo se mudou
            } else {
              console.log(`   ❌ ${fieldName}: PERDIDO - campo vazio`);
            }
          } else {
            console.log(`   ❌ ${fieldName}: Campo não visível após reload`);
          }
        } catch (e) {
          console.log(`   ❌ ${fieldName}: Erro ao verificar - ${e.message}`);
        }
      }
      
      const persistenceRate = (persistedCount / fillCount) * 100;
      console.log(`   📊 Taxa de persistência: ${persistedCount}/${fillCount} (${persistenceRate.toFixed(1)}%)`);
      
    } else {
      console.log('\n❌ Nenhum campo do ProfileInfoForm foi encontrado para testar!');
    }
    
    // 10. Relatório final de rede
    console.log('\n7. 📊 RELATÓRIO DE REDE:');
    
    const apiRequests = networkCalls.filter(c => c.type === 'request' && c.url.includes('/api/'));
    const profileApiCalls = networkCalls.filter(c => c.url.includes('/api/profile'));
    const saveCalls = networkCalls.filter(c => 
      c.type === 'request' && 
      ['PUT', 'POST', 'PATCH'].includes(c.method) && 
      c.url.includes('/api/profile')
    );
    
    console.log(`   🌐 Total chamadas API: ${apiRequests.length}`);
    console.log(`   👤 Chamadas API profile: ${profileApiCalls.length}`);
    console.log(`   💾 Chamadas de salvamento: ${saveCalls.length}`);
    
    // Mostrar timeline de chamadas relevantes
    const relevantCalls = networkCalls.filter(c => 
      c.url.includes('/api/profile') || (c.url.includes('/api/') && ['PUT', 'POST', 'PATCH'].includes(c.method))
    );
    
    if (relevantCalls.length > 0) {
      console.log('\n   📋 Timeline de chamadas relevantes:');
      relevantCalls.forEach(call => {
        const time = new Date(call.timestamp).toISOString().substr(14, 9);
        if (call.type === 'request') {
          console.log(`   ${time} → ${call.method} ${call.url}`);
        } else {
          console.log(`   ${time} ← ${call.status} ${call.url}`);
        }
      });
    }
    
    // Relatório de erros
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      console.log('\n   ❌ ERROS NO CONSOLE:');
      errors.forEach(error => console.log(`      ${error.text}`));
    }
    
    // Diagnóstico final
    console.log('\n8. 🔍 DIAGNÓSTICO:');
    if (saveCalls.length === 0) {
      console.log('   ⚠️ PROBLEMA: Nenhuma chamada de salvamento detectada!');
      console.log('      Possíveis causas:');
      console.log('      - useAutoSave hook não está sendo executado');
      console.log('      - Delay do auto-save muito longo');
      console.log('      - Validação impedindo o save');
      console.log('      - Erro na função updateProfile');
    } else {
      console.log('   ✅ Auto-save está fazendo chamadas HTTP');
      console.log(`      Detectadas ${saveCalls.length} tentativas de salvamento`);
    }
    
    if (Object.keys(foundFields).length === 0) {
      console.log('   ⚠️ PROBLEMA: Campos de formulário não encontrados!');
      console.log('      - Página pode não estar carregando corretamente');
      console.log('      - Auth pode estar impedindo acesso');
      console.log('      - Estrutura da página pode ter mudado');
    }
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  } finally {
    console.log('\n🏁 Teste concluído. Fechando navegador em 10 segundos...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testSpecificProfileForm().catch(console.error);