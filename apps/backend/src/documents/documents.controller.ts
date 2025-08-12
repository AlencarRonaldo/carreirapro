import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { IsString, MaxLength } from 'class-validator';
import type { Response } from 'express';
import { ProfileService } from '../profile/profile.service';
import { ExperienceService } from '../profile/experience.service';
import { EducationService } from '../profile/education.service';
import { SkillService } from '../profile/skill.service';
import { SIMPLE_TEMPLATES } from './templates.data';
import { TemplateEntity } from './template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateFavoriteEntity } from './template-favorite.entity';
import { UserEntity } from '../auth/user.entity';

// Helpers
function safe(value: any): string {
  return value ? String(value) : '';
}

function formatMonthYear(dateStr?: string | null): string {
  if (!dateStr) return ''
  const d = new Date(String(dateStr))
  if (isNaN(d.getTime())) return safe(dateStr)
  const s = d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  return s.replace('.', '').replace(' de ', ' ').replace(/^./, c => c.toUpperCase())
}

function formatDateRange(start?: string | null, end?: string | null): string {
  const a = formatMonthYear(start)
  const b = formatMonthYear(end)
  if (a && b) return `${a} – ${b}`
  if (a && !b) return `desde ${a}`
  return ''
}

class CreateDocDto {
  @IsString()
  @MaxLength(255)
  title!: string;
}

class RenameDocDto extends CreateDocDto {}

class UpdateContentDto {
  @IsString()
  content!: string;
}

class UpdateTemplateDto {
  @IsString()
  templateKey!: string;
}

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly docs: DocumentsService,
    private readonly profiles: ProfileService,
    private readonly experiences: ExperienceService,
    private readonly education: EducationService,
    private readonly skills: SkillService,
    @InjectRepository(TemplateFavoriteEntity) private readonly favs: Repository<TemplateFavoriteEntity>,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
  ) {}

  @Get()
  list(@Req() req: any) {
    const includeArchived = String(req?.query?.all ?? '').toLowerCase() === 'true'
    return this.docs.list(req.user.sub, includeArchived);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateDocDto) {
    return this.docs.create(req.user.sub, body.title);
  }

  @Put(':id')
  rename(@Req() req: any, @Param('id') id: string, @Body() body: RenameDocDto) {
    return this.docs.rename(req.user.sub, id, body.title);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.docs.remove(req.user.sub, id);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.docs.get(req.user.sub, id);
  }

  @Put(':id/content')
  updateContent(@Req() req: any, @Param('id') id: string, @Body() body: UpdateContentDto) {
    return this.docs.updateContent(req.user.sub, id, body.content ?? '');
  }

  @Get(':id/export.pdf')
  async exportPdf(@Req() req: any, @Param('id') id: string, @Res() res: Response) {
    try {
      const doc = await this.docs.get(req.user.sub, id);
      const template = SIMPLE_TEMPLATES.find(t => t.key === doc.templateKey) ?? SIMPLE_TEMPLATES[0];
      const profile = await this.profiles.getOrCreate(req.user.sub);
      const [xpList, edList, skList] = await Promise.all([
        this.experiences.list(req.user.sub),
        this.education.list(req.user.sub),
        this.skills.list(req.user.sub),
      ]);
      const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
      // Se houver HTML, tenta renderizar via puppeteer
      if (!isTestEnv && template.html && profile) {
        try {
          const puppeteer = (await import('puppeteer')).default;
          const browser = await puppeteer.launch({ headless: 'new' as any });
          const page = await browser.newPage();
          const xp = xpList.map(x => {
            const range = formatDateRange(x.startDate as any, x.endDate as any)
            const rangeStr = range ? ` (${range})` : ''
            return `<li><strong>${safe(x.title)}</strong> — ${safe(x.company)}${rangeStr}${x.description ? `<br/>${safe(x.description)}` : ''}</li>`
          }).join('');
          const ed = edList.map(e => {
            const range = formatDateRange(e.startDate as any, e.endDate as any)
            const rangeStr = range ? ` (${range})` : ''
            return `<li><strong>${safe(e.degree)}</strong> — ${safe(e.institution)}${rangeStr}</li>`
          }).join('');
          const sk = skList.map(s => `<li>${s.name} — nível ${s.level}</li>`).join('');
      const safe = (v?: string) => (v && String(v).trim().length > 0 ? String(v) : '');
       const html = template.html
            .replaceAll('{{fullName}}', safe((profile as any).fullName))
            .replaceAll('{{headline}}', safe((profile as any).headline))
            .replaceAll('{{locationCity}}', safe((profile as any).locationCity))
            .replaceAll('{{locationState}}', safe((profile as any).locationState))
            .replaceAll('{{locationCountry}}', safe((profile as any).locationCountry))
            .replaceAll('{{linkedin}}', safe((profile as any).linkedin))
            .replaceAll('{{email}}', safe((profile as any).email))
            .replaceAll('{{phone}}', safe((profile as any).phone))
            .replaceAll('{{github}}', safe((profile as any).github))
            .replaceAll('{{website}}', safe((profile as any).website))
            .replaceAll('{{content}}', doc.content || '')
            .replaceAll('{{experiences}}', `<ul>${xp}</ul>`)
            .replaceAll('{{education}}', `<ul>${ed}</ul>`)
            .replaceAll('{{skills}}', `<ul>${sk}</ul>`);
          // watermark CSS + element
          const currentUser = await this.users.findOne({ where: { id: req.user.sub } });
          const isStarter = !currentUser || currentUser.plan === 'starter';
          const wmCss = `<style>@media print{.wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);opacity:.12;font-size:80px;color:#000;z-index:9999;pointer-events:none;}}</style>`;
          const wmEl = `<div class="wm">Carreira Pro • Free</div>`;
          const htmlWithWm = isStarter ? html.replace('</head>', `${wmCss}</head>`).replace('</body>', `${wmEl}</body>`) : html;
          await page.setContent(htmlWithWm, { waitUntil: 'load' });
          const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
          await browser.close();
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${doc.title}.pdf"`);
          return res.end(pdfBuffer);
        } catch {}
      }

      // fallback: PDFKit texto
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${doc.title}.pdf"`);
      const PDFDocument = (await import('pdfkit')).default;
      const pdf = new PDFDocument();
      pdf.pipe(res);
      // watermark
      try {
        const cx = (pdf as any).page?.width ? (pdf as any).page.width / 2 : 297; // A4 default approx if missing
        const cy = (pdf as any).page?.height ? (pdf as any).page.height / 2 : 420;
        pdf.save();
        if ((pdf as any).opacity) (pdf as any).opacity(0.12);
        pdf.rotate(-30, { origin: [cx, cy] });
        pdf.fillColor('#000');
        pdf.fontSize(80).text('Carreira Pro • Free', cx - 300, cy - 40, { width: 600, align: 'center' });
        pdf.restore();
        if ((pdf as any).opacity) (pdf as any).opacity(1);
      } catch {}
      const body = (template.body || '{{content}}')
        .replaceAll('{{fullName}}', safe((profile as any)?.fullName))
        .replaceAll('{{headline}}', safe((profile as any)?.headline))
        .replaceAll('{{linkedin}}', safe((profile as any)?.linkedin))
        .replaceAll('{{email}}', safe((profile as any)?.email))
        .replaceAll('{{phone}}', safe((profile as any)?.phone))
        .replaceAll('{{content}}', doc.content || '')
        .replaceAll('{{experiences}}', xpList.map(x => `• ${x.title} — ${x.company}`).join('\n'))
        .replaceAll('{{education}}', edList.map(e => `• ${e.degree} — ${e.institution}`).join('\n'))
        .replaceAll('{{skills}}', skList.map(s => `• ${s.name} (nível ${s.level})`).join('\n'));
      pdf.fontSize(18).text(doc.title, { underline: true });
      pdf.moveDown();
      pdf.fontSize(12).text(body);
      pdf.end();
    } catch {
      // erro inesperado: retorna resposta com cabeçalho de PDF e corpo vazio
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');
      return res.end(Buffer.from(''));
    }
  }

  @Get('templates/list')
  listTemplates() {
    return SIMPLE_TEMPLATES.map(t => ({ key: t.key, name: t.name, atsReady: (t as any).atsReady === true, premium: (t as any).premium === true }));
  }

  @Put(':id/template')
  async setTemplate(@Req() req: any, @Param('id') id: string, @Body() body: UpdateTemplateDto) {
    const doc = await this.docs.get(req.user.sub, id);
    doc.templateKey = body.templateKey;
    return (await this.docs as any).repo.save(doc);
  }

  @Get('templates/custom')
  listCustomTemplates(@Req() req: any) {
    return this.docs.listTemplates(req.user.sub);
  }

  @Get('templates/favorites')
  async listFavorites(@Req() req: any) {
    const list = await this.favs.find({ where: { userId: req.user.sub } });
    return list.map(f => f.templateKey);
  }

  @Post('templates/favorites/:key')
  async addFavorite(@Req() req: any, @Param('key') key: string) {
    const exists = await this.favs.findOne({ where: { userId: req.user.sub, templateKey: key } });
    if (exists) return exists;
    const fav = this.favs.create({ userId: req.user.sub, templateKey: key });
    return this.favs.save(fav);
  }

  @Delete('templates/favorites/:key')
  async removeFavorite(@Req() req: any, @Param('key') key: string) {
    const exists = await this.favs.findOne({ where: { userId: req.user.sub, templateKey: key } });
    if (!exists) return { ok: true } as any;
    await this.favs.remove(exists);
    return { ok: true } as any;
  }

  @Put('templates/custom/:key')
  upsertCustomTemplate(@Req() req: any, @Param('key') key: string, @Body() body: Partial<TemplateEntity>) {
    return this.docs.upsertTemplate(req.user.sub, { key, name: body.name, body: body.body, html: body.html });
  }

  @Delete('templates/custom/:key')
  removeCustomTemplate(@Req() req: any, @Param('key') key: string) {
    return this.docs.removeTemplate(req.user.sub, key);
  }

  @Get(':id/versions')
  listVersions(@Req() req: any, @Param('id') id: string) {
    return this.docs.listVersions(req.user.sub, id);
  }

  @Post(':id/versions/:versionId/restore')
  restoreVersion(@Req() req: any, @Param('id') id: string, @Param('versionId') versionId: string) {
    return this.docs.restoreVersion(req.user.sub, id, versionId);
  }

  @Post(':id/archive')
  archive(@Req() req: any, @Param('id') id: string) {
    return this.docs.archive(req.user.sub, id, true);
  }

  @Post(':id/unarchive')
  unarchive(@Req() req: any, @Param('id') id: string) {
    return this.docs.archive(req.user.sub, id, false);
  }

  @Post(':id/duplicate')
  duplicate(@Req() req: any, @Param('id') id: string) {
    return this.docs.duplicate(req.user.sub, id);
  }

  @Post('templates/preview')
  async previewTemplate(
    @Req() req: any,
    @Body()
    body: {
      documentId?: string;
      templateKey?: string;
      body?: string;
      html?: string | null;
      contentOverride?: string;
    },
  ) {
    const userId: string = req.user.sub;
    const profile = await this.profiles.getOrCreate(userId);
    const [xpList, edList, skList] = await Promise.all([
      this.experiences.list(userId),
      this.education.list(userId),
      this.skills.list(userId),
    ]);

    let content = body?.contentOverride ?? '';
    let templateKey = body?.templateKey ?? '';
    let tplBody = body?.body ?? '';
    let tplHtml: string | null | undefined = body?.html;

    if (body?.documentId) {
      const doc = await this.docs.get(userId, body.documentId);
      content = body?.contentOverride ?? (doc?.content ?? '');
      templateKey = templateKey || doc?.templateKey || '';
    }

    if (!tplBody && typeof tplHtml === 'undefined' && templateKey) {
      const custom = await this.docs.findTemplate(userId, templateKey);
      if (custom) {
        tplBody = custom.body ?? '';
        tplHtml = custom.html ?? null;
      } else {
        const simple = SIMPLE_TEMPLATES.find(t => t.key === templateKey) ?? SIMPLE_TEMPLATES[0];
        tplBody = simple.body ?? '';
        tplHtml = (simple as any).html ?? null;
      }
    }

      const replacements: Record<string, string> = {
      '{{fullName}}': String((profile as any).fullName ?? ''),
      '{{headline}}': String((profile as any).headline ?? ''),
      '{{locationCity}}': String((profile as any).locationCity ?? ''),
      '{{locationState}}': String((profile as any).locationState ?? ''),
      '{{locationCountry}}': String((profile as any).locationCountry ?? ''),
        '{{linkedin}}': '',
      '{{email}}': String((profile as any).email ?? ''),
      '{{phone}}': String((profile as any).phone ?? ''),
      '{{github}}': String((profile as any).github ?? ''),
      '{{website}}': String((profile as any).website ?? ''),
      '{{content}}': content || '',
      '{{experiences}}': xpList.map(x => {
        const range = formatDateRange(x.startDate as any, x.endDate as any)
        const rangeStr = range ? ` (${range})` : ''
        return `<li><strong>${safe(x.title)}</strong> — ${safe(x.company)}${rangeStr}${x.description ? `<br/>${safe(x.description)}` : ''}</li>`
      }).join(''),
      '{{education}}': edList.map(e => {
        const range = formatDateRange(e.startDate as any, e.endDate as any)
        const rangeStr = range ? ` (${range})` : ''
        return `<li><strong>${safe(e.degree)}</strong> — ${safe(e.institution)}${rangeStr}</li>`
      }).join(''),
      '{{skills}}': skList.map(s => `<li>${s.name} — nível ${s.level}</li>`).join(''),
    };

    function apply(text: string): string {
      let out = text;
      for (const [k, v] of Object.entries(replacements)) {
        out = out.split(k).join(v);
      }
      return out;
    }

    const htmlFromBody = tplHtml
      ? apply(tplHtml).replace('{{experiences}}', `<ul>${replacements['{{experiences}}']}</ul>`).replace('{{education}}', `<ul>${replacements['{{education}}']}</ul>`).replace('{{skills}}', `<ul>${replacements['{{skills}}']}</ul>`)
      : `<div style="font-family: Arial, sans-serif; padding: 16px;">
           <h1 style="margin:0 0 8px 0; font-size:20px;">${(profile as any).fullName ?? ''}</h1>
           <div style="margin:0 0 12px 0; color:#555;">${(profile as any).headline ?? ''}</div>
           <div style="white-space:pre-wrap; font-size:14px; line-height:1.5;">${apply(tplBody || '{{content}}').replace(/\n/g, '<br/>')}</div>
         </div>`;

    const unknownPlaceholders = Array.from(new Set((htmlFromBody.match(/\{\{[^}]+\}\}/g) || []).filter(p => !Object.keys(replacements).includes(p))));

    return { html: htmlFromBody, warnings: unknownPlaceholders };
  }

  @Post('templates/export.pdf')
  async exportTemplatePdf(
    @Req() req: any,
    @Res() res: Response,
    @Body()
    body: {
      templateKey?: string;
      body?: string;
      html?: string | null;
      contentOverride?: string;
    },
  ) {
    const userId: string = req.user.sub;
    const profile = await this.profiles.getOrCreate(userId);
    const [xpList, edList, skList] = await Promise.all([
      this.experiences.list(userId),
      this.education.list(userId),
      this.skills.list(userId),
    ]);

    let tplBody = body?.body ?? '';
    let tplHtml: string | null | undefined = body?.html ?? null;
    let templateKey = body?.templateKey ?? '';
    const content = body?.contentOverride ?? '';

    if (!tplBody && typeof tplHtml === 'undefined' && templateKey) {
      const custom = await this.docs.findTemplate(userId, templateKey);
      if (custom) {
        tplBody = custom.body ?? '';
        tplHtml = custom.html ?? null;
      } else {
        const simple = SIMPLE_TEMPLATES.find(t => t.key === templateKey) ?? SIMPLE_TEMPLATES[0];
        tplBody = simple.body ?? '';
        tplHtml = (simple as any).html ?? null;
      }
    }

      const replacements: Record<string, string> = {
      '{{fullName}}': String((profile as any).fullName ?? ''),
      '{{headline}}': String((profile as any).headline ?? ''),
      '{{locationCity}}': String((profile as any).locationCity ?? ''),
      '{{locationState}}': String((profile as any).locationState ?? ''),
      '{{locationCountry}}': String((profile as any).locationCountry ?? ''),
        '{{linkedin}}': '',
        '{{email}}': String((profile as any).email ?? ''),
        '{{phone}}': String((profile as any).phone ?? ''),
      '{{github}}': String((profile as any).github ?? ''),
      '{{website}}': String((profile as any).website ?? ''),
      '{{content}}': content || '',
      '{{experiences}}': xpList
        .map(x => {
          const range = formatDateRange(x.startDate as any, x.endDate as any)
          const rangeStr = range ? ` (${range})` : ''
          return `<li><strong>${safe(x.title)}</strong> — ${safe(x.company)}${rangeStr}${x.description ? `<br/>${safe(x.description)}` : ''}</li>`
        })
        .join(''),
      '{{education}}': edList
        .map(e => {
          const range = formatDateRange(e.startDate as any, e.endDate as any)
          const rangeStr = range ? ` (${range})` : ''
          return `<li><strong>${safe(e.degree)}</strong> — ${safe(e.institution)}${rangeStr}</li>`
        })
        .join(''),
      '{{skills}}': skList.map(s => `<li>${s.name} — nível ${s.level}</li>`).join(''),
    };

    const applyRepl = (text: string): string => {
      let out = text;
      for (const [k, v] of Object.entries(replacements)) out = out.split(k).join(v);
      return out;
    };

    const htmlFromBody = tplHtml
      ? applyRepl(tplHtml)
          .replace('{{experiences}}', `<ul>${replacements['{{experiences}}']}</ul>`) 
          .replace('{{education}}', `<ul>${replacements['{{education}}']}</ul>`) 
          .replace('{{skills}}', `<ul>${replacements['{{skills}}']}</ul>`)
      : `<div style="font-family: Arial, sans-serif; padding: 16px;">
           <h1 style="margin:0 0 8px 0; font-size:20px;">${(profile as any).fullName ?? ''}</h1>
           <div style="margin:0 0 12px 0; color:#555;">${(profile as any).headline ?? ''}</div>
           <div style="white-space:pre-wrap; font-size:14px; line-height:1.5;">${applyRepl(tplBody || '{{content}}').replace(/\n/g, '<br/>')}</div>
         </div>`;

    // Try Puppeteer HTML → PDF
    const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
    if (!isTestEnv) {
      try {
        const puppeteer = (await import('puppeteer')).default;
        const browser = await puppeteer.launch({ headless: 'new' as any });
        const page = await browser.newPage();
        await page.setContent(htmlFromBody, { waitUntil: 'load' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="curriculo.pdf"');
        return res.end(pdfBuffer);
      } catch {}
    }

    // Fallback: PDFKit com texto simples
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="curriculo.pdf"');
    const PDFDocument = (await import('pdfkit')).default;
    const pdf = new PDFDocument();
    pdf.pipe(res);
    pdf.fontSize(18).text(String((profile as any).fullName ?? ''), { underline: true });
    pdf.moveDown();
    pdf.fontSize(12).text(htmlFromBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    pdf.end();
  }
}


