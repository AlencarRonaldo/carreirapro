"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    async suggestSentences(input) {
        const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
        const model = process.env.OLLAMA_MODEL || 'llama3.1';
        try {
            const ollamaMod = await import('ollama');
            const ollama = ollamaMod.default ?? ollamaMod;
            const messages = [
                {
                    role: 'user',
                    content: 'Você é um assistente de carreira. Gere 3 sugestões curtas (1 frase cada) para melhorar um currículo, em português, ' +
                        'com foco em resultados e verbos de ação. Responda em JSON array de strings sem texto extra.\n' +
                        `Papel: ${input.role ?? ''}\n` +
                        `Conquistas: ${(input.achievements ?? []).join('; ')}\n` +
                        `Contexto: ${input.context ?? ''}`,
                },
            ];
            const res = await ollama.chat({ host, model, messages });
            const content = res?.message?.content ?? '';
            try {
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed))
                    return parsed.slice(0, 3).map(String);
            }
            catch { }
            const lines = content
                .split(/\n+/)
                .map((s) => s.replace(/^[-•\d.\s]+/, '').trim())
                .filter(Boolean);
            if (lines.length >= 3)
                return lines.slice(0, 3);
        }
        catch {
        }
        const base = [];
        if (input.role)
            base.push(`Liderei iniciativas como ${input.role}, entregando resultados mensuráveis.`);
        if (input.achievements && input.achievements.length > 0)
            base.push(`Principais conquistas: ${input.achievements.join('; ')}.`);
        if (input.context)
            base.push(`Responsável por ${input.context}, com foco em impacto e melhoria contínua.`);
        while (base.length < 3)
            base.push('Desenvolvi entregas com foco em valor e qualidade, colaborando com times multidisciplinares.');
        return base.slice(0, 3);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map