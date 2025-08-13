import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async suggestSentences(input: {
    role?: string;
    achievements?: string[];
    context?: string;
  }): Promise<string[]> {
    // Tenta usar Ollama local se disponível (grátis e offline)
    const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.1';
    try {
      // import dinâmico para não exigir dependência quando não usada
      const ollamaMod: any = await import('ollama');
      const ollama = ollamaMod.default ?? ollamaMod;
      const messages = [
        {
          role: 'user',
          content:
            'Você é um assistente de carreira. Gere 3 sugestões curtas (1 frase cada) para melhorar um currículo, em português, ' +
            'com foco em resultados e verbos de ação. Responda em JSON array de strings sem texto extra.\n' +
            `Papel: ${input.role ?? ''}\n` +
            `Conquistas: ${(input.achievements ?? []).join('; ')}\n` +
            `Contexto: ${input.context ?? ''}`,
        },
      ];
      const res = await ollama.chat({ host, model, messages });
      const content: string = res?.message?.content ?? '';
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed.slice(0, 3).map(String);
      } catch {}
      // fallback: dividir por quebras de linha
      const lines = content
        .split(/\n+/)
        .map((s) => s.replace(/^[-•\d.\s]+/, '').trim())
        .filter(Boolean);
      if (lines.length >= 3) return lines.slice(0, 3);
    } catch {
      // segue para stub
    }

    // Stub local
    const base: string[] = [];
    if (input.role)
      base.push(
        `Liderei iniciativas como ${input.role}, entregando resultados mensuráveis.`,
      );
    if (input.achievements && input.achievements.length > 0)
      base.push(`Principais conquistas: ${input.achievements.join('; ')}.`);
    if (input.context)
      base.push(
        `Responsável por ${input.context}, com foco em impacto e melhoria contínua.`,
      );
    while (base.length < 3)
      base.push(
        'Desenvolvi entregas com foco em valor e qualidade, colaborando com times multidisciplinares.',
      );
    return base.slice(0, 3);
  }
}
