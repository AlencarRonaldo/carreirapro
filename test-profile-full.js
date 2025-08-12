const { chromium } = require('playwright');

async function testFullProfileFlow() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar logs
  const consoleLogs = [];
  const networkCalls = [];
  
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('request', request => {
    networkCalls.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString()
    });
    if (request.url().includes('/api/') || request.url().includes('profile') || request.url().includes('auth')) {
      console.log(`[NETWORK REQUEST] ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', async response => {
    networkCalls.push({
      type: 'response',
      url: response.url(),
      status: response.status(),
      timestamp: new Date().toISOString()
    });
    if (response.url().includes('/api/') || response.url().includes('profile') || response.url().includes('auth')) {
      console.log(`[NETWORK RESPONSE] ${response.status()} ${response.url()}`);
      
      // Se for uma resposta de API, capturar o conteúdo
      if (response.url().includes('/api/')) {
        try {
          const contentType = response.headers()['content-type'];
          if (contentType && contentType.includes('application/json')) {
            const responseBody = await response.text();
            console.log(`   RESPONSE BODY: ${responseBody}`);
          }
        } catch (e) {
          console.log(`   Could not read response body: ${e.message}`);
        }
      }
    }
  });
  
  console.log('🚀 Testando fluxo completo: Login → Profile → Persistência...');
  
  try {
    // 1. Tentar acessar perfil diretamente primeiro
    console.log('\n1. 🔐 Tentando acessar perfil diretamente...');
    await page.goto('http://localhost:3010/profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log(`   📍 URL atual: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('   🔀 Redirecionado para login - fazendo autenticação...');
      
      // 2. Fazer login
      await page.fill('#email', 'teste@teste.com');
      await page.fill('#password', 'senha123');
      console.log('   📝 Credenciais preenchidas');
      
      // Clicar no botão de login
      const loginButton = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")');
      await loginButton.click();
      console.log('   🔘 Botão de login clicado');
      
      // Aguardar redirecionamento
      await page.waitForURL('**/profile', { timeout: 10000 }).catch(() => {
        console.log('   ⚠️ Não redirecionou automaticamente para profile');
      });
      
      await page.waitForTimeout(3000);
      
      const afterLoginUrl = page.url();
      console.log(`   📍 URL após login: ${afterLoginUrl}`);
      
      if (!afterLoginUrl.includes('/profile')) {
        console.log('   🔄 Navegando manualmente para profile...');
        await page.goto('http://localhost:3010/profile', { waitUntil: 'networkidle' });
      }
    }
    
    // 3. Agora estamos na página de perfil
    console.log('\n2. 📄 Analisando página de perfil...');
    await page.waitForTimeout(2000);
    
    const finalUrl = page.url();
    console.log(`   📍 URL final: ${finalUrl}`);
    
    // Capturar title e headers
    const title = await page.title();
    const h1 = await page.textContent('h1').catch(() => 'N/A');
    const h2 = await page.textContent('h2').catch(() => 'N/A');
    console.log(`   📋 Title: ${title}`);
    console.log(`   📋 H1: ${h1}`);
    console.log(`   📋 H2: ${h2}`);
    
    // 4. Mapear todos os inputs disponíveis
    console.log('\n3. 🔍 Mapeando campos do formulário...');
    const inputs = await page.locator('input').all();
    console.log(`   📝 Total de inputs encontrados: ${inputs.length}`);
    
    const inputDetails = [];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      try {
        const name = await input.getAttribute('name') || '';
        const placeholder = await input.getAttribute('placeholder') || '';
        const id = await input.getAttribute('id') || '';
        const type = await input.getAttribute('type') || '';
        const value = await input.inputValue() || '';
        const isVisible = await input.isVisible();
        
        inputDetails.push({ name, placeholder, id, type, value, isVisible });
        console.log(`      [${i}] name="${name}" placeholder="${placeholder}" id="${id}" type="${type}" value="${value}" visible=${isVisible}`);
      } catch (e) {
        console.log(`      [${i}] Erro ao ler input: ${e.message}`);
      }
    }
    
    // 5. Tentar encontrar campos específicos do perfil
    const profileFields = [
      { name: 'nome', selectors: ['[name="name"]', '[name="nome"]', 'input[placeholder*="nome" i]', '#name', '#nome'] },
      { name: 'email', selectors: ['[name="email"]', '[type="email"]', 'input[placeholder*="email" i]', '#email'] },
      { name: 'telefone', selectors: ['[name="phone"]', '[name="telefone"]', 'input[placeholder*="telefone" i]', 'input[placeholder*="phone" i]', '#phone', '#telefone'] },
      { name: 'empresa', selectors: ['[name="company"]', '[name="empresa"]', 'input[placeholder*="empresa" i]', '#company', '#empresa'] }
    ];
    
    const foundFields = {};
    
    for (const field of profileFields) {
      for (const selector of field.selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible()) {
            foundFields[field.name] = { selector, element };
            console.log(`   ✅ Campo ${field.name} encontrado: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue tentando outros seletores
        }
      }
      if (!foundFields[field.name]) {
        console.log(`   ❌ Campo ${field.name} não encontrado`);
      }
    }
    
    // 6. Se encontramos campos, vamos testar a persistência
    if (Object.keys(foundFields).length > 0) {
      console.log('\n4. ✏️ Testando persistência dos dados...');
      
      const testData = {
        nome: 'João Silva Playwright',
        email: 'joao.playwright@test.com',
        telefone: '(11) 98765-4321',
        empresa: 'Empresa Teste Ltda'
      };
      
      // Verificar estado inicial do localStorage
      const initialLS = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('profile') || key.includes('draft'))) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });
      console.log('   📱 localStorage inicial:', Object.keys(initialLS).length > 0 ? initialLS : 'Vazio');
      
      // Preencher campos encontrados
      for (const [fieldName, fieldData] of Object.entries(foundFields)) {
        if (testData[fieldName]) {
          try {
            await fieldData.element.fill(testData[fieldName]);
            console.log(`   ✅ ${fieldName} preenchido: ${testData[fieldName]}`);
            
            // Aguardar um pouco para ver se há auto-save
            await page.waitForTimeout(1000);
          } catch (e) {
            console.log(`   ❌ Erro ao preencher ${fieldName}: ${e.message}`);
          }
        }
      }
      
      // 7. Aguardar auto-save
      console.log('\n5. ⏳ Aguardando auto-save e monitorando rede...');
      await page.waitForTimeout(5000);
      
      // Verificar localStorage após preenchimento
      const postFillLS = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('profile') || key.includes('draft'))) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });
      console.log('   📱 localStorage após preenchimento:', Object.keys(postFillLS).length > 0 ? postFillLS : 'Vazio');
      
      // Comparar localStorage
      const lsChanged = JSON.stringify(initialLS) !== JSON.stringify(postFillLS);
      console.log(`   📊 localStorage modificado: ${lsChanged ? 'SIM' : 'NÃO'}`);
      
      // 8. Verificar indicadores visuais
      const savingIndicators = await page.locator('text=/salvando/i, text=/saving/i, [class*="saving"], [data-testid*="saving"], text=/salvo/i, text=/saved/i').all();
      console.log(`   💾 Indicadores de salvamento encontrados: ${savingIndicators.length}`);
      
      // 9. Testar reload
      console.log('\n6. 🔄 Testando persistência após reload...');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Verificar se os dados persistiram
      let dataPersistedAfterReload = true;
      for (const [fieldName, fieldData] of Object.entries(foundFields)) {
        if (testData[fieldName]) {
          try {
            const newElement = page.locator(fieldData.selector).first();
            const currentValue = await newElement.inputValue();
            console.log(`   📝 ${fieldName} após reload: "${currentValue}" (esperado: "${testData[fieldName]}")`);
            if (currentValue !== testData[fieldName]) {
              dataPersistedAfterReload = false;
            }
          } catch (e) {
            console.log(`   ❌ Erro ao verificar ${fieldName} após reload: ${e.message}`);
            dataPersistedAfterReload = false;
          }
        }
      }
      
      console.log(`   📊 Dados persistiram após reload: ${dataPersistedAfterReload ? '✅ SIM' : '❌ NÃO'}`);
      
    } else {
      console.log('\n❌ Nenhum campo de perfil foi encontrado para testar');
      
      // Tentar encontrar qualquer formulário
      const forms = await page.locator('form').all();
      console.log(`   📋 Formulários encontrados: ${forms.length}`);
      
      const textareas = await page.locator('textarea').all();
      console.log(`   📝 Textareas encontrados: ${textareas.length}`);
      
      const buttons = await page.locator('button').all();
      console.log(`   🔘 Botões encontrados: ${buttons.length}`);
    }
    
    // 10. Relatório final
    console.log('\n7. 📊 RELATÓRIO FINAL:');
    
    // Analisar chamadas de rede
    const apiCalls = networkCalls.filter(call => call.url.includes('/api/'));
    const profileCalls = networkCalls.filter(call => call.url.includes('/profile') && call.url.includes('/api/'));
    const updateCalls = networkCalls.filter(call => 
      call.type === 'request' && 
      (call.method === 'PUT' || call.method === 'POST' || call.method === 'PATCH') && 
      call.url.includes('/api/')
    );
    
    console.log(`   🌐 Total de chamadas de rede: ${networkCalls.length}`);
    console.log(`   🔗 Chamadas para APIs: ${apiCalls.length}`);
    console.log(`   👤 Chamadas para API de perfil: ${profileCalls.length}`);
    console.log(`   ✏️ Chamadas de atualização (PUT/POST/PATCH): ${updateCalls.length}`);
    
    if (updateCalls.length === 0) {
      console.log('   ⚠️ PROBLEMA: Nenhuma chamada de atualização detectada!');
    } else {
      console.log('   ✅ Chamadas de atualização detectadas:');
      updateCalls.forEach(call => {
        console.log(`      → ${call.method} ${call.url}`);
      });
    }
    
    // Analisar erros no console
    const errors = consoleLogs.filter(log => log.type === 'error');
    const warnings = consoleLogs.filter(log => log.type === 'warning');
    
    console.log(`   ❌ Erros no console: ${errors.length}`);
    errors.forEach(error => console.log(`      ${error.text}`));
    
    console.log(`   ⚠️ Warnings no console: ${warnings.length}`);
    warnings.forEach(warning => console.log(`      ${warning.text}`));
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  } finally {
    console.log('\n🏁 Teste concluído. Fechando navegador em 10 segundos...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testFullProfileFlow().catch(console.error);