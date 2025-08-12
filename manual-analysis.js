const { chromium } = require('@playwright/test');

async function analyzeProfileForm() {
  console.log('🚀 Iniciando análise manual do formulário de perfil...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Arrays para capturar dados
  const networkRequests = [];
  const consoleMessages = [];
  let hasErrors = false;
  
  // Interceptar requisições de rede
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData(),
      timestamp: new Date().toISOString()
    });
  });
  
  // Interceptar responses
  page.on('response', async response => {
    const request = networkRequests.find(req => req.url === response.url());
    if (request) {
      request.status = response.status();
      request.statusText = response.statusText();
      
      // Se for uma API de perfil, capturar o body
      if (request.url.includes('/api/') && (request.url.includes('profile') || request.url.includes('user'))) {
        try {
          const responseBody = await response.text();
          request.responseBody = responseBody;
        } catch (error) {
          request.responseError = error.message;
        }
      }
    }
  });
  
  // Interceptar logs do console
  page.on('console', message => {
    const logEntry = {
      type: message.type(),
      text: message.text(),
      timestamp: new Date().toISOString()
    };
    
    consoleMessages.push(logEntry);
    
    if (message.type() === 'error') {
      hasErrors = true;
      console.error('❌ Console Error:', message.text());
    } else if (message.type() === 'warning') {
      console.warn('⚠️ Console Warning:', message.text());
    }
  });
  
  try {
    console.log('📍 Navegando para localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('✅ Página carregada, capturando screenshot...');
    await page.screenshot({ path: 'screenshots/homepage-analysis.png', fullPage: true });
    
    // Verificar se há redirecionamento ou login necessário
    const currentUrl = page.url();
    console.log(`📍 URL atual: ${currentUrl}`);
    
    if (currentUrl.includes('login')) {
      console.log('🔐 Página de login detectada');
      
      // Tentar fazer login automático se possível
      const emailInput = await page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = await page.locator('input[type="password"], input[name="password"]').first();
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        console.log('📝 Tentando login automático...');
        await emailInput.fill('test@exemplo.com');
        await passwordInput.fill('senha123');
        
        const loginButton = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first();
        if (await loginButton.count() > 0) {
          await loginButton.click();
          await page.waitForTimeout(3000);
        }
      }
    }
    
    // Navegar para a página de perfil
    console.log('📍 Navegando para /profile...');
    try {
      await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle', timeout: 15000 });
    } catch (error) {
      console.log('⚠️ Erro ao navegar para /profile:', error.message);
    }
    
    await page.screenshot({ path: 'screenshots/profile-page-analysis.png', fullPage: true });
    
    console.log('🔍 Analisando elementos da página...');
    
    // Analisar estrutura da página
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasProfileWizard: !!document.querySelector('[data-testid*="wizard"], [class*="wizard"], [class*="profile-wizard"]'),
        formsCount: document.querySelectorAll('form').length,
        inputsCount: document.querySelectorAll('input').length,
        buttonsCount: document.querySelectorAll('button').length,
        hasAutoSave: !!document.querySelector('[data-testid*="autosave"], [class*="autosave"]'),
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
        formFields: Array.from(document.querySelectorAll('input, textarea, select')).map(field => ({
          type: field.type || field.tagName.toLowerCase(),
          name: field.name,
          placeholder: field.placeholder,
          id: field.id,
          required: field.required
        }))
      };
    });
    
    console.log('\n📊 ESTRUTURA DA PÁGINA:');
    console.log(`   Título: ${pageContent.title}`);
    console.log(`   URL: ${pageContent.url}`);
    console.log(`   Formulários: ${pageContent.formsCount}`);
    console.log(`   Campos de entrada: ${pageContent.inputsCount}`);
    console.log(`   Botões: ${pageContent.buttonsCount}`);
    console.log(`   Tem Wizard: ${pageContent.hasProfileWizard}`);
    console.log(`   Cabeçalhos: ${JSON.stringify(pageContent.headings)}`);
    
    if (pageContent.formFields.length > 0) {
      console.log('\n📝 CAMPOS DO FORMULÁRIO:');
      pageContent.formFields.forEach((field, index) => {
        console.log(`   ${index + 1}. Tipo: ${field.type}, Nome: ${field.name || 'N/A'}, Placeholder: ${field.placeholder || 'N/A'}`);
      });
    }
    
    // Testar preenchimento de formulário se existir
    if (pageContent.inputsCount > 0) {
      console.log('\n🖊️ TESTANDO PREENCHIMENTO DO FORMULÁRIO...');
      
      const testData = {
        name: 'João da Silva Teste',
        email: 'joao.teste@exemplo.com',
        phone: '(11) 99999-9999'
      };
      
      // Tentar preencher campos por tipo
      try {
        const nameFields = page.locator('input[name*="name"], input[placeholder*="nome"], input[placeholder*="Nome"], input[type="text"]').first();
        if (await nameFields.count() > 0) {
          await nameFields.fill(testData.name);
          console.log('✅ Campo nome preenchido');
          await page.waitForTimeout(1000);
        }
        
        const emailFields = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]').first();
        if (await emailFields.count() > 0) {
          await emailFields.fill(testData.email);
          console.log('✅ Campo email preenchido');
          await page.waitForTimeout(1000);
        }
        
        const phoneFields = page.locator('input[name*="phone"], input[name*="telefone"], input[placeholder*="telefone"], input[placeholder*="phone"]').first();
        if (await phoneFields.count() > 0) {
          await phoneFields.fill(testData.phone);
          console.log('✅ Campo telefone preenchido');
          await page.waitForTimeout(1000);
        }
        
        console.log('⏳ Aguardando auto-save (5 segundos)...');
        await page.waitForTimeout(5000);
        
        // Verificar localStorage após preenchimento
        const localStorageAfterFill = await page.evaluate(() => {
          const data = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
              data[key] = localStorage.getItem(key);
            }
          }
          return data;
        });
        
        console.log('\n💾 LOCALSTORAGE APÓS PREENCHIMENTO:');
        console.log(JSON.stringify(localStorageAfterFill, null, 2));
        
        // Procurar botão de salvar/próximo
        const saveButtons = page.locator('button:has-text("Salvar"), button:has-text("Próximo"), button:has-text("Save"), button:has-text("Next"), button[type="submit"]');
        const saveButtonCount = await saveButtons.count();
        
        if (saveButtonCount > 0) {
          console.log(`🔘 Encontrados ${saveButtonCount} botões de ação`);
          
          // Clicar no primeiro botão
          const firstButton = saveButtons.first();
          const buttonText = await firstButton.textContent();
          console.log(`🔘 Clicando no botão: "${buttonText}"`);
          
          await firstButton.click();
          
          console.log('⏳ Aguardando resposta da API...');
          await page.waitForTimeout(3000);
        }
        
        await page.screenshot({ path: 'screenshots/form-filled-analysis.png', fullPage: true });
        
      } catch (fillError) {
        console.error('❌ Erro durante preenchimento:', fillError.message);
      }
    }
    
    // Análise final de localStorage
    const finalLocalStorage = await page.evaluate(() => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key);
        }
      }
      return data;
    });
    
    console.log('\n💾 LOCALSTORAGE FINAL:');
    console.log(JSON.stringify(finalLocalStorage, null, 2));
    
    // Aguardar um pouco mais para capturar todas as requisições
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.error('❌ Erro durante análise:', error.message);
    hasErrors = true;
    
    try {
      await page.screenshot({ path: 'screenshots/error-analysis.png', fullPage: true });
    } catch (screenshotError) {
      console.error('❌ Erro ao capturar screenshot:', screenshotError.message);
    }
  }
  
  // RELATÓRIO FINAL
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO FINAL DE ANÁLISE');
  console.log('='.repeat(60));
  
  // Análise de requisições de API
  const apiRequests = networkRequests.filter(req => 
    req.url.includes('/api/') || 
    (req.method !== 'GET' && !req.url.includes('.js') && !req.url.includes('.css'))
  );
  
  console.log('\n🌐 REQUISIÇÕES DE API:');
  if (apiRequests.length === 0) {
    console.log('   ❌ PROBLEMA: Nenhuma requisição de API detectada durante o teste');
    console.log('   💡 CAUSA PROVÁVEL: Auto-save não está funcionando ou não há integração com API');
  } else {
    apiRequests.forEach((req, index) => {
      console.log(`\n   📤 Requisição ${index + 1}:`);
      console.log(`      URL: ${req.url}`);
      console.log(`      Método: ${req.method}`);
      console.log(`      Status: ${req.status || 'Sem resposta'}`);
      if (req.postData) {
        console.log(`      Dados enviados: ${req.postData.substring(0, 200)}${req.postData.length > 200 ? '...' : ''}`);
      }
      if (req.responseBody) {
        console.log(`      Resposta: ${req.responseBody.substring(0, 200)}${req.responseBody.length > 200 ? '...' : ''}`);
      }
      if (req.responseError) {
        console.log(`      ❌ Erro na resposta: ${req.responseError}`);
      }
    });
  }
  
  // Análise de erros
  const errors = consoleMessages.filter(msg => msg.type === 'error');
  const warnings = consoleMessages.filter(msg => msg.type === 'warning');
  
  console.log('\n🐛 ERROS E WARNINGS:');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('   ✅ Nenhum erro ou warning detectado no console');
  } else {
    if (errors.length > 0) {
      console.log('\n   ❌ ERROS CRÍTICOS:');
      errors.forEach((error, index) => {
        console.log(`      ${index + 1}. ${error.text}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n   ⚠️ WARNINGS:');
      warnings.forEach((warning, index) => {
        console.log(`      ${index + 1}. ${warning.text}`);
      });
    }
  }
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  
  if (apiRequests.length === 0) {
    console.log('   1. ❌ CRÍTICO: Implementar integração com API para salvamento de dados');
    console.log('   2. 🔍 Verificar se o hook useAutoSave está sendo chamado corretamente');
    console.log('   3. 🔍 Verificar se há endpoints de API configurados para perfil');
  }
  
  if (errors.length > 0) {
    console.log('   4. ❌ CRÍTICO: Corrigir erros JavaScript listados acima');
  }
  
  console.log('   5. 🧪 Implementar testes automatizados para validação contínua');
  console.log('   6. 📊 Adicionar logging detalhado para debug em produção');
  console.log('   7. ⚡ Implementar feedback visual mais claro durante salvamento');
  
  console.log('\n' + '='.repeat(60));
  
  await browser.close();
}

// Executar análise
analyzeProfileForm().catch(console.error);