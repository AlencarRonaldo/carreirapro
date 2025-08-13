# LinkedIn Import Testing System

Sistema completo de testes para validar e diagnosticar o processo de importação LinkedIn usando Apify.

## 📋 Componentes

### 1. TestLinkedInController (`/debug/linkedin-test`)
Controller dedicado para testes abrangentes da integração LinkedIn.

#### Endpoints Disponíveis:

**GET `/debug/linkedin-test/config`**
- Verifica configuração atual do Apify
- Valida token, ator e cookies
- Retorna status de configuração

**POST `/debug/linkedin-test/debug-logs`**
```json
{
  "url": "https://www.linkedin.com/in/username"
}
```
- Executa diagnóstico completo com logs detalhados
- Testa conexão API, configuração e execução básica
- Útil para identificar problemas específicos

**POST `/debug/linkedin-test/run`**
```json
{
  "url": "https://www.linkedin.com/in/username",
  "overwrite": true,
  "testMode": "full|apify-only|mapping-only"
}
```
- Executa teste completo com múltiplas etapas
- Modos de teste:
  - `full`: Teste completo (Apify + mapeamento + persistência)
  - `apify-only`: Apenas teste da API Apify
  - `mapping-only`: Apenas teste de mapeamento de dados (com mock)

### 2. Script de Teste Automatizado (`test-linkedin-import.js`)
Script Node.js para executar testes automaticamente.

```bash
node test-linkedin-import.js
```

## 🔧 Configuração Necessária

### Variáveis de Ambiente:
```env
# Token da API Apify (obrigatório)
APIFY_TOKEN=seu_token_aqui

# Ator a ser usado (opcional, padrão: logical_scrapers~linkedin-profile-scraper)  
APIFY_ACTOR=logical_scrapers~linkedin-profile-scraper

# Cookies do LinkedIn em formato JSON (opcional, mas recomendado)
APIFY_LI_COOKIES_JSON='[{"name":"li_at","value":"your_cookie_value","domain":".linkedin.com"}]'
```

### Como Obter Cookies do LinkedIn:

1. **Faça login no LinkedIn** no navegador
2. **Abra DevTools** (F12)
3. **Vá para Application/Storage → Cookies → https://www.linkedin.com**
4. **Copie os cookies importantes**:
   - `li_at` (token de autenticação - ESSENCIAL)
   - `JSESSIONID` (sessão)
   - `bcookie` (browser cookie)
   - `bscookie` (secure browser cookie)

5. **Formate como JSON**:
```json
[
  {
    "name": "li_at",
    "value": "AQEDATEhqPkEkJ1QAAABjN4...",
    "domain": ".linkedin.com"
  },
  {
    "name": "JSESSIONID", 
    "value": "ajax:8234567890123456789",
    "domain": ".linkedin.com"
  }
]
```

## 🧪 Executando Testes

### Método 1: Script Automatizado
```bash
cd apps/backend
node test-linkedin-import.js
```

### Método 2: Requests HTTP Manuais

1. **Verificar Configuração**:
```bash
curl http://localhost:3000/debug/linkedin-test/config
```

2. **Executar Diagnóstico**:
```bash
curl -X POST http://localhost:3000/debug/linkedin-test/debug-logs \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.linkedin.com/in/ronaldo-pereira-de-alencar-carvalho-487bb222a"}'
```

3. **Teste Completo**:
```bash
curl -X POST http://localhost:3000/debug/linkedin-test/run \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.linkedin.com/in/ronaldo-pereira-de-alencar-carvalho-487bb222a",
    "overwrite": true,
    "testMode": "full"
  }'
```

### Método 3: Interface Web (Insomnia/Postman)
Use os endpoints acima com os payloads JSON fornecidos.

## 📊 Interpretando Resultados

### Estrutura de Resposta do Teste:
```typescript
interface TestResult {
  success: boolean;           // Sucesso geral
  summary: string;           // Resumo do resultado
  totalDuration: number;     // Duração total em ms
  steps: TestStep[];         // Etapas executadas
  apifyData?: any;          // Dados retornados pelo Apify
  mappedData?: any;         // Dados mapeados para o perfil
  savedData?: any;          // Dados salvos no banco
}

interface TestStep {
  name: string;             // Nome da etapa
  status: 'success' | 'error' | 'skipped';
  duration?: number;        // Duração em ms
  data?: any;              // Dados da etapa
  error?: any;             // Erro (se houver)
  logs?: string[];         // Logs da etapa
}
```

### Etapas do Teste Completo:

1. **Validate Prerequisites**: Verifica token, URL e cookies
2. **Test Apify API Connection**: Testa conexão com API
3. **Prepare Actor Input**: Prepara payload para o ator
4. **Execute Actor (run-sync)**: Executa ator sincronamente
5. **Execute Actor (async mode)**: Fallback para modo assíncrono
6. **Test Data Mapping**: Testa mapeamento dos dados
7. **Test Database Persistence**: Testa salvamento no banco

## 🐛 Troubleshooting

### Problemas Comuns:

#### 1. "APIFY_TOKEN not configured"
- **Causa**: Token não configurado
- **Solução**: Defina `APIFY_TOKEN` no `.env`

#### 2. "Actor run failed with status: FAILED"
- **Causa**: Ator falhou na execução (geralmente por falta de cookies)
- **Solução**: Configure `APIFY_LI_COOKIES_JSON` com cookies válidos

#### 3. "No data returned from actor"
- **Causa**: LinkedIn bloqueou o acesso ou perfil privado
- **Solução**: 
  - Use cookies atualizados
  - Teste com perfil público
  - Verifique se o ator suporta a URL

#### 4. "Request failed with status code 401"
- **Causa**: Token inválido ou expirado
- **Solução**: Verifique token no Console Apify

#### 5. "Invalid cookies JSON"
- **Causa**: Formato JSON inválido nos cookies
- **Solução**: Valide JSON em jsonlint.com

### Logs Detalhados:

O sistema gera logs detalhados no console:
- `🔵` LinkedIn Import - Logs gerais
- `🚀` Apify execution - Execução de atores  
- `📥` Response processing - Processamento de resposta
- `⚠️` Warnings/Fallbacks - Avisos e fallbacks
- `❌` Errors - Erros

### Validação de Performance:

O sistema mede tempos de execução:
- **run-sync**: Normalmente 30-120 segundos
- **async mode**: Normalmente 60-180 segundos
- **Total**: Deve completar em < 5 minutos

## 🔍 Debug Avançado

### Habilitar Logs Verbose:
```bash
DEBUG=* node test-linkedin-import.js
```

### Analisar Response Raw:
Use o endpoint `/debug-logs` que retorna dados brutos do Apify.

### Testar Apenas Mapeamento:
```json
{
  "testMode": "mapping-only",
  "url": "https://www.linkedin.com/in/username"
}
```

### Verificar Configuração de Cookies:
```bash
curl http://localhost:3000/debug/linkedin-test/config
```
Deve retornar `cookiesValid: true` e `cookiesCount > 0`.

## 📝 Notas Importantes

1. **Rate Limiting**: Apify tem limites de rate. Evite testes excessivos.
2. **Cookies Expirando**: Cookies do LinkedIn expiram. Atualize regularmente.
3. **Perfis Privados**: Alguns perfis podem não ser acessíveis mesmo com cookies.
4. **Actors Diferentes**: O sistema suporta múltiplos actors do Apify.
5. **Ambiente de Teste**: Use sempre perfis de teste, não perfis reais de usuários.

## 🔄 Manutenção

### Atualizar Cookies:
1. Faça novo login no LinkedIn
2. Extraia cookies atualizados
3. Atualize `APIFY_LI_COOKIES_JSON`
4. Reinicie aplicação

### Monitorar Performance:
Use os logs de duração para identificar degradação de performance.

### Validar Mapeamento:
Execute `testMode: mapping-only` após mudanças no código de mapeamento.