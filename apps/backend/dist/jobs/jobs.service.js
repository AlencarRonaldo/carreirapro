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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let JobsService = class JobsService {
    http;
    config;
    openaiApiKey;
    PT_STOPWORDS = new Set([
        'a',
        'o',
        'as',
        'os',
        'de',
        'da',
        'do',
        'das',
        'dos',
        'e',
        'em',
        'para',
        'por',
        'com',
        'sem',
        'que',
        'na',
        'no',
        'nas',
        'nos',
        'ao',
        'aos',
        'à',
        'às',
        'via',
        'um',
        'uma',
        'sobre',
        'se',
        'sua',
        'seu',
        'suas',
        'seus',
        'responsabilidades',
        'atribuições',
        'requisitos',
        'qualificações',
        'local',
        'localidade',
        'modelo',
        'remoto',
        'presencial',
        'híbrido',
        'hibrido',
    ].map((w) => this.normalize(w)));
    constructor(http, config) {
        this.http = http;
        this.config = config;
        this.openaiApiKey = this.config.get('OPENAI_API_KEY');
    }
    isOllama() {
        return ((this.config.get('AI_PROVIDER') || '').toLowerCase() === 'ollama');
    }
    getModel(defaultModel) {
        return this.config.get('AI_MODEL') || defaultModel;
    }
    normalizeUrl(url) {
        if (!url)
            return null;
        const trimmed = url.trim();
        if (!trimmed)
            return null;
        if (/^https?:\/\//i.test(trimmed))
            return trimmed;
        return `https://${trimmed}`;
    }
    stripHtml(html) {
        try {
            const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
            const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, ' ');
            const withNewlines = withoutStyles
                .replace(/<br\s*\/?\s*>/gi, '\n')
                .replace(/<p[\s\S]*?>/gi, '\n')
                .replace(/<li[\s\S]*?>/gi, '\n• ')
                .replace(/<h[1-6][\s\S]*?>/gi, '\n');
            const withoutTags = withNewlines.replace(/<[^>]+>/g, ' ');
            return withoutTags
                .replace(/\s+/g, ' ')
                .replace(/[\t\r]+/g, ' ')
                .replace(/\n\s*\n/g, '\n')
                .trim();
        }
        catch {
            return html;
        }
    }
    async fetchUrlText(url) {
        const normalized = this.normalizeUrl(url);
        if (!normalized)
            return '';
        try {
            const resp = await (0, rxjs_1.firstValueFrom)(this.http.get(normalized, {
                responseType: 'text',
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; CarreiraProBot/1.0)',
                },
            }));
            const data = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
            return this.stripHtml(data).slice(0, 25000);
        }
        catch {
            return '';
        }
    }
    normalize(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }
    extractSection(text, names) {
        if (!text)
            return [];
        const normalized = this.normalize(text);
        let firstIdx = -1;
        for (const name of names) {
            const i = normalized.indexOf(this.normalize(name));
            if (i >= 0) {
                firstIdx = firstIdx === -1 ? i : Math.min(firstIdx, i);
            }
        }
        const slice = firstIdx >= 0 ? text.slice(firstIdx, firstIdx + 4000) : text;
        return slice
            .split(/\n|•\s|\s-\s|\*\s|\r/g)
            .map((s) => s.trim())
            .filter((s) => s.length >= 5)
            .slice(0, 30);
    }
    extractKeywords(text) {
        const n = this.normalize(text);
        const tokens = (n.match(/[a-z0-9\+\#\-]{3,}/g) || []).filter((t) => !this.PT_STOPWORDS.has(t));
        const bigrams = [];
        for (let i = 0; i < tokens.length - 1; i++) {
            const bg = `${tokens[i]} ${tokens[i + 1]}`;
            if (!this.PT_STOPWORDS.has(tokens[i]) && !this.PT_STOPWORDS.has(tokens[i + 1])) {
                bigrams.push(bg);
            }
        }
        const counts = new Map();
        for (const t of [...tokens, ...bigrams]) {
            counts.set(t, (counts.get(t) || 0) + 1);
        }
        return [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([t]) => t)
            .filter((t) => t.length >= 3)
            .slice(0, 30);
    }
    tryGuessCompany(text, url) {
        const lines = text.split(/\n/g).map((l) => l.trim());
        for (const l of lines.slice(0, 30)) {
            const m = l.match(/^(empresa|company)\s*:\s*(.+)$/i);
            if (m && m[2])
                return m[2].trim().slice(0, 120);
        }
        if (url) {
            try {
                const u = new URL(this.normalizeUrl(url) || url);
                const host = u.hostname.replace(/^www\./, '');
                const base = host.split('.')[0];
                if (base)
                    return base.charAt(0).toUpperCase() + base.slice(1);
            }
            catch { }
        }
        return '';
    }
    basicExtract(text, url) {
        const lines = text
            .split(/\n/g)
            .map((l) => l.trim())
            .filter(Boolean);
        const titleLine = lines.find((l) => /^(cargo|posição|vaga|job\s*title)/i.test(this.normalize(l))) ||
            lines.slice(0, 8).sort((a, b) => b.length - a.length)[0] ||
            (text.split(/\n|\.\s/)[0] || '');
        const responsibilities = this.extractSection(text, [
            'Responsabilidades',
            'Atribuições',
            'O que você fará',
            'Suas responsabilidades',
        ]).slice(0, 20);
        const requiredSkills = this.extractSection(text, [
            'Requisitos',
            'Qualificações',
            'Conhecimentos',
            'Skills',
            'Competências',
        ]).slice(0, 20);
        const keywords = this.extractKeywords([titleLine, ...responsibilities, ...requiredSkills].join(' '));
        return {
            id: 'local-' + Math.random().toString(36).slice(2),
            company: this.tryGuessCompany(text, url),
            title: titleLine.slice(0, 140),
            requiredSkills,
            responsibilities,
            keywords,
        };
    }
    async analyzeJob(input) {
        const urlText = await this.fetchUrlText(input?.url);
        const text = `${input?.description ?? ''}\n${urlText}`.trim();
        const system = 'Extraia campos estruturados da vaga para uso em ATS e matching com perfil.';
        const user = `Texto da vaga:\n${text}\n\nRetorne JSON com: id (uuid v4), company, title, requiredSkills[], responsibilities[], keywords[]`;
        if (this.isOllama()) {
            try {
                const model = this.getModel('llama3.1');
                const resp = await (0, rxjs_1.firstValueFrom)(this.http.post('http://localhost:11434/api/chat', {
                    model,
                    messages: [
                        { role: 'system', content: system },
                        {
                            role: 'user',
                            content: user + '\n\nResponda SOMENTE com JSON válido.',
                        },
                    ],
                    stream: false,
                }, { timeout: 20000 }));
                const content = resp.data?.message?.content ?? '{}';
                const base = JSON.parse(content
                    .trim()
                    .replace(/^```[a-zA-Z]*\n/, '')
                    .replace(/```\s*$/, ''));
                return {
                    id: base.id,
                    company: base.company ?? '',
                    title: base.title ?? '',
                    requiredSkills: base.requiredSkills ?? [],
                    responsibilities: base.responsibilities ?? [],
                    keywords: base.keywords ?? [],
                };
            }
            catch {
                return this.basicExtract(text, input?.url);
            }
        }
        if (!this.openaiApiKey) {
            return this.basicExtract(text, input?.url);
        }
        try {
            const resp = await (0, rxjs_1.firstValueFrom)(this.http.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: user },
                ],
                response_format: { type: 'json_object' },
            }, {
                headers: {
                    Authorization: `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 12000,
            }));
            const json = resp.data.choices?.[0]?.message?.content ?? '{}';
            const base = JSON.parse(json);
            return {
                id: base.id,
                company: base.company ?? '',
                title: base.title ?? '',
                requiredSkills: base.requiredSkills ?? [],
                responsibilities: base.responsibilities ?? [],
                keywords: base.keywords ?? [],
            };
        }
        catch {
            return this.basicExtract(text, input?.url);
        }
    }
    async scoreProfileMatch(profileData, analysis) {
        if (!this.openaiApiKey && !this.isOllama()) {
            const profileText = JSON.stringify(profileData || {}).toLowerCase();
            const keywords = (analysis?.keywords || []).map((k) => String(k).toLowerCase());
            const required = (analysis?.requiredSkills || []).map((k) => String(k).toLowerCase());
            const matchedKw = keywords.filter((k) => profileText.includes(k));
            const missingKw = keywords.filter((k) => !profileText.includes(k));
            const matchedReq = required.filter((k) => profileText.includes(k));
            const base = Math.round(((matchedReq.length + matchedKw.length * 0.5) /
                ((required.length || 1) + (keywords.length || 1) * 0.5)) *
                100);
            return {
                score: Math.max(0, Math.min(100, base)),
                strengths: matchedReq
                    .slice(0, 10)
                    .map((k) => `Compatível com requisito: ${k}`),
                weaknesses: missingKw
                    .slice(0, 10)
                    .map((k) => `Falta evidência de palavra-chave: ${k}`),
                missingKeywords: missingKw.slice(0, 20),
            };
        }
        const system = 'Você é um motor de score ATS. Compare perfil vs vaga e gere score de 0 a 100 com explicações.';
        const user = `Perfil: ${JSON.stringify(profileData)}\nVaga: ${JSON.stringify(analysis)}\nRetorne JSON { score, strengths[], weaknesses[], missingKeywords[] }`;
        if (this.isOllama()) {
            const resp = await (0, rxjs_1.firstValueFrom)(this.http.post('http://localhost:11434/api/chat', {
                model: this.getModel('llama3.1'),
                messages: [
                    { role: 'system', content: system },
                    {
                        role: 'user',
                        content: user + '\n\nResponda SOMENTE com JSON válido.',
                    },
                ],
                stream: false,
            }));
            const content = resp.data?.message?.content ?? '{}';
            return JSON.parse(String(content)
                .trim()
                .replace(/^```[a-zA-Z]*\n/, '')
                .replace(/```\s*$/, ''));
        }
        const resp = await (0, rxjs_1.firstValueFrom)(this.http.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
            response_format: { type: 'json_object' },
        }, {
            headers: {
                Authorization: `Bearer ${this.openaiApiKey}`,
                'Content-Type': 'application/json',
            },
        }));
        return JSON.parse(resp.data.choices?.[0]?.message?.content ?? '{}');
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map