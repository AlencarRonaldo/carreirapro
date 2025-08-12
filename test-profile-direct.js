const { chromium } = require('playwright');

async function testProfileDirect() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar logs
  const consoleLogs = [];
  const networkCalls = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({
      type: msg.type(),
      text: text,
      timestamp: new Date().toISOString()
    });
    
    // Filtrar logs importantes
    if (msg.type() === 'error' || text.includes('profile') || text.includes('auto') || text.includes('save')) {
      console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${text}`);
    }
  });
  
  page.on('request', request => {
    const url = request.url();
    networkCalls.push({
      type: 'request',
      url: url,
      method: request.method(),
      timestamp: new Date().toISOString()
    });
    
    if (url.includes('/api/') || url.includes('profile')) {
      console.log(`[NET →] ${request.method()} ${url}`);
    }
  });
  
  page.on('response', async response => {
    const url = response.url();
    networkCalls.push({
      type: 'response',
      url: url,
      status: response.status(),
      timestamp: new Date().toISOString()
    });
    
    if (url.includes('/api/')) {
      console.log(`[NET ←] ${response.status()} ${url}`);
      
      try {
        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
          const body = await response.text();
          if (body && body.length < 500) { // Só mostra responses pequenos
            console.log(`   BODY: ${body}`);
          } else if (body) {
            console.log(`   BODY: ${body.length} chars`);
          }
        }
      } catch (e) {
        // Ignore
      }
    }
  });
  
  console.log('🚀 Testando perfil diretamente com simulação de auth...');
  
  try {
    // 1. Simular auth token no localStorage
    await page.goto('http://localhost:3010/profile');
    
    // Adicionar token de teste no localStorage
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock_token_test');
      localStorage.setItem('user_id', '1');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@test.com',
        name: 'Test User'
      }));
    });
    
    console.log('   ✅ Auth simulado adicionado ao localStorage');
    
    // 2. Recarregar página
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`   📍 URL atual: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('   ⚠️ Ainda redirecionando para login. Tentando adicionar cookies...');
      
      // Tentar adicionar cookies de autenticação
      await context.addCookies([
        {
          name: 'auth_token',
          value: 'mock_test_token',
          domain: 'localhost',
          path: '/'
        },
        {
          name: 'session_id',
          value: 'test_session',
          domain: 'localhost',
          path: '/'
        }
      ]);
      
      // Tentar novamente
      await page.goto('http://localhost:3010/profile');
      await page.waitForTimeout(2000);
    }
    
    // 3. Analisar estrutura da página
    console.log('\n📄 Analisando estrutura da página atual...');
    
    const title = await page.title();
    console.log(`   Title: ${title}`);
    
    const headers = await page.locator('h1, h2, h3').allTextContents();
    console.log(`   Headers: ${headers.join(', ')}`);
    
    // 4. Mapear inputs
    const inputs = await page.locator('input, textarea').all();
    console.log(`\n🔍 Mapeando ${inputs.length} campos de entrada:`);
    
    const fieldMap = {};
    for (let i = 0; i < inputs.length; i++) {
      try {
        const element = inputs[i];
        const name = await element.getAttribute('name') || '';
        const placeholder = await element.getAttribute('placeholder') || '';
        const id = await element.getAttribute('id') || '';
        const type = await element.getAttribute('type') || '';
        const isVisible = await element.isVisible();
        const isEnabled = await element.isEnabled();
        
        const key = name || id || placeholder;
        if (key && isVisible && isEnabled && type !== 'hidden') {
          fieldMap[key] = element;
          console.log(`   [${i}] "${key}" (${type}) - ${placeholder}`);
        }
      } catch (e) {
        console.log(`   [${i}] Erro: ${e.message}`);
      }
    }
    
    // 5. Testar preenchimento se temos campos
    if (Object.keys(fieldMap).length > 0) {
      console.log('\n✏️ Testando preenchimento e auto-save...');
      
      const testData = {
        'name': 'João Auto-Save Test',
        'nome': 'João Auto-Save Test',
        'email': 'joao.autosave@test.com',
        'phone': '11987654321',
        'telefone': '11987654321',
        'empresa': 'Teste Ltda',
        'company': 'Teste Ltda'
      };
      
      let filledCount = 0;
      
      // Preencher campos disponíveis
      for (const [fieldKey, element] of Object.entries(fieldMap)) {
        for (const [dataKey, dataValue] of Object.entries(testData)) {
          if (fieldKey.toLowerCase().includes(dataKey.toLowerCase()) || dataKey.includes(fieldKey.toLowerCase())) {
            try {
              await element.fill(dataValue);
              console.log(`   ✅ ${fieldKey}: ${dataValue}`);
              filledCount++;
              
              // Aguardar um pouco para auto-save
              await page.waitForTimeout(1500);
              break;
            } catch (e) {
              console.log(`   ❌ Erro em ${fieldKey}: ${e.message}`);
            }
          }
        }
      }
      
      console.log(`   📊 Campos preenchidos: ${filledCount}`);
      
      // 6. Aguardar auto-save e monitorar rede
      console.log('\n⏳ Aguardando auto-save completo (5s)...');
      await page.waitForTimeout(5000);
      
      // 7. Verificar localStorage
      const localStorageData = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });
      
      console.log('📱 Estado do localStorage:');
      Object.entries(localStorageData).forEach(([key, value]) => {
        if (key.includes('profile') || key.includes('draft') || key.length > 20) {
          console.log(`   ${key}: ${value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : 'null'}`);
        } else {
          console.log(`   ${key}: ${value}`);
        }
      });
      
      // 8. Testar reload
      console.log('\n🔄 Testando persistência após reload...');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Verificar se dados persistiram
      let persistedCount = 0;
      for (const [fieldKey, originalElement] of Object.entries(fieldMap)) {
        try {
          // Re-localizar elemento após reload
          const newElement = page.locator(`[name="${fieldKey}"], [id="${fieldKey}"], input[placeholder*="${fieldKey}" i]`).first();
          if (await newElement.isVisible()) {
            const currentValue = await newElement.inputValue();
            if (currentValue && currentValue.trim() !== '') {
              console.log(`   ✅ ${fieldKey}: "${currentValue}"`);
              persistedCount++;
            } else {
              console.log(`   ❌ ${fieldKey}: vazio`);
            }
          }
        } catch (e) {
          console.log(`   ❌ ${fieldKey}: não encontrado após reload`);
        }
      }
      
      console.log(`   📊 Dados persistidos após reload: ${persistedCount}/${filledCount}`);
      
    } else {
      console.log('❌ Nenhum campo editável encontrado');
    }
    
    // 9. Relatório de rede
    console.log('\n📊 ANÁLISE DE REDE:');
    
    const apiRequests = networkCalls.filter(c => c.type === 'request' && c.url.includes('/api/'));
    const apiResponses = networkCalls.filter(c => c.type === 'response' && c.url.includes('/api/'));
    const profileCalls = networkCalls.filter(c => c.url.includes('/profile') && c.url.includes('/api/'));
    const saveCalls = networkCalls.filter(c => 
      c.type === 'request' && 
      ['PUT', 'POST', 'PATCH'].includes(c.method) && 
      c.url.includes('/api/')
    );
    
    console.log(`   🔗 Requests para API: ${apiRequests.length}`);
    console.log(`   📥 Responses da API: ${apiResponses.length}`);
    console.log(`   👤 Calls relacionadas ao perfil: ${profileCalls.length}`);
    console.log(`   💾 Calls de salvamento: ${saveCalls.length}`);
    
    if (saveCalls.length === 0) {
      console.log('   ⚠️ PROBLEMA: Nenhuma chamada de salvamento detectada!');
      console.log('   🔍 Isso pode indicar que:');
      console.log('      - O auto-save não está funcionando');
      console.log('      - O hook useAutoSave não está sendo executado');
      console.log('      - Há erro na implementação do save');
    } else {
      console.log('   ✅ Sistema de salvamento está fazendo calls HTTP');
      saveCalls.forEach(call => {
        console.log(`      → ${call.method} ${call.url} (${call.timestamp})`);
      });
    }
    
    // 10. Relatório de console
    const errors = consoleLogs.filter(log => log.type === 'error');
    const warnings = consoleLogs.filter(log => log.type === 'warning');
    
    console.log(`\n📋 LOGS DO CONSOLE:`);
    console.log(`   ❌ Erros: ${errors.length}`);
    console.log(`   ⚠️ Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('   📋 Principais erros:');
      errors.slice(0, 5).forEach(error => {
        console.log(`      ${error.text}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  } finally {
    console.log('\n🏁 Teste concluído. Fechando em 8 segundos...');
    await page.waitForTimeout(8000);
    await browser.close();
  }
}

testProfileDirect().catch(console.error);