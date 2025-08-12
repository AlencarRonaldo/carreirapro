# Otimizador — Plano de Implantação

Este documento descreve como integrar o “Otimizador” (analisador/ajustador de currículo versus vaga) ao monorepo atual (NestJS + Next.js), incluindo endpoints, entidades, fluxo no frontend, limites de uso, billing e rollout.

## Visão Geral

- Objetivo: permitir que o usuário selecione um currículo, informe uma vaga (texto/URL) e receba sugestões automáticas, score de aderência e aplicação de melhorias (com controle por plano/limite).
- Reuso do que já existe:
  - Billing/Planos/Stripe: `billing/*`, `RequireProPlanGuard`.
  - Contagem de uso mensal: `common/usage/*` (free: 3/mês, premium: 50/mês; números ajustáveis via env/config).
  - IA: `ai/ai.service.ts` (plugar modelo escolhido por env).
  - Currículos/Documentos: `documents/*` (fonte para resume base) e `jobs/*` (análise aproveitável).

## Backend (NestJS)

### Endpoints

1) POST `/optimizer/prepare`
   - Body: `{ resumeId: string, jobDescription?: string, jobUrl?: string }`
   - Ações:
     - Se `jobUrl` informado, baixar/parsear descrição (usar serviço simples de fetch + extrator).
     - Normalizar descrição (limpar HTML, quebrar em seções: requisitos, responsabilidades, skills, senioridade, localização).
     - Carregar currículo (documento existente) e extrair seções relevantes (objetivo, experiências, skills, educação).
     - Retornar snapshot: `{ resumeSummary, jobSummary, gaps: string[], recommendedSkills: string[] }` (sem debitar uso ainda, apenas preparar visão geral).

2) POST `/optimizer/score`
   - Body: `{ resumeId: string, jobDescription: string }`
   - Usa `AiService` para gerar score de aderência e justifica em tópicos.
   - Debita 1 uso do limite.
   - Retorna `{ score: number (0-100), rationales: string[], missingKeywords: string[], overQualifications?: string[] }`.

3) POST `/optimizer/apply`
   - Guard: `RequireProPlanGuard` (opcional permitir no free com limite)
   - Body: `{ resumeId: string, jobDescription: string, applyMode: 'non-destructive'|'inplace' }`
   - A IA retorna diffs propostos (em formato estruturado) por seção; o serviço aplica em `documents` (gera nova versão se `non-destructive`).
   - Debita 1 uso.
   - Retorna `{ newResumeId?: string, previewHtml?: string, changes: Array<{ section: string, before: string, after: string }> }`.

4) GET `/optimizer/history`
   - Lista execuções anteriores do usuário, com score/alterações e links para currículo gerado.

### Entidades

- `OptimizerRunEntity` (nova)
  - `id`, `userId`, `resumeId`, `jobTitle`, `jobSourceUrl?`, `jobSummary`, `score`, `missingKeywords`, `changesJson`, `createdAt`.
  - Índices por `userId` e `createdAt DESC`.

### Serviços

- `OptimizerService`
  - `prepare(resumeId, jobTextOrUrl)` → normaliza e devolve visão inicial.
  - `score(resumeId, jobText)` → chama `AiService` (prompt engineering) e persiste `OptimizerRunEntity`.
  - `apply(resumeId, jobText, applyMode)` → usa IA para gerar diffs e atualiza/duplica currículo em `documents`.
  - Integra com `UsageService` para checagem e débito de uso.

### DTOs

- `PrepareDto`, `ScoreDto`, `ApplyDto` com validação `class-validator` (min length, urls válidas, etc.).

### Guards & Limites

- Aplicar `JwtAuthGuard` em todas as rotas.
- `UsageGuard` (ou pipe no service) para checar limites antes de score/apply.
- `RequireProPlanGuard` opcional em `apply` (ou manter no free com limite menor).

### Config/ENV

- `AI_MODEL` (ex.: `gpt-4o-mini`, `claude-3.7`, `ollama:llama3.1`)
- `OPTIMIZER_FREE_LIMIT=3`, `OPTIMIZER_PRO_LIMIT=50` (exemplos)
- `FETCH_TIMEOUT_MS` para `jobUrl`.

### Migração

- Criar migration para `optimizer_runs`.

## Frontend (Next.js)

### Páginas/Rotas

- `/optimizer`
  - Passo 1: Selecionar currículo (listar de `documents`).
  - Passo 2: Informar vaga (colar texto ou URL).
  - Passo 3: Ver “Prepare” — resumo e gaps.
  - Passo 4: Gerar “Score” e exibir missing keywords.
  - Passo 5: “Apply” — mostrar diffs por seção e permitir aplicar (em nova versão ou inplace).
  - Sidebar: contador de uso e call-to-upgrade se próximo do limite.

### Hooks

- `useOptimizer()`
  - `prepare({ resumeId, jobTextOrUrl })` → POST `/optimizer/prepare`
  - `score({ resumeId, jobDescription })` → POST `/optimizer/score`
  - `apply({ resumeId, jobDescription, applyMode })` → POST `/optimizer/apply`
  - `history()` → GET `/optimizer/history`
  - Estado: `loading`, `error`, `data` por etapa.

### UI/UX

- Form de vaga com tabs: “Colar descrição” | “URL da vaga”.
- Preview do currículo selecionado (render do HTML armazenado) + preview das mudanças.
- Banner de limite de uso (exibir contagem atual); CTA para plano Pro quando atingir limite.

### Integrações

- Reaproveitar componentes de upload/seleção de documento já existentes em `documents`.
- Após `apply`, redirecionar para o editor/visualizador do currículo novo.

## Métricas & Telemetria

- Registrar eventos: `optimizer.prepare`, `optimizer.score`, `optimizer.apply` com duração, tamanho do input e resultado.
- Métricas de conversão: taxa de clique em upgrade após limite.

## Segurança & Privacidade

- Sanitizar texto da vaga e currículo antes de enviar ao provedor de IA.
- PII: evitar logging de dados sensíveis; mascarar emails/telefones nos logs.
- Respeitar LGPD (consentimento para uso dos dados para otimização).

## Rollout

1) Feature flag: `OPTIMIZER_ENABLED` (backend e frontend).
2) Beta fechado (apenas plano Pro), coletar feedback.
3) Abrir para free com limite reduzido.

## Testes

- Unit (service, DTOs, guards).
- E2E (prepare/score/apply) com usuário seed.
- Frontend: testes de fluxo nos passos, estados de erro e limites.

## Checklist de Tarefas

### Backend

- [ ] Criar `optimizer_runs` migration + entity
- [ ] Criar `OptimizerModule` com service/controller/DTOs
- [ ] Implementar `/prepare`, `/score`, `/apply`, `/history`
- [ ] Integrar `UsageService` e `RequireProPlanGuard`
- [ ] Variáveis de ambiente e config
- [ ] Testes unitários e e2e

### Frontend

- [ ] Página `/optimizer` com passos e guard de auth
- [ ] `useOptimizer` hook
- [ ] Integração com `documents` para selecionar currículo
- [ ] UI de diff e aplicação das mudanças
- [ ] Banner de limites e CTA de upgrade
- [ ] Testes de integração

## Notas de Implementação

- Prompt engineering: reutilizar `AiService` e isolar prompts do otimizador; versionar prompts.
- Parsing de `jobUrl`: simples `fetch` + heurística HTML → texto; fallback manual.
- Diffs: preferir formato estruturado por seção (JSON) para aplicar com segurança.
