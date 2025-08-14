"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverLettersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cover_letter_entity_1 = require("./cover-letter.entity");
let CoverLettersService = class CoverLettersService {
    coverLetters;
    config;
    http;
    openaiApiKey;
    constructor(coverLetters, config, http) {
        this.coverLetters = coverLetters;
        this.config = config;
        this.http = http;
        this.openaiApiKey = this.config.get('OPENAI_API_KEY');
    }
    isOllama() {
        return ((this.config.get('AI_PROVIDER') || '').toLowerCase() === 'ollama');
    }
    getModel(defaultModel) {
        return this.config.get('AI_MODEL') || defaultModel;
    }
    stripJsonFences(s) {
        const trimmed = (s || '').trim();
        if (trimmed.startsWith('```')) {
            return trimmed
                .replace(/^```[a-zA-Z]*\n/, '')
                .replace(/```\s*$/, '')
                .trim();
        }
        return trimmed;
    }
    async chatToText({ system, user, expectJson = false, }) {
        if (this.isOllama()) {
            const model = this.getModel('llama3.1');
            const resp = await (0, rxjs_1.firstValueFrom)(this.http.post('http://localhost:11434/api/chat', {
                model,
                messages: [
                    { role: 'system', content: system },
                    {
                        role: 'user',
                        content: user +
                            (expectJson
                                ? '\n\nResponda SOMENTE com JSON válido, sem comentários.'
                                : ''),
                    },
                ],
                stream: false,
            }, { timeout: 20000 }));
            const content = resp.data?.message?.content ?? '';
            return expectJson ? this.stripJsonFences(content) : content;
        }
        const model = this.getModel(expectJson ? 'gpt-4o-mini' : 'gpt-4o');
        const response = await (0, rxjs_1.firstValueFrom)(this.http.post('https://api.openai.com/v1/chat/completions', {
            model,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
            temperature: expectJson ? 0.3 : 0.7,
            ...(expectJson
                ? { response_format: { type: 'json_object' } }
                : {}),
        }, {
            headers: {
                Authorization: `Bearer ${this.openaiApiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 20000,
        }));
        const text = response.data?.choices?.[0]?.message?.content ?? '';
        return expectJson ? this.stripJsonFences(text) : text;
    }
    async generateCoverLetter(userId, generateDto) {
        const { profileData, jobAnalysis, tone, language } = generateDto;
        const prompt = this.buildCoverLetterPrompt(profileData, jobAnalysis, tone ?? 'profissional', language ?? 'português');
        let letterContent = '';
        if (!this.openaiApiKey && !this.isOllama()) {
            const nome = profileData?.fullName || 'Candidato';
            const cargo = jobAnalysis?.title || 'a vaga';
            const empresa = jobAnalysis?.company || 'sua empresa';
            letterContent = `${new Date().toLocaleDateString('pt-BR')}

Prezados recrutadores,

Tenho grande interesse em ${cargo} na ${empresa}. Minha experiência em ${profileData?.experiences?.[0]?.title || 'minha área de atuação'} e competências como ${(profileData?.skills || [])
                .slice(0, 5)
                .map((s) => s?.name)
                .filter(Boolean)
                .join(', ')} me habilitam a contribuir rapidamente.

Ao analisar os requisitos (ex.: ${(jobAnalysis?.requiredSkills || []).slice(0, 5).join(', ')}), identifiquei forte alinhamento com minhas experiências, especialmente em ${(profileData?.experiences?.[0]?.achievements || []).slice(0, 2).join(', ')}.

Estou motivado(a) para somar com resultados e colaborar com a equipe.

Atenciosamente,
${nome}`;
        }
        else {
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
        let qualityScore;
        if (!this.openaiApiKey && !this.isOllama()) {
            const kw = (jobAnalysis?.keywords || []).slice(0, 12);
            const hits = kw.filter((k) => letterContent.toLowerCase().includes(String(k).toLowerCase()));
            const score = Math.max(40, Math.min(95, Math.round((hits.length / Math.max(1, kw.length)) * 100)));
            qualityScore = {
                score,
                strengths: hits.map((k) => `Uso de palavra-chave: ${k}`),
                weaknesses: kw
                    .filter((k) => !hits.includes(k))
                    .map((k) => `Poderia mencionar: ${k}`),
                suggestions: [],
            };
        }
        else {
            qualityScore = await this.analyzeCoverLetterQuality(letterContent, jobAnalysis);
        }
        return {
            ...saved,
            qualityScore,
            suggestions: qualityScore?.suggestions,
        };
    }
    buildCoverLetterPrompt(profile, jobAnalysis, tone, language) {
        return `
Crie uma carta de apresentação profissional com base nos seguintes dados:

DADOS DO CANDIDATO:
Nome: ${profile.fullName}
Título Profissional: ${profile.headline}
Resumo: ${profile.bio}

Experiências Relevantes:
${(profile.experiences || [])
            .map((exp) => `- ${exp.title} na ${exp.company} (${exp.startDate} - ${exp.endDate || 'Presente'})
  ${exp.description}
  Principais realizações: ${(exp.achievements || []).join(', ') || 'N/A'}`)
            .join('\n')}

Habilidades Principais:
${(profile.skills || [])
            .map((skill) => `- ${skill.name} (${skill.level})`)
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
    async analyzeCoverLetterQuality(letterContent, jobAnalysis) {
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
        const system2 = 'Você é um especialista em análise de cartas de apresentação.';
        try {
            const content = await this.chatToText({
                system: system2,
                user: prompt,
                expectJson: true,
            });
            return JSON.parse(content);
        }
        catch {
            return { score: 0, strengths: [], weaknesses: [], suggestions: [] };
        }
    }
    async updateCoverLetter(userId, letterId, updateDto) {
        const letter = await this.coverLetters.findOne({
            where: { id: letterId, userId },
        });
        if (!letter)
            throw new Error('Cover letter not found');
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
    async generateCoverLetterVariations(userId, generateDto) {
        const tones = ['profissional', 'entusiasta', 'confiante'];
        const variations = [];
        for (const t of tones) {
            const letter = await this.generateCoverLetter(userId, {
                ...generateDto,
                tone: t,
            });
            variations.push({
                tone: t,
                content: letter.content ?? letter.content,
                qualityScore: letter.qualityScore,
            });
        }
        const recommendation = variations.reduce((best, cur) => cur.qualityScore?.score > (best.qualityScore?.score ?? -1) ? cur : best, variations[0]);
        return { variations, recommendation };
    }
};
exports.CoverLettersService = CoverLettersService;
exports.CoverLettersService = CoverLettersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cover_letter_entity_1.CoverLetterEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        axios_1.HttpService])
], CoverLettersService);
//# sourceMappingURL=cover-letters.service.js.map