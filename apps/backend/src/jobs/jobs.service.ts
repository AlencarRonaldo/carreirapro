import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface JobAnalysisInput {
  url?: string;
  description?: string;
}

export interface JobAnalysisResult {
  id: string;
  company: string;
  title: string;
  requiredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  compatibilityScore?: number;
  suggestions?: string[];
}

@Injectable()
export class JobsService {
  private readonly openaiApiKey: string | undefined;

  constructor(private readonly http: HttpService, private readonly config: ConfigService) {
    this.openaiApiKey = this.config.get<string>('OPENAI_API_KEY');
  }

  private isOllama() {
    return (this.config.get<string>('AI_PROVIDER') || '').toLowerCase() === 'ollama'
  }

  private getModel(defaultModel: string) {
    return this.config.get<string>('AI_MODEL') || defaultModel
  }

  private normalizeUrl(url?: string): string | null {
    if (!url) return null
    const trimmed = url.trim()
    if (!trimmed) return null
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    // prefixa https por segurança
    return `https://${trimmed}`
  }

  private stripHtml(html: string): string {
    try {
      const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
      const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, ' ')
      const withNewlines = withoutStyles
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/<p[\s\S]*?>/gi, '\n')
        .replace(/<li[\s\S]*?>/gi, '\n• ')
        .replace(/<h[1-6][\s\S]*?>/gi, '\n')
      const withoutTags = withNewlines.replace(/<[^>]+>/g, ' ')
      return withoutTags.replace(/\s+/g, ' ').replace(/[\t\r]+/g, ' ').replace(/\n\s*\n/g, '\n').trim()
    } catch {
      return html
    }
  }

  private async fetchUrlText(url?: string): Promise<string> {
    const normalized = this.normalizeUrl(url)
    if (!normalized) return ''
    try {
      const resp = await firstValueFrom(
        this.http.get(normalized, {
          responseType: 'text' as any,
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CarreiraProBot/1.0)'
          }
        })
      )
      const data: string = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data)
      return this.stripHtml(data).slice(0, 25000)
    } catch {
      return ''
    }
  }

  private basicExtract(text: string): JobAnalysisResult {
    const firstLine = (text.split(/\n|\.\s/)[0] || '').slice(0, 120)
    const words = Array.from(new Set(text.toLowerCase().match(/[a-zà-ú0-9#\+\.\-]{3,}/gi) || []))
    const keywords = words.slice(0, 30)
    return {
      id: 'local-' + Math.random().toString(36).slice(2),
      company: '',
      title: firstLine,
      requiredSkills: [],
      responsibilities: [],
      keywords,
    }
  }

  async analyzeJob(input: JobAnalysisInput): Promise<JobAnalysisResult> {
    const urlText = await this.fetchUrlText(input?.url)
    const text = `${input?.description ?? ''}\n${urlText}`.trim();
    const system = 'Extraia campos estruturados da vaga para uso em ATS e matching com perfil.';
    const user = `Texto da vaga:\n${text}\n\nRetorne JSON com: id (uuid v4), company, title, requiredSkills[], responsibilities[], keywords[]`;
    if (this.isOllama()) {
      try {
        const model = this.getModel('llama3.1')
        const resp = await firstValueFrom(this.http.post('http://localhost:11434/api/chat', {
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user + '\n\nResponda SOMENTE com JSON válido.' },
          ],
          stream: false,
        }, { timeout: 20000 }))
        const content: string = resp.data?.message?.content ?? '{}'
        const base = JSON.parse(content.trim().replace(/^```[a-zA-Z]*\n/, '').replace(/```\s*$/, ''))
        return {
          id: base.id,
          company: base.company ?? '',
          title: base.title ?? '',
          requiredSkills: base.requiredSkills ?? [],
          responsibilities: base.responsibilities ?? [],
          keywords: base.keywords ?? [],
        }
      } catch {
        return this.basicExtract(text)
      }
    }
    if (!this.openaiApiKey) {
      return this.basicExtract(text)
    }
    try {
      const resp = await firstValueFrom(
        this.http.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: user }], response_format: { type: 'json_object' } as any },
          { headers: { Authorization: `Bearer ${this.openaiApiKey}`, 'Content-Type': 'application/json' }, timeout: 12000 },
        ),
      );
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
    } catch {
      return this.basicExtract(text)
    }
  }

  async scoreProfileMatch(profileData: any, analysis: JobAnalysisResult) {
    // Fallback local se não houver chave/API configurada
    if (!this.openaiApiKey && !this.isOllama()) {
      const profileText = JSON.stringify(profileData || {}).toLowerCase()
      const keywords = (analysis?.keywords || []).map(k => String(k).toLowerCase())
      const required = (analysis?.requiredSkills || []).map(k => String(k).toLowerCase())
      const matchedKw = keywords.filter(k => profileText.includes(k))
      const missingKw = keywords.filter(k => !profileText.includes(k))
      const matchedReq = required.filter(k => profileText.includes(k))
      const base = Math.round(((matchedReq.length + matchedKw.length * 0.5) / ((required.length || 1) + (keywords.length || 1) * 0.5)) * 100)
      return {
        score: Math.max(0, Math.min(100, base)),
        strengths: matchedReq.slice(0, 10).map(k => `Compatível com requisito: ${k}`),
        weaknesses: missingKw.slice(0, 10).map(k => `Falta evidência de palavra-chave: ${k}`),
        missingKeywords: missingKw.slice(0, 20),
      }
    }
    const system = 'Você é um motor de score ATS. Compare perfil vs vaga e gere score de 0 a 100 com explicações.';
    const user = `Perfil: ${JSON.stringify(profileData)}\nVaga: ${JSON.stringify(analysis)}\nRetorne JSON { score, strengths[], weaknesses[], missingKeywords[] }`;
    if (this.isOllama()) {
      const resp = await firstValueFrom(
        this.http.post('http://localhost:11434/api/chat', {
          model: this.getModel('llama3.1'),
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user + '\n\nResponda SOMENTE com JSON válido.' },
          ],
          stream: false,
        })
      )
      const content: string = resp.data?.message?.content ?? '{}'
      return JSON.parse(String(content).trim().replace(/^```[a-zA-Z]*\n/, '').replace(/```\s*$/, ''))
    }
    const resp = await firstValueFrom(
      this.http.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: user }], response_format: { type: 'json_object' } as any },
        { headers: { Authorization: `Bearer ${this.openaiApiKey}`, 'Content-Type': 'application/json' } },
      ),
    );
    return JSON.parse(resp.data.choices?.[0]?.message?.content ?? '{}');
  }
}


