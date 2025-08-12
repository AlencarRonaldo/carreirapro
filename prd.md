# Plano de Desenvolvimento - Carreira Pro v1.0

## 📋 Resumo Executivo

**Produto:** Carreira Pro - Assistente de desenvolvimento de carreira com IA  
**Versão:** 1.0 (MVP)  
**Timeline:** 6-8 meses  
**Equipe:** 6-8 desenvolvedores especializados  
**Orçamento Estimado:** R$ 800.000 - R$ 1.200.000  
**Metodologia:** Claude Code com flags --c7 --seq --magic para desenvolvimento otimizado

## 🤖 Agentes Claude Code Especializados

### **Configuração dos Agentes**

Todos os agentes devem usar as flags:

```bash
claude-code --c7 --seq --magic
```

- **--c7**: Context 7 para análise profunda de código e arquitetura
- **--seq**: Desenvolvimento sequencial coordenado entre agentes  
- **--magic**: Máxima inteligência para soluções complexas de IA/ML

## 🏗️ Arquitetura Tecnológica

### **Stack Tecnológico Recomendado**

#### **🔧 Backend (API + Serviços)**

```yaml
Linguagem: Node.js com TypeScript
Framework: NestJS (enterprise-grade, modular)
Banco de Dados Principal: PostgreSQL 15+ (dados estruturados)
ORM: TypeORM com migrations automáticas
Cache: Redis 7+ (sessões, cache de IA)
Storage: AWS S3 (PDFs, templates, imagens)
Queue: Bull Queue + Redis (processamento assíncrono)
Autenticação: JWT + OAuth2 (Google, Apple)
Search: PostgreSQL Full-Text Search + GIN indexes
```

## 🗄️ Estrutura Completa do Banco de Dados

### **📊 Schema do Banco PostgreSQL**

#### **Database Agent - Comandos de Criação**

```bash
# Criação completa do banco de dados
claude-code --c7 --seq --magi database-schema-creation \
  --database="postgresql" \
  --orm="typeorm" \
  --migrations="automatic"
```

#### **📱 Mobile Apps (Nativo)**

```yaml
iOS: Swift + SwiftUI
Android: Kotlin + Jetpack Compose
Arquitetura: MVVM + Clean Architecture
Networking: Retrofit (Android) / Alamofire (iOS)
State Management: StateFlow (Android) / Combine (iOS)
Local Database: Room (Android) / CoreData (iOS)
```

#### **🧠 Inteligência Artificial**

```yaml
LLM Principal: OpenAI GPT-4o (análise de vagas, sugestões)
LLM Secundário: Claude 3.5 Sonnet (backup/comparação)
Vector Database: Pinecone (embeddings de vagas)
Text Processing: Langchain + Python
PDF Generation: Puppeteer + React (templates dinâmicos)
```

#### **☁️ Infraestrutura Cloud (AWS)**

```yaml
Compute: ECS Fargate (containers)
Database: RDS PostgreSQL Multi-AZ
Cache: ElastiCache Redis
Storage: S3 + CloudFront CDN
Monitoring: CloudWatch + DataDog
CI/CD: GitHub Actions + AWS CodeDeploy
Security: AWS WAF + Secrets Manager
```

## 🚀 Roadmap de Desenvolvimento com Agentes Claude Code

### **📅 Fase 1: Fundação (Mês 1-2)**

#### **Semana 1-2: Setup Inicial**

**🤖 Agente Responsável: DevOps Agent**

```bash
Comando: claude-code --c7 --seq --magic setup-infrastructure
```

- [ ] **DevOps Agent**: Configuração da infraestrutura AWS usando Terraform
- [ ] **DevOps Agent**: Setup dos repositórios (Backend, iOS, Android) com estrutura padronizada
- [ ] **DevOps Agent**: Configuração CI/CD pipeline (GitHub Actions + AWS CodeDeploy)
- [ ] **DevOps Agent**: Ambiente de desenvolvimento local (Docker Compose)
- [ ] **Architecture Agent**: Definição de padrões de código e ESLint/SwiftLint

#### **Semana 3-4: Core Backend**

**🤖 Agente Responsável: Backend Agent**

```bash
Comando: claude-code --c7 --seq --magic backend-foundation
```

- [ ] **Backend Agent**: API de autenticação (JWT + OAuth) com NestJS
- [ ] **Backend Agent**: Modelo de dados (User, Profile, Document) usando TypeORM
- [ ] **Backend Agent**: CRUD básico de usuários com validação robusta
- [ ] **Backend Agent**: Integração com PostgreSQL e migrations
- [ ] **Backend Agent**: Sistema de logs e monitoramento básico (Winston + DataDog)

#### **Semana 5-6: Apps Mobile Base**

**🤖 Agentes Responsáveis: iOS Agent + Android Agent**

```bash
Comando iOS: claude-code --c7 --seq --magic ios-foundation
Comando Android: claude-code --c7 --seq --magic android-foundation
```

- [ ] **iOS Agent**: Estrutura inicial do app iOS (SwiftUI + NavigationStack)
- [ ] **Android Agent**: Estrutura inicial do app Android (Jetpack Compose + Navigation)
- [ ] **iOS Agent**: Telas de onboarding e login (SwiftUI + Combine)
- [ ] **Android Agent**: Telas de onboarding e login (Compose + StateFlow)
- [ ] **iOS Agent**: Integração com API de autenticação (Alamofire + Async/Await)
- [ ] **Android Agent**: Integração com API de autenticação (Retrofit + Coroutines)
- [ ] **iOS Agent**: Armazenamento local básico (CoreData)
- [ ] **Android Agent**: Armazenamento local básico (Room)
- [ ] **iOS Agent**: Configuração de builds para TestFlight
- [ ] **Android Agent**: Configuração de builds para Play Console

#### **Semana 7-8: Gestão de Perfil**

**🤖 Agentes Responsáveis: Backend Agent + iOS Agent + Android Agent**

```bash
Comando: claude-code --c7 --seq --magic profile-system
```

- [ ] **Backend Agent**: **EPIC 1** - Sistema de Perfil Mestre completo (API endpoints)
- [ ] **iOS Agent**: Formulários de cadastro de experiências (SwiftUI Forms + Validation)
- [ ] **Android Agent**: Formulários de cadastro de experiências (Compose Forms + Validation)
- [ ] **Backend Agent**: Validação de dados robusta e sanitização
- [ ] **iOS Agent**: UX de preenchimento otimizada (auto-save, progress tracking)
- [ ] **Android Agent**: UX de preenchimento otimizada (auto-save, progress tracking)
- [ ] **Backend Agent**: Sync entre apps e backend (conflict resolution)
- [ ] **QA Agent**: Testes unitários básicos e integração E2E

### **📅 Fase 2: Core Features (Mês 3-4)**

#### **Semana 9-10: Geração de Documentos**

**🤖 Agentes Responsáveis: Backend Agent + PDF Agent + Design Agent**

```bash
Comando: claude-code --c7 --seq --magic document-generation
```

- [ ] **Backend Agent**: **EPIC 2** - Sistema de templates de currículo (template engine)
- [ ] **PDF Agent**: Engine de geração de PDF com Puppeteer + React (8 templates básicos)
- [ ] **Backend Agent**: Sistema de marca d'água para plano gratuito (dynamic watermarking)
- [ ] **iOS Agent**: Preview em tempo real nos apps iOS (PDFKit integration)
- [ ] **Android Agent**: Preview em tempo real nos apps Android (PdfRenderer)
- [ ] **Backend Agent**: Sistema de versionamento de documentos (audit trail)

#### **Semana 11-12: IA - Assistente de Escrita**

**🤖 Agentes Responsáveis: AI Agent + Backend Agent**

```bash
Comando: claude-code --c7 --seq --magic ai-writing-assistant
```

- [ ] **AI Agent**: **EPIC 3** - Integração com OpenAI GPT-4 (prompt engineering)
- [ ] **AI Agent**: Sistema de sugestões de texto inteligente (verbos de ação, métricas)
- [ ] **Backend Agent**: Rate limiting sofisticado (10 sugestões/mês gratuito, tracking)
- [ ] **AI Agent**: Cache inteligente de sugestões (Redis + vector similarity)
- [ ] **iOS Agent**: Interface de IA nos apps móveis iOS (real-time suggestions)
- [ ] **Android Agent**: Interface de IA nos apps móveis Android (real-time suggestions)

#### **Semana 13-14: Sistema de Monetização**

**🤖 Agentes Responsáveis: Backend Agent + iOS Agent + Android Agent**

```bash
Comando: claude-code --c7 --seq --magic monetization-system
```

- [ ] **Backend Agent**: **EPIC 5** - Sistema de assinaturas robusta (Stripe integration)
- [ ] **iOS Agent**: Integração com App Store payments (StoreKit 2)
- [ ] **Android Agent**: Integração com Play Store payments (Billing Library 5)
- [ ] **Backend Agent**: Controle de features por plano (feature flagging)
- [ ] **iOS Agent**: Telas de paywall e upgrade UX (conversion optimized)
- [ ] **Android Agent**: Telas de paywall e upgrade UX (conversion optimized)
- [ ] **Analytics Agent**: Analytics de conversão (custom events tracking)

#### **Semana 15-16: Polimento Fase 2**

**🤖 Agentes Responsáveis: Performance Agent + QA Agent**

```bash
Comando: claude-code --c7 --seq --magic phase2-optimization
```

- [ ] **Performance Agent**: Otimização de performance (profiling + bottleneck analysis)
- [ ] **QA Agent**: Testes de integração E2E com Playwright
- [ ] **QA Agent**: Correção de bugs críticos (automated bug detection)
- [ ] **UX Agent**: UX/UI refinements baseado em analytics e heatmaps

### **📅 Fase 3: Features Premium (Mês 5-6)**

#### **Semana 17-18: Análise de Vagas (PRO)**

**🤖 Agentes Responsáveis: AI Agent + Backend Agent + Scraping Agent**

```bash
Comando: claude-code --c7 --seq --magic job-analysis-pro
```

- [ ] **AI Agent**: **EPIC 3** - Sistema de análise de URLs de vagas (NLP + ML)
- [ ] **Scraping Agent**: Web scraping inteligente (LinkedIn, Indeed, etc.) com anti-detection
- [ ] **AI Agent**: Score de compatibilidade (algoritmo proprietário + ML model)
- [ ] **AI Agent**: Análise de gaps de habilidades (semantic matching)
- [ ] **Backend Agent**: Dashboard de insights para usuários PRO (real-time analytics)

#### **Semana 19-20: Templates Premium**

**🤖 Agentes Responsáveis: Design Agent + PDF Agent + iOS Agent + Android Agent**

```bash
Comando: claude-code --c7 --seq --magic premium-templates
```

- [ ] **Design Agent**: Desenvolvimento de +32 templates adicionais (design system)
- [ ] **PDF Agent**: Sistema de cores personalizáveis (dynamic theming)
- [ ] **iOS Agent**: Editor flexível drag & drop de seções iOS (SwiftUI DragGesture)
- [ ] **Android Agent**: Editor flexível drag & drop de seções Android (Compose DragAndDrop)
- [ ] **Backend Agent**: Preview responsivo em múltiplos dispositivos
- [ ] **Backend Agent**: Sistema de favoritos de templates (user preferences)

#### **Semana 21-22: Carta de Apresentação + Entrevista**

**🤖 Agentes Responsáveis: AI Agent + Backend Agent**

```bash
Comando: claude-code --c7 --seq --magic cover-letter-interview
```

- [ ] **AI Agent**: Geração automática de cartas de apresentação (contextual prompts)
- [ ] **AI Agent**: **Assistente de Entrevista** com IA (personalized questions)
- [ ] **AI Agent**: Banco de perguntas contextuais (industry-specific database)
- [ ] **AI Agent**: Sistema de preparação personalizada (adaptive learning)
- [ ] **Backend Agent**: Integração com análise de vagas (unified context)

#### **Semana 23-24: Finalização Features PRO**

**🤖 Agentes Responsáveis: Integration Agent + QA Agent**

```bash
Comando: claude-code --c7 --seq --magic pro-features-integration
```

- [ ] **Integration Agent**: Integração completa entre todas as features PRO
- [ ] **Backend Agent**: Sistema de export avançado (múltiplos formatos)
- [ ] **Analytics Agent**: Analytics avançados para usuários PRO (user journey)
- [ ] **QA Agent**: Beta testing com usuários selecionados (feedback collection)

### **📅 Fase 4: Preparação para Lançamento (Mês 7-8)**

#### **Semana 25-26: Testes e QA**

**🤖 Agentes Responsáveis: QA Agent + Security Agent + Performance Agent**

```bash
Comando: claude-code --c7 --seq --magic comprehensive-testing
```

- [ ] **QA Agent**: Testes automatizados E2E com Playwright (full user flows)
- [ ] **Performance Agent**: Testes de carga e performance (K6 + monitoring)
- [ ] **Security Agent**: Auditoria de segurança (LGPD compliance + penetration testing)
- [ ] **QA Agent**: Testes de acessibilidade (WCAG 2.1 AA compliance)
- [ ] **QA Agent**: Beta testing público (TestFlight/Play Internal + analytics)

#### **Semana 27-28: Otimização e Polimento**

**🤖 Agentes Responsáveis: Performance Agent + UX Agent**

```bash
Comando: claude-code --c7 --seq --magic launch-optimization
```

- [ ] **Performance Agent**: Otimização de performance (sub 3s loading target)
- [ ] **Performance Agent**: Otimização de bateria nos apps móveis (profiling + optimization)
- [ ] **UX Agent**: Refinamento UX baseado em feedback beta (A/B testing)
- [ ] **Marketing Agent**: Preparação de materiais de marketing (app store assets)
- [ ] **Documentation Agent**: Documentação técnica completa (API docs + user guides)

#### **Semana 29-30: Lançamento**

**🤖 Agentes Responsáveis: DevOps Agent + Release Agent**

```bash
Comando: claude-code --c7 --seq --magic production-launch
```

- [ ] **DevOps Agent**: Deploy de produção (blue-green deployment)
- [ ] **DevOps Agent**: Configuração de monitoramento 24/7 (alerts + dashboards)
- [ ] **Release Agent**: Submission para App Store/Play Store (store optimization)
- [ ] **Support Agent**: Preparação do suporte ao cliente (knowledge base + chatbot)
- [ ] **Release Agent**: Soft launch para usuários beta (gradual rollout)

#### **Semana 31-32: Pós-Lançamento**

**🤖 Agentes Responsáveis: Analytics Agent + Support Agent + DevOps Agent**

```bash
Comando: claude-code --c7 --seq --magic post-launch-monitoring
```

- [ ] **Analytics Agent**: Monitoramento de KPIs críticos (real-time dashboards)
- [ ] **DevOps Agent**: Hotfixes baseados em feedback inicial (rapid deployment)
- [ ] **Analytics Agent**: Coleta de métricas de conversão (funnel analysis)
- [ ] **Product Agent**: Planejamento da v1.1 (roadmap + prioritization)
- [ ] **Documentation Agent**: Retrospectiva e documentação de lições aprendidas

## 👨‍💻 Estrutura da Equipe com Agentes Claude Code

### **🤖 Agentes Claude Code Especializados (12+ agentes)**

#### **Core Development Agents**

```yaml
1. Architecture Agent: Design de sistema e decisões arquiteturais
   Comando: claude-code --c7 --seq --magic architecture-design
   
2. Backend Agent: APIs, banco de dados, integrações
   Comando: claude-code --c7 --seq --magic backend-development
   
3. iOS Agent: Desenvolvimento nativo iOS (Swift/SwiftUI)
   Comando: claude-code --c7 --seq --magic ios-development
   
4. Android Agent: Desenvolvimento nativo Android (Kotlin/Compose)
   Comando: claude-code --c7 --seq --magic android-development
   
5. AI Agent: Inteligência artificial, ML, prompts, OpenAI integration
   Comando: claude-code --c7 --seq --magic ai-development
```

#### **Specialized Agents**

```yaml
6. DevOps Agent: Infraestrutura, CI/CD, deployment, monitoramento
   Comando: claude-code --c7 --seq --magic devops-infrastructure
   
7. QA Agent: Testes automatizados, Playwright, qualidade
   Comando: claude-code --c7 --seq --magic quality-assurance
   
8. Security Agent: Segurança, LGPD, penetration testing
   Comando: claude-code --c7 --seq --magic security-compliance
   
9. Performance Agent: Otimização, profiling, load testing
   Comando: claude-code --c7 --seq --magic performance-optimization
   
10. PDF Agent: Geração de PDFs, templates, rendering
    Comando: claude-code --c7 --seq --magic pdf-generation
```

#### **Support Agents**

```yaml
11. Analytics Agent: Métricas, KPIs, business intelligence
    Comando: claude-code --c7 --seq --magic analytics-tracking
    
12. UX Agent: Experiência do usuário, usabilidade, A/B testing
    Comando: claude-code --c7 --seq --magic ux-optimization
    
13. Integration Agent: Integrações entre sistemas, APIs terceiros
    Comando: claude-code --c7 --seq --magic system-integration
    
14. Documentation Agent: Documentação técnica, user guides
    Comando: claude-code --c7 --seq --magic documentation
    
15. Release Agent: Deploy, store submissions, release management
    Comando: claude-code --c7 --seq --magic release-management
```

#### **Specialized Support Agents**

```yaml
16. Scraping Agent: Web scraping, data extraction, anti-detection
    Comando: claude-code --c7 --seq --magic web-scraping
    
17. Design Agent: UI/UX design, design system, templates
    Comando: claude-code --c7 --seq --magic design-system
    
18. Marketing Agent: App store optimization, marketing materials
    Comando: claude-code --c7 --seq --magic marketing-optimization
    
19. Support Agent: Customer support, knowledge base, chatbot
    Comando: claude-code --c7 --seq --magic customer-support
    
20. Product Agent: Product management, roadmap, prioritization
    Comando: claude-code --c7 --seq --magic product-management
```

### **🔄 Coordenação entre Agentes**

#### **Sequencial (--seq) Workflow**

```bash
# Exemplo de workflow coordenado para nova feature
claude-code --c7 --seq --magic feature-development \
  --agents="architecture,backend,ios,android,qa" \
  --feature="job-analysis" \
  --coordination="sequential"
```

#### **Parallel Coordination**

```bash
# Para desenvolvimento simultâneo em múltiplas plataformas  
claude-code --c7 --seq --magic parallel-development \
  --agents="ios,android" \
  --sync-point="backend-api-ready" \
  --coordination="parallel"
```

## 💰 Estimativa de Custos

### **Desenvolvimento (6-8 meses)**

```yaml
Salários Equipe: R$ 600.000 - R$ 800.000
Infraestrutura AWS: R$ 15.000 - R$ 25.000
APIs Terceiros (OpenAI): R$ 10.000 - R$ 20.000
Ferramentas Dev: R$ 8.000 - R$ 12.000
Consultores: R$ 30.000 - R$ 50.000
Buffer (20%): R$ 130.000 - R$ 180.000
---
TOTAL: R$ 793.000 - R$ 1.087.000
```

### **Operação Mensal (pós-lançamento)**

```yaml
Infraestrutura AWS: R$ 5.000 - R$ 15.000
APIs IA (OpenAI): R$ 3.000 - R$ 10.000
Monitoramento: R$ 500 - R$ 1.000
Suporte: R$ 8.000 - R$ 15.000
---
TOTAL MENSAL: R$ 16.500 - R$ 41.000
```

## 🏛️ Arquitetura Detalhada

### **Backend Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Apps   │────│   API Gateway   │────│   Auth Service  │
│  (iOS/Android)  │    │   (NestJS)      │    │   (JWT/OAuth)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼────┐
            │User Service│ │AI Service│ │Doc Service│
            │           │ │         │ │          │
            └───────────┘ └─────────┘ └──────────┘
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼────┐
            │PostgreSQL │ │OpenAI │ │  S3    │
            │           │ │ API   │ │Storage │
            └───────────┘ └───────┘ └────────┘
```

### **Mobile Architecture (Clean Architecture)**

```
┌─────────────────────────────────────────┐
│              Presentation               │
│        (SwiftUI/Jetpack Compose)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│              Domain                     │
│         (Use Cases/Entities)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│               Data                      │
│    (Repository/API/Local Database)      │
└─────────────────────────────────────────┘
```

## 🧪 Estratégia de Testes com Agentes Claude Code

### **🤖 QA Agent - Testes Automatizados**

```bash
# Configuração principal do QA Agent
claude-code --c7 --seq --magi automated-testing
```

#### **Testes por Agente**

```yaml
Backend Testing (Backend Agent + QA Agent):
  - Unit Tests: Jest com cobertura >80%
    Comando: claude-code --c7 --seq --magi backend-unit-tests
  - Integration Tests: Supertest + PostgreSQL test DB
    Comando: claude-code --c7 --seq --magi backend-integration-tests
  - API E2E Tests: Playwright API testing
    Comando: claude-code --c7 --seq --magi api-e2e-tests

Mobile Testing (iOS Agent + Android Agent + QA Agent):
  - iOS Unit Tests: XCTest com Quick/Nimble
    Comando: claude-code --c7 --seq --magi ios-unit-tests
  - Android Unit Tests: JUnit + Mockk
    Comando: claude-code --c7 --seq --magi android-unit-tests
  - iOS UI Tests: XCUITest automation
    Comando: claude-code --c7 --seq --magi ios-ui-tests
  - Android UI Tests: Espresso + Compose testing
    Comando: claude-code --c7 --seq --magi android-ui-tests
  - Cross-platform E2E: Detox framework
    Comando: claude-code --c7 --seq --magi cross-platform-e2e

AI/ML Testing (AI Agent + QA Agent):
  - Prompt Testing: Custom framework para qualidade de respostas
    Comando: claude-code --c7 --seq --magi ai-prompt-testing
  - Output Quality: Automated metrics + manual validation
    Comando: claude-code --c7 --seq --magi ai-output-quality
  - Performance Testing: Load testing para APIs de IA
    Comando: claude-code --c7 --seq --magi ai-performance-testing

Security Testing (Security Agent + QA Agent):
  - Penetration Testing: OWASP automated tools
    Comando: claude-code --c7 --seq --magi security-penetration-testing
  - LGPD Compliance: Data privacy validation
    Comando: claude-code --c7 --seq --magi lgpd-compliance-testing
  - API Security: Authentication, authorization, rate limiting
    Comando: claude-code --c7 --seq --magi api-security-testing
```

### **📊 Performance Testing (Performance Agent)**

```bash
# Load testing coordenado
claude-code --c7 --seq --magi performance-load-testing \
  --tools="k6,artillery" \
  --targets="api-endpoints,pdf-generation,ai-suggestions" \
  --sla="response-time<500ms,throughput>1000rps"
```

## 📊 KPIs Técnicos

### **Performance**

- **App Loading Time:** < 3 segundos
- **API Response Time:** < 500ms (p95)
- **PDF Generation:** < 10 segundos
- **AI Suggestions:** < 15 segundos

### **Qualidade**

- **Code Coverage:** > 80%
- **Bug Density:** < 1 bug/KLOC
- **Crash Rate:** < 0.1%
- **App Store Rating:** > 4.5 estrelas

### **Segurança & Compliance**

- **LGPD Compliance:** 100%
- **Data Encryption:** AES-256
- **API Security:** OAuth2 + rate limiting
- **Vulnerability Scans:** Zero high/critical

## 🚀 Próximos Passos com Claude Code

### **🏁 Iniciação do Projeto (Próximas 2 semanas)**

#### **Semana 1: Setup dos Agentes**

```bash
# 1. Configuração inicial do projeto
claude-code --c7 --seq --magi project-initialization \
  --project="carreira-pro" \
  --version="1.0" \
  --agents="architecture,devops,backend,ios,android"

# 2. Setup da infraestrutura
claude-code --c7 --seq --magi infrastructure-setup \
  --cloud="aws" \
  --region="us-east-1" \
  --environment="dev,staging,prod"

# 3. Criação dos repositórios
claude-code --c7 --seq --magi repository-setup \
  --repos="backend,ios-app,android-app,infrastructure" \
  --ci-cd="github-actions"
```

#### **Semana 2: Kickoff Técnico**

```bash
# 4. Definição da arquitetura final
claude-code --c7 --seq --magi architecture-definition \
  --pattern="clean-architecture" \
  --communication="rest-api" \
  --database="postgresql"

# 5. Setup dos ambientes de desenvolvimento
claude-code --c7 --seq --magi dev-environment-setup \
  --containerization="docker" \
  --orchestration="docker-compose" \
  --local-db="postgresql"
```

### **🎯 Primeiro Mês - Sprints Iniciais**

#### **Sprint 0: Fundação (Semana 3-4)**

```bash
# Setup completo do ambiente
claude-code --c7 --seq --magi sprint-zero \
  --agents="devops,architecture,backend" \
  --deliverables="infrastructure,api-skeleton,ci-cd"
```

#### **Sprint 1: Autenticação (Semana 5-6)**

```bash
# Sistema de autenticação completo
claude-code --c7 --seq --magi authentication-system \
  --agents="backend,ios,android,security" \
  --features="jwt,oauth,biometric" \
  --providers="google,apple"
```

#### **Sprint 2: Perfil Básico (Semana 7-8)**

```bash
# Primeira versão do sistema de perfil
claude-code --c7 --seq --magi profile-system-v1 \
  --agents="backend,ios,android,ux" \
  --features="crud-profile,data-validation,sync"
```

### **📈 Monitoramento de Progresso**

#### **Dashboards dos Agentes**

```bash
# Dashboard de progresso geral
claude-code --c7 --seq --magi progress-dashboard \
  --metrics="code-coverage,performance,bugs,features-completed" \
  --agents="all" \
  --frequency="daily"

# Relatórios semanais automáticos
claude-code --c7 --seq --magi weekly-reports \
  --format="markdown,json" \
  --recipients="stakeholders" \
  --include="metrics,blockers,next-week-plan"
```

### **🔄 Coordenação Entre Agentes**

#### **Daily Sync Between Agents**

```bash
# Sincronização diária automática
claude-code --c7 --seq --magi daily-agent-sync \
  --time="09:00-UTC" \
  --agents="all-active" \
  --sync-items="dependencies,blockers,completed-tasks"
```

#### **Cross-Agent Dependencies**

```bash
# Gerenciamento de dependências entre agentes
claude-code --c7 --seq --magi dependency-management \
  --trigger="task-completion" \
  --notify="dependent-agents" \
  --auto-start="ready-tasks"
```

## 💡 Comandos Essenciais por Fase

### **Fase 1 - Fundação**

```bash
claude-code --c7 --seq --magi foundation-phase \
  --duration="2-months" \
  --focus="infrastructure,authentication,profile" \
  --agents="devops,backend,ios,android,security"
```

### **Fase 2 - Core Features**  

```bash
claude-code --c7 --seq --magi core-features-phase \
  --duration="2-months" \
  --focus="document-generation,ai-assistant,monetization" \
  --agents="backend,ai,pdf,ios,android,analytics"
```

### **Fase 3 - Premium Features**

```bash
claude-code --c7 --seq --magi premium-features-phase \
  --duration="2-months" \
  --focus="job-analysis,premium-templates,interview-prep" \
  --agents="ai,scraping,design,backend,ios,android"
```

### **Fase 4 - Lançamento**

```bash
claude-code --c7 --seq --magi launch-phase \
  --duration="2-months" \
  --focus="testing,optimization,deployment" \
  --agents="qa,performance,security,release,support"
```

---

## 💡 Recomendações Estratégicas

### **Decisões Técnicas Críticas**

1. **Priorizar MVP**: Focar nas features que geram valor imediato
2. **API First**: Desenvolver backend robusto para escalar
3. **AI como Diferencial**: Investir pesado na qualidade das sugestões de IA
4. **Performance Mobile**: Apps nativos para melhor UX
5. **Monitoramento 24/7**: Visibilidade total da plataforma desde o dia 1

### **Riscos e Mitigações**

- **Risco IA**: Dependência de APIs terceiros → Ter fallbacks
- **Risco Performance**: Geração de PDF lenta → Cache + otimização
- **Risco Conversão**: Paywall mal posicionado → A/B testing
- **Risco Competitivo**: Entrada de big techs → Foco em nicho brasileiro

Este plano está pronto para execução e pode ser adaptado conforme feedback da equipe e stakeholders!

---

## ✅ Registro de Tarefas (09/08/2025)

- **Ambiente de Desenvolvimento**:
  - **Backend (NestJS)**: executando em `http://localhost:55301`; CORS habilitado para origens `http://localhost:*`.
  - **Frontend (Next.js)**: executando em `http://localhost:55300`; `shadcn/ui` + `sonner` configurados; página inicial atualizada com botão “Testar Backend”.
  - **Variáveis**: `apps/frontend/.env.local` com `NEXT_PUBLIC_API_BASE_URL=http://localhost:55301`.
  - **Validação**: respostas HTTP 200 confirmadas para backend e frontend.

- **Operação de Portas**:
  - Portas elevadas para evitar conflitos locais: `55300` (frontend) e `55301` (backend).

- **Autenticação (MVP)**:
  - Backend: criado módulo `auth` com endpoint `POST /auth/login` retornando JWT (NestJS `@nestjs/jwt`).
  - Usuário demo: `demo@carreirapro.app` / `demo123`.
  - Frontend: criada página `GET /login` com formulário (shadcn `input`/`button`) que chama o backend e salva `cp_token` em `localStorage`.
  - Testes: login retorna `201` com `accessToken` válido; fluxo validado via requisição HTTP.

- **Fluxo Sequencial e Limpeza de Contexto**:
  - Tarefa concluída; decisões e endpoints salvos neste documento.
  - Contexto de execução limpo para próxima tarefa.

### Incremento (09/08/2025 - Noite)

- **Correções Next.js (App Router)**:
  - Extraído `HeaderClient` como Client Component para remover `onClick` de `layout.tsx` (Server Component) e evitar erro de handlers em Server.
  - Ajustadas URLs do backend para `55311` em `page.tsx`, `login/page.tsx`, `profile/page.tsx`, `src/lib/api.ts` e `.env.local` (`NEXT_PUBLIC_API_BASE_URL=http://localhost:55311`).

- **Rate Limiting & Observabilidade (Backend)**:
  - Rate limiting global via `ThrottlerGuard` (remoção de `@Throttle` por método).
  - Adicionados `AllExceptionsFilter` (filtro global) e `LoggingInterceptor` (tempo de requisição) em `main.ts`.
  - Endpoint `GET /health` criado.

- **Driver HTTP Nest**:
  - Instalado `@nestjs/platform-express` para corrigir “No driver (HTTP) has been selected”.

- **Persistência (início)**:
  - TypeORM integrado com configuração condicional: `DATABASE_URL` (Postgres) quando presente; fallback `sqlite` em memória para dev.
  - Criada entidade `ProfileEntity` e registrado `TypeOrmModule` em `AppModule` e `ProfileModule`.
  - `ProfileService` migrado para assíncrono com `Repository<ProfileEntity>` e fallback em memória.
  - DTO `UpdateProfileDto` com `class-validator`; `ValidationPipe` global habilitado.

- **Execução**:
  - Script raiz `dev:all` atualizado para usar `--prefix` (evitar `ENOWORKSPACES`).
  - Comandos: `npm run dev:all` (root) ou `cd apps/backend && npm run start:dev` e `cd apps/frontend && npm run dev`.

## ✅ Registro de Tarefas (10/08/2025)

- Infra e Scripts
  - Ajuste dos scripts raiz de dev para evitar ENOWORKSPACES; uso de portas: frontend 55310, backend 55311.
  - TypeORM com fallback sqlite em memória (dev). Dependências: `@nestjs/mapped-types`, `pdfkit`, `@types/pdfkit`, `puppeteer`.
  - Correções de portas ocupadas (kill automático) e estabilidade do watcher.

- Autenticação
  - `UserEntity` e integração do `AuthService` com TypeORM (login por e-mail, bcrypt).
  - Seeder de usuário demo em `main.ts` (email: demo@carreirapro.app / senha: demo123).
  - `GET /auth/me` protegido com `JwtAuthGuard`. DTOs com `class-validator`.

- Perfil (EPIC 1)
  - `ProfileEntity` expandido: `locationCity`, `locationState`, `locationCountry`, `linkedin`, `github`, `website`.
  - Validações de URL (`http/https`) no `UpdateProfileDto` para links.
  - Entidades e CRUD protegidos: `ExperienceEntity`, `EducationEntity`, `SkillEntity` (+ services/controllers).

- Documentos (EPIC 2 - MVP)
  - `DocumentEntity`: `id`, `ownerId`, `title`, `content`, `isArchived`, `templateKey`, `createdAt`, `updatedAt`.
  - `DocumentVersionEntity`: versionamento automático em `PUT /documents/:id/content`.
  - Serviço: listar (com `all` para incluir arquivados), criar, renomear, remover, obter, atualizar conteúdo, listar/restaurar versões, arquivar/desarquivar, duplicar.
  - Controlador (JWT):
    - `GET /documents?all=true|false`, `POST /documents`, `PUT /documents/:id`, `DELETE /documents/:id`, `GET /documents/:id`.
    - `PUT /documents/:id/content`, `GET /documents/:id/versions`, `POST /documents/:id/versions/:versionId/restore`.
    - `POST /documents/:id/archive`, `POST /documents/:id/unarchive`, `POST /documents/:id/duplicate`.
    - Templates: `GET /documents/templates/list`, `GET /documents/templates/custom`, `PUT /documents/templates/custom/:key`, `DELETE /documents/templates/custom/:key`, `PUT /documents/:id/template`.
    - Exportar PDF: `GET /documents/:id/export.pdf` com duas engines:
      - HTML → PDF via Puppeteer (templates HTML com placeholders + listas reais de experiências/educação/skills).
      - Fallback PDFKit (texto) com preenchimento de perfil e listas.

- Templates (MVP)
  - Registro de templates simples (`plain-default`, `compact`) com `body` (texto) e `html` (layout básico com variáveis: `{{fullName}}`, `{{headline}}`, `{{location*}}`, `{{linkedin/github/website}}`, `{{content}}`, `{{experiences}}`, `{{education}}`, `{{skills}}`).
  - Frontend `/documents/templates` para CRUD de templates custom usando os endpoints acima; seleção de template no editor combina templates padrão + custom.

- Frontend – Perfil
  - Página `/profile`: campos de perfil expostos (localização e links) com `PUT /profile`.
  - Seções de experiências, educação e skills: listar, criar, editar inline, remover.
  - Ordenação e paginação client-side nas listas.

- Frontend – Documentos
  - Página `/documents`: listar/criar/renomear/excluir; busca, ordenação, incluir arquivados; duplicar; arquivar/desarquivar; download de PDF (auth) direto na lista.
  - Editor `/documents/[id]`: carregar documento, templates (`GET /documents/templates`), seleção de template (`PUT /template`), autosave (debounce 2s) de conteúdo, histórico de versões (listar/restaurar), exportar PDF com token (blob/open/download).

- Testes
  - E2E backend cobrindo: login, `/health`, `/profile`, CRUD de experiências; ampliado para educação/skills.

- Observações
  - `API_BASE` unificado no frontend (`src/lib/api.ts`).
  - Ajustes de cabeçalho e rotas no app router (`header-client` com link para `Documentos`).
