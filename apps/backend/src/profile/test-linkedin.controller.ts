import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ProfileService } from './profile.service';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';
import { firstValueFrom } from 'rxjs';

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  timing?: number;
}

interface TestResponse {
  success: boolean;
  results: TestResult[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    totalTime: number;
  };
}

@Controller('debug/linkedin-test')
export class TestLinkedInController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  @Get('config')
  async validateConfig(): Promise<TestResponse> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    // Verificar token
    const token = this.config.get<string>('APIFY_TOKEN');
    if (!token) {
      results.push({
        step: 'Token Validation',
        status: 'error',
        message: 'APIFY_TOKEN não configurado',
      });
    } else if (token.startsWith('apify_api_')) {
      results.push({
        step: 'Token Validation',
        status: 'success',
        message: `Token válido: ${token.substring(0, 20)}...`,
        data: { tokenLength: token.length },
      });
    } else {
      results.push({
        step: 'Token Validation',
        status: 'warning',
        message: 'Formato de token suspeito',
        data: { token: token.substring(0, 10) + '...' },
      });
    }

    // Verificar ator
    const actor = this.config.get<string>('APIFY_ACTOR') || 'apimaestro~linkedin-profile-detail';
    results.push({
      step: 'Actor Configuration',
      status: 'success',
      message: `Ator configurado: ${actor}`,
      data: { actor },
    });

    // Verificar cookies
    const cookiesJson = this.config.get<string>('APIFY_LI_COOKIES_JSON') || '';
    try {
      if (cookiesJson) {
        const cookies = JSON.parse(cookiesJson);
        if (Array.isArray(cookies) && cookies.length > 0) {
          results.push({
            step: 'Cookies Validation',
            status: 'success',
            message: `${cookies.length} cookies configurados`,
            data: { 
              cookieCount: cookies.length,
              cookieNames: cookies.map(c => c.name),
            },
          });
        } else {
          results.push({
            step: 'Cookies Validation',
            status: 'warning',
            message: 'Cookies configurados mas array vazio',
          });
        }
      } else {
        results.push({
          step: 'Cookies Validation',
          status: 'error',
          message: 'APIFY_LI_COOKIES_JSON não configurado',
        });
      }
    } catch (error) {
      results.push({
        step: 'Cookies Validation',
        status: 'error',
        message: 'Erro ao parsear cookies JSON',
        data: { error: error.message },
      });
    }

    const totalTime = Date.now() - startTime;
    const summary = {
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      warnings: results.filter(r => r.status === 'warning').length,
      totalTime,
    };

    return {
      success: summary.failed === 0,
      results,
      summary,
    };
  }

  @Post('validate-input')
  async validateInput(@Body() body: ImportLinkedinDto): Promise<TestResponse> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    // Validar URL
    try {
      const url = new URL(body.url);
      if (url.hostname.includes('linkedin.com')) {
        results.push({
          step: 'URL Validation',
          status: 'success',
          message: 'URL do LinkedIn válida',
          data: { hostname: url.hostname, pathname: url.pathname },
        });
      } else {
        results.push({
          step: 'URL Validation',
          status: 'error',
          message: 'URL não é do LinkedIn',
          data: { hostname: url.hostname },
        });
      }
    } catch (error) {
      results.push({
        step: 'URL Validation',
        status: 'error',
        message: 'URL inválida',
        data: { error: error.message },
      });
    }

    // Testar formato de input para diferentes atores
    const actor = this.config.get<string>('APIFY_ACTOR') || 'apimaestro~linkedin-profile-detail';
    
    if (actor.includes('logical_scrapers~linkedin-profile-scraper')) {
      const logicalScrapersInput = {
        urls: [body.url],
        cookies: [],
      };
      results.push({
        step: 'Input Format (Logical Scrapers)',
        status: 'success',
        message: 'Formato de input para logical_scrapers configurado',
        data: logicalScrapersInput,
      });
    } else {
      const apiMaestroInput = {
        profiles: [body.url.replace('https://www.linkedin.com/in/', '').replace('/', '')],
        maxItems: 1,
        saveHtml: false,
      };
      results.push({
        step: 'Input Format (API Maestro)',
        status: 'success',
        message: 'Formato de input para apimaestro configurado',
        data: apiMaestroInput,
      });
    }

    const totalTime = Date.now() - startTime;
    const summary = {
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      warnings: results.filter(r => r.status === 'warning').length,
      totalTime,
    };

    return {
      success: summary.failed === 0,
      results,
      summary,
    };
  }

  @Post('debug-logs')
  async testWithDebugLogs(@Body() body: ImportLinkedinDto & { testMode?: 'full' | 'apify-only' | 'mapping-only' }): Promise<TestResponse> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    console.log('🧪 [TEST] Iniciando teste com logs de debug');
    console.log('🧪 [TEST] URL:', body.url);
    console.log('🧪 [TEST] Modo:', body.testMode || 'full');

    try {
      const stepStart = Date.now();
      const result = await this.profileService.importFromLinkedin('test-debug-user-id', body);
      const stepTime = Date.now() - stepStart;

      results.push({
        step: 'LinkedIn Import Execution',
        status: 'success',
        message: 'Importação executada com sucesso',
        data: result,
        timing: stepTime,
      });

      // Verificar se dados foram populados
      const hasData = result.fullName || result.headline || (result.experiences && result.experiences.length > 0) || (result.skills && result.skills.length > 0);
      
      if (hasData) {
        results.push({
          step: 'Data Population Check',
          status: result.fullName ? 'success' : 'warning',
          message: result.fullName ? `Dados completos: ${result.fullName}` : 'Dados parciais extraídos - nome em falta',
          data: {
            hasFullName: !!result.fullName,
            hasHeadline: !!result.headline,
            experienceCount: result.experiences?.length || 0,
            skillCount: result.skills?.length || 0,
            educationCount: result.education?.length || 0,
            hasAnyData: hasData,
            extractedFields: {
              fullName: result.fullName || '[VAZIO]',
              headline: result.headline ? 'PREENCHIDO' : '[VAZIO]',
              linkedin: result.linkedin ? 'PREENCHIDO' : '[VAZIO]',
            }
          },
        });
      } else {
        results.push({
          step: 'Data Population Check',
          status: 'error',
          message: 'Nenhum dado foi extraído do LinkedIn',
          data: {
            noDataExtracted: true,
            onlyLinkedInSaved: !!result.linkedin,
          },
        });
      }
    } catch (error) {
      results.push({
        step: 'LinkedIn Import Execution',
        status: 'error',
        message: 'Erro na execução da importação',
        data: { 
          error: error.message,
          stack: error.stack,
        },
      });
    }

    const totalTime = Date.now() - startTime;
    const summary = {
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      warnings: results.filter(r => r.status === 'warning').length,
      totalTime,
    };

    console.log('🧪 [TEST] Teste concluído:', summary);

    return {
      success: summary.failed === 0,
      results,
      summary,
    };
  }

  @Post('run')
  async runFullTest(@Body() body: ImportLinkedinDto & { testMode?: 'full' | 'apify-only' | 'mapping-only' }): Promise<TestResponse> {
    const results: TestResult[] = [];
    const globalStart = Date.now();

    console.log('🧪 [FULL TEST] Iniciando teste completo');

    // Etapa 1: Validar configuração
    const configResult = await this.validateConfig();
    results.push({
      step: '1. Configuration Check',
      status: configResult.success ? 'success' : 'error',
      message: `Configuração ${configResult.success ? 'válida' : 'inválida'}`,
      data: configResult.summary,
    });

    // Etapa 2: Validar input
    const inputResult = await this.validateInput(body);
    results.push({
      step: '2. Input Validation',
      status: inputResult.success ? 'success' : 'error',
      message: `Input ${inputResult.success ? 'válido' : 'inválido'}`,
      data: inputResult.summary,
    });

    // Se configuração ou input falharam, não continuar
    if (!configResult.success || !inputResult.success) {
      results.push({
        step: '3. Early Termination',
        status: 'error',
        message: 'Teste interrompido devido a erros de configuração/input',
      });

      const totalTime = Date.now() - globalStart;
      return {
        success: false,
        results,
        summary: {
          passed: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'error').length,
          warnings: results.filter(r => r.status === 'warning').length,
          totalTime,
        },
      };
    }

    // Etapa 3: Teste direto da API Apify
    try {
      const stepStart = Date.now();
      const token = this.config.get<string>('APIFY_TOKEN');
      const actor = this.config.get<string>('APIFY_ACTOR');
      
      const testPayload = {
        urls: [body.url],
        cookies: [],
      };

      console.log('🧪 [FULL TEST] Testando API Apify diretamente...');
      const apifyResponse = await firstValueFrom(
        this.http.post(
          `https://api.apify.com/v2/acts/${actor}/run-sync?token=${token}&timeout=30000&memory=1024`,
          testPayload,
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          },
        ),
      );
      
      const stepTime = Date.now() - stepStart;
      results.push({
        step: '3. Direct Apify API Test',
        status: 'success',
        message: 'API Apify respondeu com sucesso',
        data: {
          status: apifyResponse.status,
          dataSize: JSON.stringify(apifyResponse.data).length,
          timing: stepTime,
        },
        timing: stepTime,
      });
    } catch (error) {
      results.push({
        step: '3. Direct Apify API Test',
        status: 'error',
        message: 'Erro na chamada direta da API Apify',
        data: {
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
        },
      });
    }

    // Etapa 4: Teste via ProfileService
    const serviceResult = await this.testWithDebugLogs(body);
    results.push({
      step: '4. ProfileService Test',
      status: serviceResult.success ? 'success' : 'error',
      message: `ProfileService ${serviceResult.success ? 'funcionou' : 'falhou'}`,
      data: serviceResult.summary,
    });

    // Etapa 5: Verificação final
    results.push({
      step: '5. Final Assessment',
      status: serviceResult.success ? 'success' : 'warning',
      message: serviceResult.success 
        ? 'Sistema funcionando completamente' 
        : 'Sistema com problemas - verificar logs detalhados',
    });

    const totalTime = Date.now() - globalStart;
    const summary = {
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      warnings: results.filter(r => r.status === 'warning').length,
      totalTime,
    };

    console.log('🧪 [FULL TEST] Teste completo finalizado:', summary);

    return {
      success: summary.failed === 0,
      results,
      summary,
    };
  }

  @Post('inspect-dataset-flow')
  async inspectDatasetFlow(@Body() body: ImportLinkedinDto): Promise<any> {
    console.log('🔍 [DATASET FLOW INSPECTOR] Iniciando inspeção completa do fluxo dataset');
    
    try {
      const token = this.config.get<string>('APIFY_TOKEN');
      const actor = this.config.get<string>('APIFY_ACTOR');
      const cookiesJson = this.config.get<string>('APIFY_LI_COOKIES_JSON') || '';
      
      let cookies = [];
      if (cookiesJson) {
        try {
          cookies = JSON.parse(cookiesJson);
        } catch (e) {
          console.log('⚠️ Erro ao parsear cookies, usando array vazio');
        }
      }

      const testPayload = {
        urls: [body.url],
        cookies: cookies,
      };

      console.log('🔍 Fazendo requisição assíncrona...');
      const response = await firstValueFrom(
        this.http.post(
          `https://api.apify.com/v2/acts/${actor}/runs?token=${token}&memory=2048`,
          testPayload,
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          },
        ),
      );
      
      const runResult = response.data;
      console.log('🔍 Resposta da criação do run:', runResult);
      
      if (!runResult?.data?.id) {
        return {
          success: false,
          message: 'Não foi possível criar o run',
          runResult: runResult
        };
      }
      
      const runId = runResult.data.id;
      console.log('🔍 RunId criado:', runId);
      
      try {
        // Aguardar o run completar
        console.log('🔍 Aguardando execução...');
        let attempts = 0;
        let runInfo;
        
        do {
          await new Promise(resolve => setTimeout(resolve, 2000));
          runInfo = await firstValueFrom(
            this.http.get(
              `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`,
              { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
            ),
          );
          attempts++;
          console.log(`🔍 Status do run (tentativa ${attempts}):`, runInfo?.data?.data?.status);
        } while (runInfo?.data?.data?.status === 'RUNNING' && attempts < 30);
        
        console.log('🔍 Run finalizado com status:', runInfo?.data?.data?.status);
        
        const datasetId = runInfo?.data?.data?.defaultDatasetId;
        console.log('🔍 DatasetId encontrado:', datasetId);
        
        if (datasetId) {
          // Aguardar um pouco e buscar dataset
          console.log('🔍 Aguardando 5s e buscando dataset...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          const itemsResp = await firstValueFrom(
            this.http.get(
              `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&limit=1&token=${token}`,
              { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
            ),
          );
          
          const items = Array.isArray(itemsResp?.data) ? itemsResp.data : [];
          const item = items[0];
          
          return {
            success: true,
            message: 'Fluxo completo executado',
            results: {
              step1_runAsync: {
                type: typeof runResult,
                runId: runId,
                status: response.status,
              },
              step2_runId: runId,
              step3_runInfo: runInfo?.data,
              step4_datasetId: datasetId,
              step5_datasetItems: {
                count: items.length,
                item: item,
                hasNameFields: item ? {
                  fullName: item.fullName || '[vazio]',
                  firstName: item.firstName || '[vazio]',
                  lastName: item.lastName || '[vazio]',
                  name: item.name || '[vazio]',
                  profileName: item.profileName || '[vazio]',
                  displayName: item.displayName || '[vazio]',
                } : null,
                hasEducation: item?.education ? item.education.length : 0,
                allKeys: item ? Object.keys(item).slice(0, 20) : []
              }
            }
          };
        }
        
        return {
          success: false,
          message: 'Não foi possível encontrar datasetId',
          runResult: runResult,
          headers: response.headers
        };
        
      } catch (datasetError) {
        return {
          success: false,
          message: 'Erro na busca do dataset',
          error: datasetError.message,
          runResult: runResult
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  @Post('inspect-raw-data')
  async inspectRawData(@Body() body: ImportLinkedinDto): Promise<any> {
    console.log('🔍 [RAW DATA INSPECTOR] Iniciando inspeção de dados brutos do Apify');
    
    try {
      const token = this.config.get<string>('APIFY_TOKEN');
      const actor = this.config.get<string>('APIFY_ACTOR');
      const cookiesJson = this.config.get<string>('APIFY_LI_COOKIES_JSON') || '';
      
      let cookies = [];
      if (cookiesJson) {
        try {
          cookies = JSON.parse(cookiesJson);
        } catch (e) {
          console.log('⚠️ Erro ao parsear cookies, usando array vazio');
        }
      }

      const testPayload = {
        urls: [body.url],
        cookies: cookies,
      };

      console.log('🔍 Fazendo requisição para Apify...');
      const response = await firstValueFrom(
        this.http.post(
          `https://api.apify.com/v2/acts/${actor}/run-sync?token=${token}&timeout=180000&memory=2048`,
          testPayload,
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 180000,
          },
        ),
      );
      
      console.log('✅ Resposta recebida do Apify');
      const rawData = response.data;
      
      // Análise detalhada da estrutura
      const analysis = {
        responseType: typeof rawData,
        isArray: Array.isArray(rawData),
        hasItems: rawData?.items ? `array with ${rawData.items.length} items` : 'no items property',
        keys: rawData && typeof rawData === 'object' ? Object.keys(rawData) : null,
        
        // Se é um array, analisar primeiro item
        firstItemAnalysis: null as any,
        
        // Se tem propriedade items, analisar primeiro
        itemsAnalysis: null as any,
      };
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        const firstItem = rawData[0];
        analysis.firstItemAnalysis = {
          type: typeof firstItem,
          keys: typeof firstItem === 'object' ? Object.keys(firstItem) : null,
          hasName: !!(firstItem?.fullName || firstItem?.firstName || firstItem?.name),
          hasHeadline: !!firstItem?.headline,
          hasExperience: !!(firstItem?.experience && firstItem.experience.length > 0),
          hasEducation: !!(firstItem?.education && firstItem.education.length > 0),
          nameFields: {
            fullName: firstItem?.fullName || '[não encontrado]',
            firstName: firstItem?.firstName || '[não encontrado]',
            lastName: firstItem?.lastName || '[não encontrado]',
            name: firstItem?.name || '[não encontrado]',
          }
        };
      }
      
      if (rawData?.items && Array.isArray(rawData.items) && rawData.items.length > 0) {
        const firstItem = rawData.items[0];
        analysis.itemsAnalysis = {
          type: typeof firstItem,
          keys: typeof firstItem === 'object' ? Object.keys(firstItem) : null,
          hasName: !!(firstItem?.fullName || firstItem?.firstName || firstItem?.name),
          hasHeadline: !!firstItem?.headline,
          hasExperience: !!(firstItem?.experience && firstItem.experience.length > 0),
          hasEducation: !!(firstItem?.education && firstItem.education.length > 0),
          nameFields: {
            fullName: firstItem?.fullName || '[não encontrado]',
            firstName: firstItem?.firstName || '[não encontrado]',
            lastName: firstItem?.lastName || '[não encontrado]',
            name: firstItem?.name || '[não encontrado]',
          }
        };
      }

      return {
        success: true,
        message: 'Dados brutos capturados com sucesso',
        analysis: analysis,
        sampleData: rawData && typeof rawData === 'object' ? 
          JSON.stringify(rawData, null, 2).substring(0, 2000) + '...' : rawData
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  @Post('verify-persistence')
  async verifyPersistence(@Body() body: { userId?: string }): Promise<any> {
    console.log('🔍 [PERSISTENCE CHECK] Verificando dados salvos no banco');
    
    try {
      const userId = body.userId || 'test-debug-user-id';
      
      // Buscar dados do ProfileService
      const profile = await this.profileService.getOrCreate(userId);
      
      console.log('📊 Dados encontrados no perfil:', {
        id: profile.id,
        fullName: profile.fullName,
        headline: profile.headline,
        linkedin: profile.linkedin,
        experienceCount: profile.experiences?.length || 0,
        educationCount: profile.education?.length || 0,
        skillsCount: profile.skills?.length || 0,
      });

      return {
        success: true,
        message: 'Verificação de persistência concluída',
        userId: userId,
        profile: {
          id: profile.id,
          fullName: profile.fullName,
          headline: profile.headline,
          linkedin: profile.linkedin,
          locationCity: profile.locationCity,
          locationState: profile.locationState,
          locationCountry: profile.locationCountry,
          github: profile.github,
          website: profile.website,
          email: profile.email,
          phone: profile.phone,
          maritalStatus: profile.maritalStatus,
        },
        experiences: profile.experiences || [],
        education: profile.education || [],
        skills: profile.skills || [],
        counts: {
          experiences: profile.experiences?.length || 0,
          education: profile.education?.length || 0,
          skills: profile.skills?.length || 0,
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  @Post('test-configurations')
  async testConfigurations(@Body() body: ImportLinkedinDto): Promise<TestResponse> {
    const results: TestResult[] = [];
    const startTime = Date.now();
    const token = this.config.get<string>('APIFY_TOKEN');
    const actor = this.config.get<string>('APIFY_ACTOR');

    const configurations = [
      { timeout: 30000, memory: 1024, name: 'Light Config' },
      { timeout: 60000, memory: 2048, name: 'Standard Config' },
      { timeout: 180000, memory: 2048, name: 'Heavy Config' },
    ];

    for (const config of configurations) {
      try {
        const stepStart = Date.now();
        
        const testPayload = {
          urls: [body.url],
          cookies: [],
        };

        const response = await firstValueFrom(
          this.http.post(
            `https://api.apify.com/v2/acts/${actor}/run-sync?token=${token}&timeout=${config.timeout}&memory=${config.memory}`,
            testPayload,
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: config.timeout,
            },
          ),
        );
        
        const stepTime = Date.now() - stepStart;
        results.push({
          step: `Configuration Test: ${config.name}`,
          status: 'success',
          message: `${config.name} funcionou em ${stepTime}ms`,
          data: {
            timeout: config.timeout,
            memory: config.memory,
            responseStatus: response.status,
            timing: stepTime,
          },
          timing: stepTime,
        });
      } catch (error) {
        results.push({
          step: `Configuration Test: ${config.name}`,
          status: 'error',
          message: `${config.name} falhou`,
          data: {
            timeout: config.timeout,
            memory: config.memory,
            error: error.message,
          },
        });
      }
    }

    const totalTime = Date.now() - startTime;
    const summary = {
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      warnings: results.filter(r => r.status === 'warning').length,
      totalTime,
    };

    return {
      success: summary.failed === 0,
      results,
      summary,
    };
  }
}