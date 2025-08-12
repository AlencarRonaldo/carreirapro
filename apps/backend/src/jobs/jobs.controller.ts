import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';
import type { JobAnalysisInput } from './jobs.service';
import { ProfileService } from '../profile/profile.service';
import { DocumentsService } from '../documents/documents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobAnalysisEntity } from './job-analysis.entity';
import { RequireProPlanGuard } from '../common/guards/plan.guard';
import { UsageService } from '../common/usage/usage.service';

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobs: JobsService,
    private readonly profiles: ProfileService,
    private readonly docs: DocumentsService,
    @InjectRepository(JobAnalysisEntity) private readonly jobRepo: Repository<JobAnalysisEntity>,
    private readonly usage: UsageService,
  ) {}

  @Post('analyze')
  async analyze(@Req() req: any, @Body() body: JobAnalysisInput) {
    // Quota para Starter: 3 análises/mês
    const plan: string = req.user?.plan || 'starter';
    if (plan === 'starter') {
      const used = await this.usage.getCount(req.user.sub, 'job_analyses');
      if (used >= 3) {
        return { error: 'limit', message: 'Limite mensal atingido no plano Starter (3 análises/mês)' } as any;
      }
    }
    const result = await this.jobs.analyzeJob(body);
    if (plan === 'starter') await this.usage.increment(req.user.sub, 'job_analyses', 1);
    return result;
  }

  @Post('score')
  @UseGuards(RequireProPlanGuard)
  score(@Req() req: any, @Body() body: { analysis: any }) {
    return this.jobs.scoreProfileMatch({ userId: req.user.sub }, body.analysis);
  }

  @Post('optimize-resume')
  @UseGuards(RequireProPlanGuard)
  async optimizeResume(
    @Req() req: any,
    @Body()
    body: {
      analysis: any;
      documentId?: string;
      createIfMissing?: boolean;
    },
  ) {
    const userId: string = req.user.sub;
    const profile = await this.profiles.getOrCreate(userId);
    const suggestions = await this.jobs.scoreProfileMatch(profile, body.analysis);
    // simples estratégia: acrescentar keywords faltantes ao final do documento
    const missing = Array.isArray(suggestions?.missingKeywords) ? suggestions.missingKeywords : [];
    const extra = missing.length ? `\n\nPalavras-chave adicionadas: ${missing.join(', ')}` : '';
    if (body.documentId) {
      const doc = await this.docs.get(userId, body.documentId);
      const newContent = `${doc.content ?? ''}${extra}`;
      await this.docs.updateContent(userId, body.documentId, newContent);
      return { documentId: body.documentId, applied: missing };
    }
    if (body.createIfMissing) {
      const doc = await this.docs.create(userId, `${body.analysis?.title || 'Currículo'} (otimizado)`);
      const content = `Resumo otimizado para: ${body.analysis?.title || ''}\nEmpresa: ${body.analysis?.company || ''}${extra}`;
      await this.docs.updateContent(userId, doc.id, content);
      return { documentId: doc.id, applied: missing };
    }
    return { applied: missing };
  }

  @Post('save-analysis')
  async saveAnalysis(@Req() req: any, @Body() body: { analysis: any; url?: string | null }) {
    const userId: string = req.user.sub;
    const a = body.analysis || {};
    const entity = this.jobRepo.create({
      userId,
      company: a.company ?? '',
      title: a.title ?? '',
      sourceUrl: body.url ?? null,
      requiredSkills: Array.isArray(a.requiredSkills) ? a.requiredSkills : [],
      responsibilities: Array.isArray(a.responsibilities) ? a.responsibilities : [],
      keywords: Array.isArray(a.keywords) ? a.keywords : [],
    });
    const saved = await this.jobRepo.save(entity);
    return saved;
  }

  @Post('save-as-application')
  async saveAsApplication(@Req() req: any, @Body() body: { analysis: any; url?: string | null }) {
    const userId: string = req.user.sub;
    const a = body.analysis || {};
    const app = await this.docs as any; // placeholder not used
    // create application using ApplicationsService via HTTP should be done client-side; for convenience, return suggested payload
    return {
      company: a.company ?? '',
      title: a.title ?? '',
      jobUrl: body.url ?? null,
      status: 'saved',
    };
  }
}


