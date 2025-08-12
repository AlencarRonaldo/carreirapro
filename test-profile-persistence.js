const { chromium } = require('playwright');

async function testProfilePersistence() {
  const browser = await chromium.launch({ 
    headless: false, // Para poder ver o que está acontecendo
    slowMo: 500 // Slow down para melhor observação
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar todos os logs do console
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
    console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  // Capturar chamadas de rede
  const networkCalls = [];
  page.on('request', request => {
    if (request.url().includes('/api/') || request.url().includes('profile')) {
      networkCalls.push({
        type: 'request',
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      console.log(`[NETWORK REQUEST] ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/') || response.url().includes('profile')) {
      networkCalls.push({
        type: 'response',
        url: response.url(),
        status: response.status(),
        timestamp: new Date().toISOString()
      });
      console.log(`[NETWORK RESPONSE] ${response.status()} ${response.url()}`);
    }
  });
  
  console.log('🚀 Iniciando teste de persistência do perfil...');
  
  try {
    // 1. Acessar a página de perfil
    console.log('\n1. 📄 Navegando para http://localhost:3010/profile');
    await page.goto('http://localhost:3010/profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 2. Verificar se a página carregou corretamente
    const title = await page.textContent('h1, h2, [data-testid="page-title"]').catch(() => 'Título não encontrado');
    console.log(`   ✅ Página carregada. Título: ${title}`);
    
    // 3. Verificar estado inicial do localStorage
    const initialLocalStorage = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const data = {};
      keys.forEach(key => {
        if (key.includes('profile') || key.includes('draft')) {
          data[key] = localStorage.getItem(key);
        }
      });
      return data;
    });
    console.log('   📱 Estado inicial do localStorage:', initialLocalStorage);
    
    // 4. Localizar campos do formulário (tentando diferentes seletores)
    const nameSelectors = ['[name="name"]', '[data-testid="name-input"]', 'input[placeholder*="nome" i]', 'input[id*="name"]'];
    let nameInput = null;
    
    for (const selector of nameSelectors) {
      try {
        nameInput = await page.locator(selector).first();
        if (await nameInput.isVisible()) {
          console.log(`   ✅ Campo nome encontrado com seletor: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!nameInput || !(await nameInput.isVisible().catch(() => false))) {
      // Listar todos os inputs disponíveis
      const inputs = await page.locator('input').all();
      console.log(`   📝 ${inputs.length} inputs encontrados na página`);
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const name = await input.getAttribute('name').catch(() => '');
        const placeholder = await input.getAttribute('placeholder').catch(() => '');
        const id = await input.getAttribute('id').catch(() => '');
        const type = await input.getAttribute('type').catch(() => '');
        console.log(`      Input ${i}: name="${name}" placeholder="${placeholder}" id="${id}" type="${type}"`);
      }
    }
    
    // 5. Preencher formulário se encontrarmos os campos
    if (nameInput && await nameInput.isVisible()) {
      console.log('\n2. ✏️ Preenchendo formulário...');
      
      const testData = {
        name: 'João Silva Teste',
        email: 'joao.teste@example.com',
        phone: '(11) 99999-9999'
      };
      
      // Preencher nome
      await nameInput.fill(testData.name);
      console.log(`   ✅ Nome preenchido: ${testData.name}`);
      
      // Tentar preencher email
      try {
        const emailInput = page.locator('[name="email"], [type="email"], input[placeholder*="email" i]').first();
        if (await emailInput.isVisible()) {
          await emailInput.fill(testData.email);
          console.log(`   ✅ Email preenchido: ${testData.email}`);
        }
      } catch (e) {
        console.log('   ⚠️ Campo email não encontrado');
      }
      
      // Tentar preencher telefone
      try {
        const phoneInput = page.locator('[name="phone"], [name="telefone"], input[placeholder*="telefone" i], input[placeholder*="phone" i]').first();
        if (await phoneInput.isVisible()) {
          await phoneInput.fill(testData.phone);
          console.log(`   ✅ Telefone preenchido: ${testData.phone}`);
        }
      } catch (e) {
        console.log('   ⚠️ Campo telefone não encontrado');
      }
      
      // 6. Aguardar auto-save
      console.log('\n3. ⏳ Aguardando auto-save (5 segundos)...');
      await page.waitForTimeout(5000);
      
      // Verificar indicadores visuais de salvamento
      const savingIndicators = await page.locator('text=/salvando/i, text=/saving/i, [class*="saving"], [data-testid*="saving"]').all();
      if (savingIndicators.length > 0) {
        console.log('   ✅ Indicador de salvamento encontrado');
      } else {
        console.log('   ⚠️ Nenhum indicador visual de salvamento encontrado');
      }
      
      // 7. Verificar localStorage após preenchimento
      const postFillLocalStorage = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const data = {};
        keys.forEach(key => {
          if (key.includes('profile') || key.includes('draft')) {
            data[key] = localStorage.getItem(key);
          }
        });
        return data;
      });
      console.log('   📱 localStorage após preenchimento:', postFillLocalStorage);
      
      // 8. Testar navegação entre steps (se houver)
      console.log('\n4. 🔄 Testando navegação entre steps...');
      const nextButtons = await page.locator('button:has-text("Próximo"), button:has-text("Next"), [data-testid*="next"]').all();
      
      if (nextButtons.length > 0) {
        console.log('   ✅ Botão "Próximo" encontrado');
        await nextButtons[0].click();
        await page.waitForTimeout(2000);
        
        // Tentar voltar
        const backButtons = await page.locator('button:has-text("Anterior"), button:has-text("Back"), button:has-text("Voltar"), [data-testid*="back"]').all();
        if (backButtons.length > 0) {
          console.log('   ✅ Voltando para step anterior');
          await backButtons[0].click();
          await page.waitForTimeout(2000);
          
          // Verificar se os dados ainda estão lá
          const currentName = await nameInput.inputValue();
          console.log(`   📝 Nome após voltar: "${currentName}"`);
          if (currentName === testData.name) {
            console.log('   ✅ SUCESSO: Dados persistiram na navegação entre steps');
          } else {
            console.log('   ❌ PROBLEMA: Dados perdidos na navegação entre steps');
          }
        }
      } else {
        console.log('   ⚠️ Nenhum botão de navegação encontrado');
      }
      
      // 9. Testar reload da página
      console.log('\n5. 🔄 Testando persistência após reload...');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Verificar se os dados foram recarregados
      const nameInputAfterReload = page.locator(nameSelectors[0]).first();
      if (await nameInputAfterReload.isVisible()) {
        const reloadedName = await nameInputAfterReload.inputValue();
        console.log(`   📝 Nome após reload: "${reloadedName}"`);
        if (reloadedName === testData.name) {
          console.log('   ✅ SUCESSO: Dados persistiram após reload');
        } else {
          console.log('   ❌ PROBLEMA: Dados perdidos após reload');
        }
      }
    } else {
      console.log('   ❌ Não foi possível encontrar campos de formulário para testar');
    }
    
    // 10. Capturar estado final
    console.log('\n6. 📊 Relatório Final:');
    console.log(`   📞 Total de chamadas de rede: ${networkCalls.length}`);
    console.log(`   💬 Total de logs do console: ${consoleLogs.length}`);
    
    // Verificar chamadas específicas para profile
    const profileCalls = networkCalls.filter(call => call.url.includes('/profile'));
    console.log(`   🔗 Chamadas relacionadas ao perfil: ${profileCalls.length}`);
    
    profileCalls.forEach(call => {
      if (call.type === 'request') {
        console.log(`      → ${call.method} ${call.url}`);
      } else {
        console.log(`      ← ${call.status} ${call.url}`);
      }
    });
    
    // Verificar se houve chamadas PUT/POST
    const updateCalls = networkCalls.filter(call => 
      call.type === 'request' && 
      (call.method === 'PUT' || call.method === 'POST') && 
      call.url.includes('/profile')
    );
    console.log(`   ✏️ Chamadas de atualização (PUT/POST): ${updateCalls.length}`);
    
    // Logs de erro
    const errorLogs = consoleLogs.filter(log => log.type === 'error');
    if (errorLogs.length > 0) {
      console.log(`   ❌ Erros no console: ${errorLogs.length}`);
      errorLogs.forEach(log => console.log(`      ${log.text}`));
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    console.log('\n🏁 Teste concluído. Fechando navegador em 10 segundos...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// Executar o teste
testProfilePersistence().catch(console.error);