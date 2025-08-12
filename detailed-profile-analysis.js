const { chromium } = require('@playwright/test');

async function detailedAnalysis() {
  console.log('🔍 ANÁLISE DETALHADA DO PROBLEMA DE SALVAMENTO');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const problems = [];
  const solutions = [];
  const networkRequests = [];
  let hasAuthenticationIssue = false;
  
  // Interceptar todas as requisições
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      headers: Object.fromEntries(Object.entries(request.headers())),
      postData: request.postData(),
      timestamp: new Date().toISOString()
    });
  });

  page.on('response', async response => {
    const request = networkRequests.find(req => req.url === response.url());
    if (request) {
      request.status = response.status();
      request.statusText = response.statusText();
      
      // Analisar erros específicos
      if (response.status() === 401) {
        hasAuthenticationIssue = true;
        problems.push('AUTENTICAÇÃO: Token inválido ou expirado');
        solutions.push('Implementar refresh automático de token ou redirecionamento para login');
      }
      
      if (response.status() >= 500) {
        problems.push(`SERVIDOR: Erro ${response.status()} - ${response.statusText()}`);
        solutions.push('Verificar logs do servidor backend');
      }
      
      if (response.status() === 404 && response.url().includes('/api/')) {
        problems.push(`API: Endpoint não encontrado - ${response.url()}`);
        solutions.push('Verificar se o backend está rodando e se a rota existe');
      }
    }
  });

  // Interceptar erros de console
  page.on('console', message => {
    if (message.type() === 'error') {
      const text = message.text();
      
      if (text.includes('Failed to fetch') || text.includes('NetworkError')) {
        problems.push('REDE: Falha na comunicação com API');
        solutions.push('Verificar se backend está rodando na porta correta');
      }
      
      if (text.includes('localStorage') || text.includes('Storage')) {
        problems.push('STORAGE: Problemas com localStorage');
        solutions.push('Verificar permissões de armazenamento local');
      }
      
      if (text.includes('auto-save') || text.includes('autosave')) {
        problems.push('AUTO-SAVE: Falha no salvamento automático');
        solutions.push('Verificar implementação do hook useAutoSave');
      }
    }
  });

  try {
    console.log('\n📍 ETAPA 1: Navegação e autenticação');
    console.log('-'.repeat(40));
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Simular token de autenticação válido
    await page.evaluate(() => {
      localStorage.setItem('cp_token', 'fake-token-for-testing');
      localStorage.setItem('cp_refresh', 'fake-refresh-token');
    });
    
    console.log('✓ Token de teste adicionado');
    
    // Ir para página de perfil
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle' });
    
    // Aguardar componente carregar
    await page.waitForTimeout(2000);
    
    console.log('\n📍 ETAPA 2: Análise da interface');
    console.log('-'.repeat(40));
    
    // Verificar se o wizard carregou
    const wizardElements = {
      profileWizard: await page.locator('[data-testid*="wizard"], .wizard, [class*="profile"]').count(),
      forms: await page.locator('form').count(),
      inputs: await page.locator('input, textarea, select').count(),
      buttons: await page.locator('button').count()
    };
    
    console.log(`📝 Wizard encontrado: ${wizardElements.profileWizard > 0 ? 'SIM' : 'NÃO'}`);
    console.log(`📝 Formulários: ${wizardElements.forms}`);
    console.log(`📝 Campos: ${wizardElements.inputs}`);
    console.log(`📝 Botões: ${wizardElements.buttons}`);
    
    if (wizardElements.inputs === 0) {
      problems.push('INTERFACE: Nenhum campo de formulário encontrado');
      solutions.push('Verificar se ProfileWizard está renderizando corretamente');
      solutions.push('Verificar se há problemas de autenticação impedindo renderização');
    }
    
    // Capturar screenshot da situação atual
    await page.screenshot({ path: 'screenshots/detailed-analysis.png', fullPage: true });
    
    console.log('\n📍 ETAPA 3: Teste de preenchimento');
    console.log('-'.repeat(40));
    
    if (wizardElements.inputs > 0) {
      // Testar preenchimento
      const testData = {
        name: 'João Silva Teste Detalhado',
        email: 'joao@teste-detalhado.com'
      };
      
      // Tentar encontrar campo de nome
      const nameField = page.locator('input[name*="name"], input[placeholder*="nome"], input[type="text"]').first();
      if (await nameField.count() > 0) {
        await nameField.fill(testData.name);
        console.log('✓ Campo nome preenchido');
        
        // Aguardar auto-save
        await page.waitForTimeout(3000);
      }
      
      // Verificar localStorage depois do preenchimento
      const storageAfterFill = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('draft')) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });
      
      console.log('💾 Drafts no localStorage:', Object.keys(storageAfterFill).length);
      
      if (Object.keys(storageAfterFill).length > 0) {
        console.log('✓ Draft salvo localmente');
      } else {
        problems.push('DRAFT: Dados não estão sendo salvos no localStorage');
        solutions.push('Verificar implementação do useAutoSave - função saveToStorage');
      }
    }
    
    console.log('\n📍 ETAPA 4: Análise de rede');
    console.log('-'.repeat(40));
    
    // Aguardar mais requisições
    await page.waitForTimeout(2000);
    
    const apiCalls = networkRequests.filter(req => 
      req.url.includes('/api/') || req.url.includes('55311')
    );
    
    console.log(`🌐 Requisições de API: ${apiCalls.length}`);
    
    if (apiCalls.length === 0) {
      problems.push('CRÍTICO: Nenhuma chamada de API detectada');
      solutions.push('Backend não está rodando ou configuração de API_BASE está incorreta');
      solutions.push('Verificar se processo backend está ativo na porta 55311');
    } else {
      apiCalls.forEach((req, i) => {
        console.log(`📤 ${i + 1}. ${req.method} ${req.url} - Status: ${req.status || 'Pendente'}`);
        if (req.status && req.status >= 400) {
          problems.push(`API: ${req.method} ${req.url} retornou ${req.status}`);
        }
      });
    }
    
  } catch (error) {
    problems.push(`EXECUÇÃO: ${error.message}`);
    solutions.push('Verificar se servidor frontend está rodando');
  }
  
  // DIAGNÓSTICO FINAL
  console.log('\n' + '='.repeat(60));
  console.log('🏥 DIAGNÓSTICO FINAL');
  console.log('='.repeat(60));
  
  if (problems.length === 0) {
    console.log('✅ Nenhum problema crítico detectado');
  } else {
    console.log('❌ PROBLEMAS IDENTIFICADOS:');
    problems.forEach((problem, i) => {
      console.log(`   ${i + 1}. ${problem}`);
    });
  }
  
  console.log('\n💡 SOLUÇÕES RECOMENDADAS:');
  solutions.forEach((solution, i) => {
    console.log(`   ${i + 1}. ${solution}`);
  });
  
  // ANÁLISE DA CAUSA RAIZ
  console.log('\n🎯 CAUSA RAIZ PROVÁVEL:');
  
  if (apiCalls.length === 0) {
    console.log('   ❌ BACKEND NÃO ESTÁ RODANDO');
    console.log('   📋 Ação: Iniciar servidor backend na porta 55311');
    console.log('   📋 Comando: cd apps/backend && npm run dev');
  } else if (hasAuthenticationIssue) {
    console.log('   ❌ PROBLEMA DE AUTENTICAÇÃO');
    console.log('   📋 Ação: Implementar sistema de login funcional');
  } else if (problems.some(p => p.includes('INTERFACE'))) {
    console.log('   ❌ PROBLEMA DE RENDERIZAÇÃO');
    console.log('   📋 Ação: Verificar componente ProfileWizard');
  } else {
    console.log('   ⚠️ PROBLEMA COMPLEXO');
    console.log('   📋 Ação: Análise detalhada dos logs de rede');
  }
  
  console.log('\n📊 PRÓXIMOS PASSOS:');
  console.log('   1. ✅ Iniciar servidor backend (porta 55311)');
  console.log('   2. ✅ Configurar autenticação válida');
  console.log('   3. ✅ Testar salvamento manual primeiro');
  console.log('   4. ✅ Depois testar auto-save');
  console.log('   5. ✅ Implementar tratamento de erros mais robusto');
  
  await browser.close();
}

detailedAnalysis().catch(console.error);