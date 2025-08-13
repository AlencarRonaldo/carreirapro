#!/usr/bin/env node

/**
 * Script de teste manual para validar importação LinkedIn
 * Execute: node test-linkedin-import.js
 */

const axios = require('axios');

// Configurações
const BASE_URL = 'http://localhost:3001';
const TEST_URL = 'https://www.linkedin.com/in/ronaldo-pereira-de-alencar-carvalho-487bb222a';

async function testLinkedInImport() {
  console.log('🔧 Testing LinkedIn Import Integration');
  console.log('=====================================\n');

  try {
    // Test 1: Verificar configuração
    console.log('1️⃣  Testing Configuration...');
    const configResponse = await axios.get(`${BASE_URL}/debug/linkedin-test/config`);
    console.log('✅ Configuration:', JSON.stringify(configResponse.data, null, 2));
    console.log('');

    // Test 1.5: Validar input format
    console.log('1️⃣ .5 Validating Input Format...');
    const inputValidation = await axios.post(`${BASE_URL}/debug/linkedin-test/validate-input`, {
      url: TEST_URL
    });
    console.log('✅ Input Validation:', JSON.stringify(inputValidation.data, null, 2));
    console.log('');

    // Test 2: Executar diagnóstico
    console.log('2️⃣  Running Diagnostic Logs...');
    const debugResponse = await axios.post(`${BASE_URL}/debug/linkedin-test/debug-logs`, {
      url: TEST_URL
    });
    
    if (debugResponse.data.success) {
      console.log('✅ Diagnostic successful');
      console.log('📊 Results:', JSON.stringify(debugResponse.data, null, 2));
    } else {
      console.log('❌ Diagnostic failed');
      console.log('📊 Error:', JSON.stringify(debugResponse.data, null, 2));
    }
    console.log('');

    // Test 3: Teste completo (se diagnóstico passou)
    if (debugResponse.data.success) {
      console.log('3️⃣  Running Full Integration Test...');
      const fullTestResponse = await axios.post(`${BASE_URL}/debug/linkedin-test/run`, {
        url: TEST_URL,
        overwrite: true,
        testMode: 'full'
      });

      console.log('📊 Full Test Results:');
      console.log(`   Success: ${fullTestResponse.data.success}`);
      console.log(`   Summary: ${fullTestResponse.data.summary}`);
      console.log(`   Duration: ${fullTestResponse.data.totalDuration}ms`);
      console.log(`   Steps: ${fullTestResponse.data.steps.length}`);

      fullTestResponse.data.steps.forEach((step, index) => {
        const icon = step.status === 'success' ? '✅' : step.status === 'error' ? '❌' : '⏳';
        console.log(`   ${icon} Step ${index + 1}: ${step.name} (${step.duration || 0}ms)`);
        if (step.status === 'error') {
          console.log(`       Error: ${step.error.message}`);
        }
      });

      if (fullTestResponse.data.mappedData) {
        console.log('\n📋 Mapped Data Summary:');
        const summary = fullTestResponse.data.mappedData.summary;
        console.log(`   Profile fields: ${summary.profileFields}`);
        console.log(`   Experiences: ${summary.experienceCount}`);
        console.log(`   Education: ${summary.educationCount}`);
        console.log(`   Skills: ${summary.skillsCount}`);
      }

    } else {
      console.log('3️⃣  Skipping full test due to diagnostic failure');
    }

    // Test 4: Teste apenas do Apify (se diagnóstico passou)
    if (debugResponse.data.success) {
      console.log('\n4️⃣  Running Apify-Only Test...');
      const apifyTestResponse = await axios.post(`${BASE_URL}/debug/linkedin-test/run`, {
        url: TEST_URL,
        testMode: 'apify-only'
      });

      console.log('📊 Apify Test Results:');
      console.log(`   Success: ${apifyTestResponse.data.success}`);
      console.log(`   Summary: ${apifyTestResponse.data.summary}`);
      
      if (apifyTestResponse.data.apifyData) {
        const apifyData = apifyTestResponse.data.apifyData;
        console.log('   Apify Data Analysis:');
        console.log(`     Has Basic Info: ${apifyData.hasBasicInfo}`);
        console.log(`     Has Experience: ${apifyData.hasExperience}`);
        console.log(`     Has Education: ${apifyData.hasEducation}`);
        console.log(`     Has Skills: ${apifyData.hasSkills}`);
      }
    }

    // Test 5: Teste de configurações diferentes (se diagnóstico passou)
    if (debugResponse.data.success) {
      console.log('\n5️⃣  Testing Different Configurations...');
      const configTestResponse = await axios.post(`${BASE_URL}/debug/linkedin-test/test-configurations`, {
        url: TEST_URL,
        testDifferentConfigs: false // Test only default config for speed
      });

      console.log('📊 Configuration Test Results:');
      console.log(`   Summary: ${configTestResponse.data.summary}`);
      
      configTestResponse.data.results.forEach((result, index) => {
        const icon = result.success ? '✅' : '❌';
        console.log(`   ${icon} ${result.name}: ${result.success ? 'Success' : 'Failed'} (${result.duration}ms)`);
        if (result.error) {
          console.log(`       Error: ${result.error.message}`);
        }
      });

      if (configTestResponse.data.recommendations.length > 0) {
        console.log('   Recommendations:');
        configTestResponse.data.recommendations.forEach(rec => {
          console.log(`     - ${rec}`);
        });
      }
    }

    console.log('\n✅ All tests completed!');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure the backend server is running on port 3000');
      console.error('   Run: npm run start:dev');
    }
  }
}

// Executar testes
if (require.main === module) {
  testLinkedInImport();
}

module.exports = { testLinkedInImport };