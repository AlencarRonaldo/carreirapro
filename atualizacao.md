// apps/backend/src/cover-letters/cover-letter.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoverLetterService {
  private openaiApiKey: string;

  constructor(
    @InjectRepository(CoverLetter)
    private coverLetterRepository: Repository<CoverLetter>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.openaiApiKey = this.configService.get('OPENAI_API_KEY');
  }

  // Gerar carta de apresentação personalizada
  async generateCoverLetter(
    userId: string,
    generateDto: GenerateCoverLetterDto,
  ) {
    const { profileData, jobAnalysis, tone, language } = generateDto;

    // Criar prompt detalhado para a carta
    const prompt = this.buildCoverLetterPrompt(
      profileData,
      jobAnalysis,
      tone,
      language,
    );

    // Chamar OpenAI para gerar a carta
    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em redação de cartas de apresentação profissionais. 
                       Crie cartas persuasivas, personalizadas e que demonstrem fit perfeito com a vaga.
                       Use técnicas de storytelling e destaque resultados quantificáveis.
                       Mantenha um tom ${tone || 'profissional'} e escreva em ${language || 'português'}.`,
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const letterContent = response.data.choices[0].message.content;

    // Salvar a carta gerada
    const coverLetter = this.coverLetterRepository.create({
      userId,
      jobTitle: jobAnalysis.title,
      company: jobAnalysis.company,
      content: letterContent,
      tone,
      language,
      metadata: {
        jobAnalysisId: jobAnalysis.id,
        generatedAt: new Date(),
      },
    });

    const saved = await this.coverLetterRepository.save(coverLetter);

    // Analisar qualidade da carta
    const qualityScore = await this.analyzeCoverLetterQuality(letterContent, jobAnalysis);

    return {
      ...saved,
      qualityScore,
      suggestions: qualityScore.suggestions,
    };
  }

  // Construir prompt para carta de apresentação
  private buildCoverLetterPrompt(
    profile: any,
    jobAnalysis: any,
    tone: string,
    language: string,
  ): string {
    return `
    Crie uma carta de apresentação profissional com base nos seguintes dados:

    DADOS DO CANDIDATO:
    Nome: ${profile.fullName}
    Título Profissional: ${profile.headline}
    Resumo: ${profile.bio}
    
    Experiências Relevantes:
    ${profile.experiences.map(exp => `
      - ${exp.title} na ${exp.company} (${exp.startDate} - ${exp.endDate || 'Presente'})
        ${exp.description}
        Principais realizações: ${exp.achievements?.join(', ') || 'N/A'}
    `).join('\n')}
    
    Habilidades Principais:
    ${profile.skills.map(skill => `- ${skill.name} (${skill.level})`).join('\n')}
    
    DADOS DA VAGA:
    Empresa: ${jobAnalysis.company}
    Cargo: ${jobAnalysis.title}
    Requisitos Principais: ${jobAnalysis.requiredSkills.join(', ')}
    Responsabilidades: ${jobAnalysis.responsibilities.join(', ')}
    Palavras-chave importantes: ${jobAnalysis.keywords.join(', ')}
    
    INSTRUÇÕES:
    1. Comece com uma abertura impactante que mostre conhecimento sobre a empresa
    2. No primeiro parágrafo, mencione a vaga específica e onde a encontrou
    3. No segundo parágrafo, conecte suas experiências mais relevantes com os requisitos da vaga
    4. No terceiro parágrafo, destaque resultados quantificáveis e achievements
    5. No quarto parágrafo, demonstre fit cultural e interesse genuíno na empresa
    6. Finalize com call-to-action claro e profissional
    7. Use palavras-chave da vaga naturalmente ao longo do texto
    8. Mantenha entre 250-400 palavras
    9. Tom: ${tone}
    10. Idioma: ${language}
    
    FORMATO:
    [Cidade], [Data]
    
    Prezado(a) [Nome do Recrutador ou "Equipe de Recrutamento"],
    
    [Corpo da carta]
    
    Atenciosamente,
    [Nome do Candidato]
    `;
  }

  // Analisar qualidade da carta de apresentação
  private async analyzeCoverLetterQuality(
    letterContent: string,
    jobAnalysis: any,
  ) {
    const prompt = `
    Analise a qualidade desta carta de apresentação considerando:
    1. Alinhamento com os requisitos da vaga
    2. Uso de palavras-chave relevantes
    3. Clareza e concisão
    4. Impacto da abertura
    5. Demonstração de valor
    6. Call-to-action
    
    Carta:
    ${letterContent}
    
    Requisitos da vaga:
    ${JSON.stringify(jobAnalysis)}
    
    Retorne um JSON com:
    - score (0-100)
    - strengths (array de pontos fortes)
    - weaknesses (array de pontos a melhorar)
    - suggestions (array de sugestões específicas)
    `;

    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de cartas de apresentação.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return JSON.parse(response.data.choices[0].message.content);
  }

  // Editar carta manualmente
  async updateCoverLetter(
    userId: string,
    letterId: string,
    updateDto: UpdateCoverLetterDto,
  ) {
    const letter = await this.coverLetterRepository.findOne({
      where: { id: letterId, userId },
    });

    if (!letter) {
      throw new Error('Cover letter not found');
    }

    letter.content = updateDto.content;
    letter.updatedAt = new Date();

    return await this.coverLetterRepository.save(letter);
  }

  // Templates de carta pré-definidos
  async getCoverLetterTemplates() {
    return [
      {
        id: 'traditional',
        name: 'Tradicional',
        description: 'Formato clássico e profissional',
        structure: [
          'Saudação formal',
          'Introdução com menção à vaga',
          'Experiências relevantes',
          'Conquistas e resultados',
          'Interesse na empresa',
          'Call-to-action',
          'Encerramento formal',
        ],
      },
      {
        id: 'modern',
        name: 'Moderno',
        description: 'Abordagem contemporânea e direta',
        structure: [
          'Hook impactante',
          'Proposta de valor clara',
          'Cases de sucesso',
          'Fit cultural',
          'Próximos passos',
        ],
      },
      {
        id: 'storytelling',
        name: 'Storytelling',
        description: 'Narrativa envolvente',
        structure: [
          'História de abertura',
          'Desafio enfrentado',
          'Ação tomada',
          'Resultado alcançado',
          'Conexão com a vaga',
          'Visão de futuro',
        ],
      },
      {
        id: 'technical',
        name: 'Técnico',
        description: 'Foco em competências técnicas',
        structure: [
          'Expertise técnica',
          'Stack tecnológico',
          'Projetos relevantes',
          'Contribuições open source',
          'Certificações',
          'Disponibilidade',
        ],
      },
    ];
  }

  // Variações de carta para A/B testing
  async generateCoverLetterVariations(
    userId: string,
    generateDto: GenerateCoverLetterDto,
  ) {
    const variations = [];
    const tones = ['profissional', 'entusiasta', 'confiante'];
    
    for (const tone of tones) {
      const letter = await this.generateCoverLetter(userId, {
        ...generateDto,
        tone,
      });
      variations.push({
        tone,
        content: letter.content,
        qualityScore: letter.qualityScore,
      });
    }

    return {
      variations,
      recommendation: variations.reduce((best, current) => 
        current.qualityScore.score > best.qualityScore.score ? current : best
      ),
    };
  }
}

// apps/backend/src/cover-letters/entities/cover-letter.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cover_letters')
export class CoverLetter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  jobTitle: string;

  @Column()
  company: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  tone: string;

  @Column({ default: 'português' })
  language: string;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// apps/backend/src/cover-letters/dto/generate-cover-letter.dto.ts

import { IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateCoverLetterDto {
  @IsObject()
  profileData: any;

  @IsObject()
  jobAnalysis: any;

  @IsOptional()
  @IsString()
  tone?: string; // profissional, entusiasta, confiante

  @IsOptional()
  @IsString()
  language?: string; // português, inglês, espanhol
}

export class UpdateCoverLetterDto {
  @IsString()
  content: string;
}
1. Integração da Análise de Vagas (URGENTE)

Adicionar módulo de Jobs no backend
Criar interface no frontend para colar URL/descrição da vaga
Implementar otimização automática do currículo

2. Melhorar Templates de Currículo — CONCLUÍDO (backend)

- Adicionados 3 templates: `modern-grid` (2 colunas), `minimal-clean`, `ats-black-white`
- Todos compatíveis com placeholders existentes e exportação PDF

3. Sistema de Score e Sugestões

Implementar cálculo de compatibilidade vaga x perfil
Mostrar sugestões de melhorias
Destacar keywords faltantes

4. Carta de Apresentação Automática

Integrar geração via IA
Permitir edição manual
Múltiplas variações para teste

5. Dashboard de Aplicações — CONCLUÍDO (backend + frontend)

- Backend: `applications` com CRUD (entity, service, controller)
- Backend: métricas `GET /applications/metrics/summary` e exportação `GET /applications/export.csv?status=...`
 - Backend: exportação PDF `GET /applications/export.pdf?status=...`
  - Frontend: página `/applications` com filtros por status, cards de contagem e export CSV/PDF
- Permite acompanhar status (salva, aplicada, entrevista, oferta, recusada)

💡 Diferencial Competitivo
O Carreira Pro se destacará por:

Foco em ATS - Garantir que os currículos passem nas triagens automáticas
Personalização por Vaga - Cada aplicação com currículo otimizado
IA Contextual - Sugestões baseadas na vaga específica
Templates Modernos - Designs profissionais que funcionam
Workflow Completo - Do perfil ao envio da candidatura

## Atualização – Planos, PWA, Gating e Quotas (fase atual)

Entrega desta etapa:

- PWA (frontend)
  - Manifesto e service worker com versionamento de cache e estratégias por tipo de recurso; registro no layout e meta tags PWA.
  - Pasta de ícones PNG preparada (falta inserir arquivos físicos em `public/icons/`).

- Importação do LinkedIn (perfil)
  - Backend: `POST /profile/import/linkedin` (Proxycurl condicional via `PROXYCURL_API_KEY`, fallback no‑op sem chave).
  - Frontend (`/profile`): botão “Importar do LinkedIn” + campos `email` e `phone` adicionados.

- Planos e assinaturas (gating técnico + checkout mock)
  - `UserEntity`: campos `plan` (`starter|pro|team`) e `subscriptionStatus`.
  - Auth: `register` aceita `selectedPlan` e retorna `requiresPayment`; `me` retorna `plan`/`subscriptionStatus`; JWT guard hidrata `req.user` com plano/status.
  - Billing (DEV): `POST /billing/checkout-session` (mock) e `GET /billing/mock/success` (ativa Pro/Team). `POST /billing/webhook` pronto para gateway real.
  - Frontend: seleção de plano no `/login` (Starter/Pro/Team) e `/checkout` para redirecionamento.

- Templates (premium, preview, export)
  - `templates.data.ts`: campo `premium` por template e exposto em `GET /documents/templates/list`.
  - `/documents/templates`: para Starter, premium mostra selo “Pro”, bloqueia preview/export e exibe CTA “Fazer Upgrade”.
  - Export PDF aplica watermark apenas para `starter`; placeholders atualizados (`linkedin/email/phone`).

- Quotas (Starter)
  - `usage_counters` + `UsageService` para contagem mensal (formato `YYYY-MM`).
  - Limite aplicado: `POST /jobs/analyze` restrito a 3 análises/mês para Starter.

- Gating Pro/Team
  - Guard `RequireProPlanGuard` em: `cover-letters/generate`, `cover-letters/variations`, `jobs/score`, `jobs/optimize-resume`.

Próximos passos

- Integração de pagamento real (Stripe/Pagar.me) + webhooks e portal do assinante.
- Quotas adicionais e página “Minha Assinatura”.
- UI: melhorar badges/CTA de premium e mensagens de limite.

## Atualização – Landing, UI/UX, Cartas e Assinatura (continuação)

Entrega desta etapa:

- Landing (site principal)
  - Reescrita com foco em conversão, UI/UX moderna, header sticky com blur e dark mode.
  - Novo carrossel no banner principal (3 slides): visão geral, Compatível com ATS (por que é essencial), Análise de vaga com IA (por que é importante).
  - Seções: Recursos (com ícones), Como funciona (5 passos clicáveis), Vitrine de modelos (com imagens HD), Planos.
  - Removido botão “Testar Backend” e seção de depoimentos; removido texto “Inspirado nas melhores práticas...”.
  - Arquivo: `apps/frontend/src/app/page.tsx`.

- Imagens/Assets
  - Vitrine de templates com imagens em alta definição; suporte a PNG @2x/@3x (retina) com fallback SVG.
  - Adicionados SVGs base: `public/templates/{ats-bw.svg, modern-grid.svg, abnt-classic.svg}`.
  - Suporte a PNGs: `public/templates/<key>.png`, `<key>@2x.png`, `<key>@3x.png` (inserir arquivos reais quando disponíveis).

- Navegação e header
  - Header sticky com blur; botão de Login do lado direito para visitantes; logout redireciona para a landing.
  - Renomeado “Documentos” → “Currículos Gerados”; “Cartas” → “Carta de Apresentação”.
  - Arquivo: `apps/frontend/src/components/header-client.tsx`.

- Dark mode
  - Habilitado com `next-themes`; alternador de tema no header.
  - Ajustes de contraste em cards/links no tema escuro.
  - Arquivos: `apps/frontend/src/app/layout.tsx`, `apps/frontend/src/components/header-client.tsx`, `apps/frontend/src/app/page.tsx`.

- Planos e cadastro
  - Página de planos dedicada: `apps/frontend/src/app/plans/page.tsx`.
  - Login lê `?plan=` e `?mode=register` para pré-seleção e abrir direto o cadastro.
  - Removida listagem de planos da página de login, mantendo apenas formulários.

- Currículos (Documentos)
  - Página renomeada visualmente para “Meus Currículos”, com ênfase em reimpressão (Baixar PDF).
  - Arquivo: `apps/frontend/src/app/documents/page.tsx`.

- Cartas de apresentação (frontend)
  - Nova aba/página: `apps/frontend/src/app/cover-letters/page.tsx` com fluxo:
    - Analisar vaga (URL/descrição) → gerar carta (Pro/Team) → editar conteúdo e ver score de qualidade.
  - Link adicionado no header.

- Assinatura (frontend/backend)
  - Página “Minha assinatura”: `apps/frontend/src/app/subscription/page.tsx` com plano/status e botão “Gerenciar assinatura”.
  - Backend: `POST /billing/portal` (Stripe Portal quando configurado).
  - Stripe Service: `createPortalSession` e webhook já prontos; checkout real habilita ao setar chaves.

- Gating/Quotas (recordatório)
  - Guard Pro/Team em cartas e score/otimização de vaga.
  - Starter limitado a 3 análises de vaga/mês.

Arquivos principais alterados nesta fase:

- Frontend
  - `src/app/page.tsx` (landing e carrossel)
  - `src/app/plans/page.tsx` (planos)
  - `src/app/login/page.tsx` (pré-seleção de plano e modo)
  - `src/app/documents/page.tsx` (Meus Currículos)
  - `src/app/cover-letters/page.tsx` (Cartas de apresentação)
  - `src/app/subscription/page.tsx` (Minha assinatura)
  - `src/components/header-client.tsx` (header sticky, login à direita, temas)
  - `src/app/layout.tsx` (ThemeProvider, cores base)
  - `public/templates/*.svg` (imagens de modelos)

- Backend
  - `src/billing/stripe.service.ts` (checkout/portal/webhook helpers)
  - `src/billing/billing.controller.ts` (checkout-session, portal, webhook)

Próximos passos sugeridos

- Inserir PNGs retina reais dos templates em `public/templates/`.
- Integrar Stripe com chaves de produção e testar checkout/portal.
- Opcional: animações de entrada (framer-motion) e seção “Clientes/Imprensa” com logos reais.