import { test, expect } from '@playwright/test';

// Configurações do teste
const TEST_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  testData: {
    name: 'João Silva',
    email: 'joao.silva@teste.com',
    phone: '(11) 99999-9999',
    location: 'São Paulo, SP',
    title: 'Desenvolvedor Full Stack',
    summary: 'Desenvolvedor experiente com foco em tecnologias web modernas.'
  }
};

test.describe('Teste do Fluxo de Salvamento do Formulário de Perfil', () => {
  let networkRequests = [];
  let consoleMessages = [];
  let storageData = {};

  test.beforeEach(async ({ page }) => {
    // Capturar requests de rede
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
        timestamp: new Date().toISOString()
      });
    });

    // Capturar responses de rede
    page.on('response', response => {
      const request = networkRequests.find(req => req.url === response.url());
      if (request) {
        request.status = response.status();
        request.statusText = response.statusText();
      }
    });

    // Capturar logs do console
    page.on('console', message => {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
        timestamp: new Date().toISOString()
      });
    });

    // Reset arrays para cada teste
    networkRequests = [];
    consoleMessages = [];
    storageData = {};
  });

  test('Deve navegar até o formulário de perfil', async ({ page }) => {
    console.log('🚀 Iniciando teste de navegação...');
    
    try {
      // Tentar acessar a página principal
      await page.goto(TEST_CONFIG.baseURL, { waitUntil: 'networkidle' });
      
      // Verificar se a página carregou
      await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
      
      // Capturar screenshot da página inicial
      await page.screenshot({ path: 'D:\\carreira pro\\screenshots\\homepage.png', fullPage: true });
      
      console.log('✅ Página inicial carregada com sucesso');
      
      // Tentar navegar para o perfil
      const profileURL = `${TEST_CONFIG.baseURL}/profile`;
      await page.goto(profileURL, { waitUntil: 'networkidle' });
      
      // Verificar se chegou na página de perfil
      const currentURL = page.url();
      console.log(`📍 URL atual: ${currentURL}`);
      
      // Capturar screenshot da página de perfil
      await page.screenshot({ path: 'D:\\carreira pro\\screenshots\\profile-page.png', fullPage: true });
      
      // Verificar se há formulários na página
      const forms = await page.locator('form').count();
      console.log(`📝 Formulários encontrados: ${forms}`);
      
      // Verificar se há inputs na página
      const inputs = await page.locator('input').count();
      console.log(`📝 Inputs encontrados: ${inputs}`);
      
    } catch (error) {
      console.error('❌ Erro na navegação:', error.message);
      
      // Capturar screenshot do erro
      await page.screenshot({ path: 'D:\\carreira pro\\screenshots\\error-navigation.png', fullPage: true });
      
      throw error;
    }
  });

  test('Deve testar o preenchimento e salvamento do formulário', async ({ page }) => {
    console.log('🚀 Iniciando teste de preenchimento...');
    
    try {
      // Navegar para a página de perfil
      await page.goto(`${TEST_CONFIG.baseURL}/profile`, { waitUntil: 'networkidle' });
      
      // Aguardar a página carregar completamente
      await page.waitForTimeout(2000);
      
      // Verificar se há elementos de formulário
      const formFields = await page.locator('input, textarea, select').count();
      console.log(`📝 Campos de formulário encontrados: ${formFields}`);
      
      if (formFields === 0) {
        console.log('⚠️ Nenhum campo de formulário encontrado, verificando estrutura da página...');
        
        // Verificar conteúdo da página
        const pageContent = await page.textContent('body');
        console.log('📄 Conteúdo da página (primeiros 500 caracteres):', pageContent?.substring(0, 500));
        
        // Verificar se há elementos específicos do ProfileWizard
        const wizardElements = await page.locator('[class*="wizard"], [class*="profile"], [data-testid*="profile"]').count();
        console.log(`🧙 Elementos do wizard encontrados: ${wizardElements}`);
        
        return;
      }
      
      // Tentar preencher campos comuns
      const testData = TEST_CONFIG.testData;
      
      // Procurar e preencher campo de nome
      const nameInput = page.locator('input[name*="name"], input[placeholder*="nome"], input[type="text"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(testData.name);
        console.log('✅ Campo nome preenchido');
      }
      
      // Procurar e preencher campo de email
      const emailInput = page.locator('input[name*="email"], input[type="email"], input[placeholder*="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill(testData.email);
        console.log('✅ Campo email preenchido');
      }
      
      // Procurar e preencher campo de telefone
      const phoneInput = page.locator('input[name*="phone"], input[name*="telefone"], input[placeholder*="telefone"]').first();
      if (await phoneInput.count() > 0) {
        await phoneInput.fill(testData.phone);
        console.log('✅ Campo telefone preenchido');
      }
      
      // Aguardar possível auto-save
      console.log('⏱️ Aguardando auto-save...');
      await page.waitForTimeout(3000);
      
      // Verificar localStorage
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
      
      console.log('💾 Dados no localStorage:', JSON.stringify(localStorageData, null, 2));
      
      // Procurar botões de ação (Salvar, Próximo, etc.)
      const actionButtons = await page.locator('button:has-text("Salvar"), button:has-text("Próximo"), button:has-text("Save"), button:has-text("Next")').count();
      console.log(`🔘 Botões de ação encontrados: ${actionButtons}`);
      
      if (actionButtons > 0) {
        const saveButton = page.locator('button:has-text("Salvar"), button:has-text("Próximo"), button:has-text("Save"), button:has-text("Next")').first();
        await saveButton.click();
        console.log('✅ Botão de salvamento clicado');
        
        // Aguardar response da API
        await page.waitForTimeout(2000);
      }
      
      // Capturar screenshot após preenchimento
      await page.screenshot({ path: 'D:\\carreira pro\\screenshots\\form-filled.png', fullPage: true });
      
    } catch (error) {
      console.error('❌ Erro no preenchimento:', error.message);
      await page.screenshot({ path: 'D:\\carreira pro\\screenshots\\error-filling.png', fullPage: true });
      throw error;
    }
  });

  test('Deve analisar requisições de rede e erros', async ({ page }) => {
    console.log('🔍 Iniciando análise de rede...');
    
    try {
      await page.goto(`${TEST_CONFIG.baseURL}/profile`, { waitUntil: 'networkidle' });
      
      // Simular interação com formulário
      await page.waitForTimeout(1000);
      
      // Tentar preencher qualquer input disponível
      const inputs = page.locator('input').first();
      if (await inputs.count() > 0) {
        await inputs.fill('teste');
        await page.waitForTimeout(3000); // Aguardar auto-save
      }
      
      // Análise de requisições
      console.log('\n📡 ANÁLISE DE REQUISIÇÕES:');
      
      const apiRequests = networkRequests.filter(req => 
        req.url.includes('/api/') || 
        req.method !== 'GET' || 
        req.url.includes('profile')
      );
      
      if (apiRequests.length === 0) {
        console.log('⚠️ Nenhuma requisição de API detectada');
      } else {
        apiRequests.forEach((req, index) => {
          console.log(`\n📤 Requisição ${index + 1}:`);
          console.log(`   URL: ${req.url}`);
          console.log(`   Método: ${req.method}`);
          console.log(`   Status: ${req.status || 'Pendente'}`);
          console.log(`   Dados: ${req.postData || 'N/A'}`);
        });
      }
      
      // Análise de logs do console
      console.log('\n📋 ANÁLISE DE CONSOLE:');
      
      const errorLogs = consoleMessages.filter(msg => msg.type === 'error');
      const warnLogs = consoleMessages.filter(msg => msg.type === 'warning');
      
      if (errorLogs.length > 0) {
        console.log('❌ ERROS ENCONTRADOS:');
        errorLogs.forEach((log, index) => {
          console.log(`   ${index + 1}. ${log.text}`);
        });
      }
      
      if (warnLogs.length > 0) {
        console.log('⚠️ WARNINGS ENCONTRADOS:');
        warnLogs.forEach((log, index) => {
          console.log(`   ${index + 1}. ${log.text}`);
        });
      }
      
      if (errorLogs.length === 0 && warnLogs.length === 0) {
        console.log('✅ Nenhum erro ou warning detectado no console');
      }
      
    } catch (error) {
      console.error('❌ Erro na análise:', error.message);
      throw error;
    }
  });

  test('Deve verificar persistência de dados', async ({ page }) => {
    console.log('💾 Testando persistência de dados...');
    
    try {
      await page.goto(`${TEST_CONFIG.baseURL}/profile`, { waitUntil: 'networkidle' });
      
      // Preencher dados de teste
      const testData = { name: 'Teste Persistência', email: 'teste@persistencia.com' };
      
      // Preencher campos se existirem
      const nameInput = page.locator('input').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(testData.name);
        await page.waitForTimeout(3000); // Aguardar auto-save
      }
      
      // Capturar estado inicial do localStorage
      const initialStorage = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });
      
      console.log('💾 Estado inicial do localStorage:', JSON.stringify(initialStorage, null, 2));
      
      // Recarregar a página
      await page.reload({ waitUntil: 'networkidle' });
      
      // Verificar se os dados persistiram
      const afterReloadStorage = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });
      
      console.log('💾 Estado após reload do localStorage:', JSON.stringify(afterReloadStorage, null, 2));
      
      // Verificar se campos foram preenchidos novamente
      const nameField = page.locator('input').first();
      if (await nameField.count() > 0) {
        const currentValue = await nameField.inputValue();
        console.log(`📝 Valor atual do campo: "${currentValue}"`);
        
        if (currentValue === testData.name) {
          console.log('✅ Dados persistiram corretamente');
        } else if (currentValue === '') {
          console.log('❌ Dados não persistiram - campo vazio');
        } else {
          console.log(`⚠️ Dados diferentes - esperado: "${testData.name}", atual: "${currentValue}"`);
        }
      }
      
    } catch (error) {
      console.error('❌ Erro no teste de persistência:', error.message);
      throw error;
    }
  });

  test.afterEach(async () => {
    // Log de resumo após cada teste
    console.log('\n📊 RESUMO DO TESTE:');
    console.log(`📡 Total de requests: ${networkRequests.length}`);
    console.log(`📋 Total de logs: ${consoleMessages.length}`);
    console.log(`❌ Erros de console: ${consoleMessages.filter(m => m.type === 'error').length}`);
    console.log(`⚠️ Warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`);
  });
});