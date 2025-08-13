import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CoverLetterEntity } from './cover-letter.entity';
import { GenerateCoverLetterDto, UpdateCoverLetterDto } from './dto';

@Injectable()
export class CoverLettersService {
  private readonly openaiApiKey: string | undefined;

  constructor(
    @InjectRepository(CoverLetterEntity)
    private readonly coverLetters: Repository<CoverLetterEntity>,
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.openaiApiKey = this.config.get<string>('OPENAI_API_KEY');
  }

  private isOllama() {
    return (
      (this.config.get<string>('AI_PROVIDER') || '').toLowerCase() === 'ollama'
    );
  }

  private getModel(defaultModel: string) {
    return this.config.get<string>('AI_MODEL') || defaultModel;
  }

  private stripJsonFences(s: string): string {
    const trimmed = (s || '').trim();
    if (trimmed.startsWith('```')) {
      return trimmed
        .replace(/^```[a-zA-Z]*\n/, '')
        .replace(/```\s*$/, '')
        .trim();
    }
    return trimmed;
  }

  private async chatToText({
    system,
    user,
    expectJson = false,
  }: {
    system: string;
    user: string;
    expectJson?: boolean;
  }): Promise<string> {
    if (this.isOllama()) {
      const model = this.getModel('llama3.1');
      const resp = await firstValueFrom(
        this.http.post(
          'http://localhost:11434/api/chat',
          {
            model,
            messages: [
              { role: 'system', content: system },
              {
                role: 'user',
                content:
                  user +
                  (expectJson
                    ? '\n\nResponda SOMENTE com JSON válido, sem comentários.'
                    : ''),
              },
            ],
            stream: false,
          },
          { timeout: 20000 },
        ),
      );
      const content: string = resp.data?.message?.content ?? '';
      return expectJson ? this.stripJsonFences(content) : content;
    }
    const model = this.getModel(expectJson ? 'gpt-4o-mini' : 'gpt-4o');
    const response = await firstValueFrom(
      this.http.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          temperature: expectJson ? 0.3 : 0.7,
          ...(expectJson
            ? { response_format: { type: 'json_object' } as any }
            : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 20000,
        },
      ),
    );
    const text: string = response.data?.choices?.[0]?.message?.content ?? '';
    return expectJson ? this.stripJsonFences(text) : text;
  }

  async generateCoverLetter(
    userId: string,
    generateDto: GenerateCoverLetterDto,
  ) {
    const { profileData, jobAnalysis, tone, language } = generateDto;

    const prompt = this.buildCoverLetterPrompt(
      profileData,
      jobAnalysis,
      tone ?? 'profissional',
      language ?? 'português',
    );
    let letterContent = '';
    // Fallback local sem IA externa
    if (!this.openaiApiKey && !this.isOllama()) {
      const nome = profileData?.fullName || 'Candidato';
      const cargo = jobAnalysis?.title || 'a vaga';
      const empresa = jobAnalysis?.company || 'sua empresa';
      letterContent = `${new Date().toLocaleDateString('pt-BR')}

Prezados recrutadores,

Tenho grande interesse em ${cargo} na ${empresa}. Minha experiência em ${profileData?.experiences?.[0]?.title || 'minha área de atuação'} e competências como ${(
        profileData?.skills || []
      )
        .slice(0, 5)
        .map((s: any) => s?.name)
        .filter(Boolean)
        .join(', ')} me habilitam a contribuir rapidamente.

Ao analisar os requisitos (ex.: ${(jobAnalysis?.requiredSkills || []).slice(0, 5).join(', ')}), identifiquei forte alinhamento com minhas experiências, especialmente em ${(profileData?.experiences?.[0]?.achievements || []).slice(0, 2).join(', ')}.

Estou motivado(a) para somar com resultados e colaborar com a equipe.

Atenciosamente,
${nome}`;
    } else {
      const system = `Você é um especialista em redação de cartas de apresentação profissionais. Crie cartas persuasivas, personalizadas e que demonstrem fit perfeito com a vaga. Use técnicas de storytelling e destaque resultados quantificáveis. Mantenha um tom ${tone || 'profissional'} e escreva em ${language || 'português'}.`;
      letterContent = await this.chatToText({
        system,
        user: prompt,
        expectJson: false,
      });
    }

    const entity = this.coverLetters.create({
      userId,
      jobTitle: jobAnalysis?.title ?? '',
      company: jobAnalysis?.company ?? '',
      content: letterContent,
      tone: tone ?? null,
      language: language ?? 'português',
      metadata: {
        jobAnalysisId: jobAnalysis?.id ?? null,
        generatedAt: new Date().toISOString(),
      },
    });
    const saved = await this.coverLetters.save(entity);

    let qualityScore: any;
    if (!this.openaiApiKey && !this.isOllama()) {
      // heurística simples
      const kw = (jobAnalysis?.keywords || []).slice(0, 12);
      const hits = kw.filter((k: string) =>
        letterContent.toLowerCase().includes(String(k).toLowerCase()),
      );
      const score = Math.max(
        40,
        Math.min(95, Math.round((hits.length / Math.max(1, kw.length)) * 100)),
      );
      qualityScore = {
        score,
        strengths: hits.map((k: string) => `Uso de palavra-chave: ${k}`),
        weaknesses: kw
          .filter((k: string) => !hits.includes(k))
          .map((k: string) => `Poderia mencionar: ${k}`),
        suggestions: [],
      };
    } else {
      qualityScore = await this.analyzeCoverLetterQuality(
        letterContent,
        jobAnalysis,
      );
    }

    return {
      ...saved,
      qualityScore,
      suggestions: qualityScore?.suggestions,
    };
  }

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
${(profile.experiences || [])
  .map(
    (
      exp: any,
    ) => `- ${exp.title} na ${exp.company} (${exp.startDate} - ${exp.endDate || 'Presente'})
  ${exp.description}
  Principais realizações: ${(exp.achievements || []).join(', ') || 'N/A'}`,
  )
  .join('\n')}

Habilidades Principais:
${(profile.skills || [])
  .map((skill: any) => `- ${skill.name} (${skill.level})`)
  .join('\n')}

DADOS DA VAGA:
Empresa: ${jobAnalysis.company}
Cargo: ${jobAnalysis.title}
Requisitos Principais: ${(jobAnalysis.requiredSkills || []).join(', ')}
Responsabilidades: ${(jobAnalysis.responsibilities || []).join(', ')}
Palavras-chave importantes: ${(jobAnalysis.keywords || []).join(', ')}

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

    const system2 =
      'Você é um especialista em análise de cartas de apresentação.';
    try {
      const content = await this.chatToText({
        system: system2,
        user: prompt,
        expectJson: true,
      });
      return JSON.parse(content);
    } catch {
      return { score: 0, strengths: [], weaknesses: [], suggestions: [] };
    }
  }

  async updateCoverLetter(
    userId: string,
    letterId: string,
    updateDto: UpdateCoverLetterDto,
  ) {
    const letter = await this.coverLetters.findOne({
      where: { id: letterId, userId },
    });
    if (!letter) throw new Error('Cover letter not found');
    letter.content = updateDto.content;
    letter.updatedAt = new Date();
    return this.coverLetters.save(letter);
  }

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

  async generateCoverLetterVariations(
    userId: string,
    generateDto: GenerateCoverLetterDto,
  ) {
    const tones = ['profissional', 'entusiasta', 'confiante'];
    const variations: Array<any> = [];
    for (const t of tones) {
      const letter = await this.generateCoverLetter(userId, {
        ...generateDto,
        tone: t,
      });
      variations.push({
        tone: t,
        content: (letter as any).content ?? (letter as any).content,
        qualityScore: (letter as any).qualityScore,
      });
    }
    const recommendation = variations.reduce(
      (best, cur) =>
        cur.qualityScore?.score > (best.qualityScore?.score ?? -1) ? cur : best,
      variations[0],
    );
    return { variations, recommendation };
  }
}
