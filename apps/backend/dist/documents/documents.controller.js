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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const documents_service_1 = require("./documents.service");
const class_validator_1 = require("class-validator");
const profile_service_1 = require("../profile/profile.service");
const experience_service_1 = require("../profile/experience.service");
const education_service_1 = require("../profile/education.service");
const skill_service_1 = require("../profile/skill.service");
const templates_data_1 = require("./templates.data");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const template_favorite_entity_1 = require("./template-favorite.entity");
const user_entity_1 = require("../auth/user.entity");
function safe(value) {
    return value ? String(value) : '';
}
function formatMonthYear(dateStr) {
    if (!dateStr)
        return '';
    const d = new Date(String(dateStr));
    if (isNaN(d.getTime()))
        return safe(dateStr);
    const s = d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    return s
        .replace('.', '')
        .replace(' de ', ' ')
        .replace(/^./, (c) => c.toUpperCase());
}
function formatDateRange(start, end) {
    const a = formatMonthYear(start);
    const b = formatMonthYear(end);
    if (a && b)
        return `${a} – ${b}`;
    if (a && !b)
        return `desde ${a}`;
    return '';
}
class CreateDocDto {
    title;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDocDto.prototype, "title", void 0);
class RenameDocDto extends CreateDocDto {
}
class UpdateContentDto {
    content;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "content", void 0);
class UpdateTemplateDto {
    templateKey;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "templateKey", void 0);
class UpdateStatusDto {
    status;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStatusDto.prototype, "status", void 0);
let DocumentsController = class DocumentsController {
    docs;
    profiles;
    experiences;
    education;
    skills;
    favs;
    users;
    constructor(docs, profiles, experiences, education, skills, favs, users) {
        this.docs = docs;
        this.profiles = profiles;
        this.experiences = experiences;
        this.education = education;
        this.skills = skills;
        this.favs = favs;
        this.users = users;
    }
    list(req) {
        const includeArchived = String(req?.query?.all ?? '').toLowerCase() === 'true';
        return this.docs.list(req.user.sub, includeArchived);
    }
    create(req, body) {
        return this.docs.create(req.user.sub, body.title);
    }
    rename(req, id, body) {
        return this.docs.rename(req.user.sub, id, body.title);
    }
    updateStatus(req, id, body) {
        return this.docs.updateStatus(req.user.sub, id, body.status);
    }
    remove(req, id) {
        return this.docs.remove(req.user.sub, id);
    }
    get(req, id) {
        return this.docs.get(req.user.sub, id);
    }
    updateContent(req, id, body) {
        return this.docs.updateContent(req.user.sub, id, body.content ?? '');
    }
    async exportPdf(req, id, res) {
        try {
            const doc = await this.docs.get(req.user.sub, id);
            const template = templates_data_1.SIMPLE_TEMPLATES.find((t) => t.key === doc.templateKey) ??
                templates_data_1.SIMPLE_TEMPLATES[0];
            const profile = await this.profiles.getOrCreate(req.user.sub);
            const [xpList, edList, skList] = await Promise.all([
                this.experiences.list(req.user.sub),
                this.education.list(req.user.sub),
                this.skills.list(req.user.sub),
            ]);
            const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
            if (!isTestEnv && template.html && profile) {
                try {
                    const puppeteer = (await import('puppeteer')).default;
                    const browser = await puppeteer.launch({ headless: 'new' });
                    const page = await browser.newPage();
                    const xp = xpList
                        .map((x) => {
                        const range = formatDateRange(x.startDate, x.endDate);
                        const rangeStr = range ? ` (${range})` : '';
                        return `<li><strong>${safe(x.title)}</strong> — ${safe(x.company)}${rangeStr}${x.description ? `<br/>${safe(x.description)}` : ''}</li>`;
                    })
                        .join('');
                    const ed = edList
                        .map((e) => {
                        const range = formatDateRange(e.startDate, e.endDate);
                        const rangeStr = range ? ` (${range})` : '';
                        return `<li><strong>${safe(e.degree)}</strong> — ${safe(e.institution)}${rangeStr}</li>`;
                    })
                        .join('');
                    const sk = skList
                        .map((s) => `<li>${s.name} — nível ${s.level}</li>`)
                        .join('');
                    const safe = (v) => v && String(v).trim().length > 0 ? String(v) : '';
                    const html = template.html
                        .replaceAll('{{fullName}}', safe(profile.fullName))
                        .replaceAll('{{headline}}', safe(profile.headline))
                        .replaceAll('{{locationCity}}', safe(profile.locationCity))
                        .replaceAll('{{locationState}}', safe(profile.locationState))
                        .replaceAll('{{locationCountry}}', safe(profile.locationCountry))
                        .replaceAll('{{linkedin}}', safe(profile.linkedin))
                        .replaceAll('{{email}}', safe(profile.email))
                        .replaceAll('{{phone}}', safe(profile.phone))
                        .replaceAll('{{github}}', safe(profile.github))
                        .replaceAll('{{website}}', safe(profile.website))
                        .replaceAll('{{maritalStatus}}', safe(profile.maritalStatus))
                        .replaceAll('{{content}}', doc.content || '')
                        .replaceAll('{{experiences}}', `<ul class="list-block">${xp}</ul>`)
                        .replaceAll('{{education}}', `<ul class="list-block">${ed}</ul>`)
                        .replaceAll('{{skills}}', `<ul class="list-block">${sk}</ul>`);
                    const baseCss = `<style>
            @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
            * { box-sizing: border-box; }
            html, body { padding: 0; margin: 0; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; line-height: 1.5; text-align: justify; }
            h1, h2, h3 { font-size: 12pt; font-weight: bold; margin: 0 0 6pt 0; text-transform: uppercase; }
            .name { font-size: 14pt; font-weight: bold; letter-spacing: 0; text-transform: none; }
            .headline { font-size: 12pt; font-weight: bold; color: #000; margin: 0 0 8pt 0; text-transform: none; }
            .meta-lines, .meta, .meta-line { font-size: 12pt; color: #000; }
            p { margin: 0 0 6pt 0; text-indent: 1.25cm; }
            .content { white-space: pre-wrap; }
            /* Alinhamento dos marcadores com a coluna do texto */
            ul { margin: 6pt 0 0 0; padding-left: 1.25cm; list-style-position: outside; }
            li { margin: 3pt 0; text-indent: 0; }
            .list-block { margin: 6pt 0 0 0; }
            .list-block li { margin: 6pt 0; }
            a { color: #000; text-decoration: none; }
            .label { font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 10pt 0 6pt; }
            .section { margin-top: 10pt; }
          </style>`;
                    const htmlStyled = html.replace('</head>', `${baseCss}</head>`);
                    const currentUser = await this.users.findOne({
                        where: { id: req.user.sub },
                    });
                    const isStarter = !currentUser || currentUser.plan === 'starter';
                    const wmCss = `<style>@media print{.wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);opacity:.12;font-size:80px;color:#000;z-index:9999;pointer-events:none;}}</style>`;
                    const wmEl = `<div class="wm">Carreira Pro • Free</div>`;
                    const htmlWithWm = isStarter
                        ? htmlStyled
                            .replace('</head>', `${wmCss}</head>`)
                            .replace('</body>', `${wmEl}</body>`)
                        : htmlStyled;
                    await page.setContent(htmlWithWm, { waitUntil: 'load' });
                    const pdfBuffer = await page.pdf({
                        format: 'A4',
                        printBackground: true,
                    });
                    await browser.close();
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `inline; filename="${doc.title}.pdf"`);
                    return res.end(pdfBuffer);
                }
                catch { }
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${doc.title}.pdf"`);
            const PDFDocument = (await import('pdfkit')).default;
            const pdf = new PDFDocument();
            pdf.pipe(res);
            try {
                const cx = pdf.page?.width ? pdf.page.width / 2 : 297;
                const cy = pdf.page?.height
                    ? pdf.page.height / 2
                    : 420;
                pdf.save();
                if (pdf.opacity)
                    pdf.opacity(0.12);
                pdf.rotate(-30, { origin: [cx, cy] });
                pdf.fillColor('#000');
                pdf.fontSize(80).text('Carreira Pro • Free', cx - 300, cy - 40, {
                    width: 600,
                    align: 'center',
                });
                pdf.restore();
                if (pdf.opacity)
                    pdf.opacity(1);
            }
            catch { }
            const body = (template.body || '{{content}}')
                .replaceAll('{{fullName}}', safe(profile?.fullName))
                .replaceAll('{{headline}}', safe(profile?.headline))
                .replaceAll('{{linkedin}}', safe(profile?.linkedin))
                .replaceAll('{{email}}', safe(profile?.email))
                .replaceAll('{{phone}}', safe(profile?.phone))
                .replaceAll('{{content}}', doc.content || '')
                .replaceAll('{{experiences}}', xpList.map((x) => `• ${x.title} — ${x.company}`).join('\n'))
                .replaceAll('{{education}}', edList.map((e) => `• ${e.degree} — ${e.institution}`).join('\n'))
                .replaceAll('{{skills}}', skList.map((s) => `• ${s.name} (nível ${s.level})`).join('\n'));
            pdf.fontSize(18).text(doc.title, { underline: true });
            pdf.moveDown();
            pdf.fontSize(12).text(body);
            pdf.end();
        }
        catch {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');
            return res.end(Buffer.from(''));
        }
    }
    listTemplates() {
        return templates_data_1.SIMPLE_TEMPLATES.map((t) => ({
            key: t.key,
            name: t.name,
            atsReady: t.atsReady === true,
            premium: t.premium === true,
        }));
    }
    async setTemplate(req, id, body) {
        const doc = await this.docs.get(req.user.sub, id);
        doc.templateKey = body.templateKey;
        return (await this.docs).repo.save(doc);
    }
    listCustomTemplates(req) {
        return this.docs.listTemplates(req.user.sub);
    }
    async listFavorites(req) {
        const list = await this.favs.find({ where: { userId: req.user.sub } });
        return list.map((f) => f.templateKey);
    }
    async addFavorite(req, key) {
        const exists = await this.favs.findOne({
            where: { userId: req.user.sub, templateKey: key },
        });
        if (exists)
            return exists;
        const fav = this.favs.create({ userId: req.user.sub, templateKey: key });
        return this.favs.save(fav);
    }
    async removeFavorite(req, key) {
        const exists = await this.favs.findOne({
            where: { userId: req.user.sub, templateKey: key },
        });
        if (!exists)
            return { ok: true };
        await this.favs.remove(exists);
        return { ok: true };
    }
    upsertCustomTemplate(req, key, body) {
        return this.docs.upsertTemplate(req.user.sub, {
            key,
            name: body.name,
            body: body.body,
            html: body.html,
        });
    }
    removeCustomTemplate(req, key) {
        return this.docs.removeTemplate(req.user.sub, key);
    }
    listVersions(req, id) {
        return this.docs.listVersions(req.user.sub, id);
    }
    restoreVersion(req, id, versionId) {
        return this.docs.restoreVersion(req.user.sub, id, versionId);
    }
    archive(req, id) {
        return this.docs.archive(req.user.sub, id, true);
    }
    unarchive(req, id) {
        return this.docs.archive(req.user.sub, id, false);
    }
    duplicate(req, id) {
        return this.docs.duplicate(req.user.sub, id);
    }
    async previewTemplate(req, body) {
        const userId = req.user.sub;
        const profile = await this.profiles.getOrCreate(userId);
        const [xpList, edList, skList] = await Promise.all([
            this.experiences.list(userId),
            this.education.list(userId),
            this.skills.list(userId),
        ]);
        let content = body?.contentOverride ?? '';
        let templateKey = body?.templateKey ?? '';
        let tplBody = body?.body ?? '';
        let tplHtml = body?.html;
        if (body?.documentId) {
            const doc = await this.docs.get(userId, body.documentId);
            content = body?.contentOverride ?? doc?.content ?? '';
            templateKey = templateKey || doc?.templateKey || '';
        }
        if (!tplBody && typeof tplHtml === 'undefined' && templateKey) {
            const custom = await this.docs.findTemplate(userId, templateKey);
            if (custom) {
                tplBody = custom.body ?? '';
                tplHtml = custom.html ?? null;
            }
            else {
                const simple = templates_data_1.SIMPLE_TEMPLATES.find((t) => t.key === templateKey) ??
                    templates_data_1.SIMPLE_TEMPLATES[0];
                tplBody = simple.body ?? '';
                tplHtml = simple.html ?? null;
            }
        }
        const replacements = {
            '{{fullName}}': String(profile.fullName ?? ''),
            '{{headline}}': String(profile.headline ?? ''),
            '{{locationCity}}': String(profile.locationCity ?? ''),
            '{{locationState}}': String(profile.locationState ?? ''),
            '{{locationCountry}}': String(profile.locationCountry ?? ''),
            '{{linkedin}}': String(profile.linkedin ?? ''),
            '{{email}}': String(profile.email ?? ''),
            '{{phone}}': String(profile.phone ?? ''),
            '{{github}}': String(profile.github ?? ''),
            '{{website}}': String(profile.website ?? ''),
            '{{maritalStatus}}': String(profile.maritalStatus ?? ''),
            '{{content}}': content || '',
            '{{experiences}}': xpList
                .map((x) => {
                const range = formatDateRange(x.startDate, x.endDate);
                const rangeStr = range ? ` (${range})` : '';
                return `<li><strong>${safe(x.title)}</strong> — ${safe(x.company)}${rangeStr}${x.description ? `<br/>${safe(x.description)}` : ''}</li>`;
            })
                .join(''),
            '{{education}}': edList
                .map((e) => {
                const range = formatDateRange(e.startDate, e.endDate);
                const rangeStr = range ? ` (${range})` : '';
                return `<li><strong>${safe(e.degree)}</strong> — ${safe(e.institution)}${rangeStr}</li>`;
            })
                .join(''),
            '{{skills}}': skList
                .map((s) => `<li>${s.name} — nível ${s.level}</li>`)
                .join(''),
        };
        function apply(text) {
            let out = text;
            for (const [k, v] of Object.entries(replacements)) {
                out = out.split(k).join(v);
            }
            return out;
        }
        let htmlFromBody = tplHtml
            ? apply(tplHtml)
                .replace('{{experiences}}', `<ul>${replacements['{{experiences}}']}</ul>`)
                .replace('{{education}}', `<ul>${replacements['{{education}}']}</ul>`)
                .replace('{{skills}}', `<ul>${replacements['{{skills}}']}</ul>`)
            : `<div style="font-family: Arial, sans-serif; padding: 16px;">
           <h1 style="margin:0 0 8px 0; font-size:20px;">${profile.fullName ?? ''}</h1>
           <div style="margin:0 0 12px 0; color:#555;">${profile.headline ?? ''}</div>
           <div style="white-space:pre-wrap; font-size:14px; line-height:1.5;">${apply(tplBody || '{{content}}').replace(/\n/g, '<br/>')}</div>
         </div>`;
        const previewBaseCss = `<style>
      @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
      * { box-sizing: border-box; }
      body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; line-height: 1.5; text-align: justify; }
      .name { font-size: 14pt; font-weight: bold; }
      .headline { font-size: 12pt; font-weight: bold; }
      .meta-lines, .meta, .meta-line { font-size: 12pt; }
      .label { font-size: 12pt; font-weight: bold; text-transform: uppercase; }
      p { margin: 0 0 6pt 0; text-indent: 1.25cm; }
      /* Alinhamento dos marcadores com a coluna do texto */
      ul { margin: 6pt 0 0 0; padding-left: 1.25cm; list-style-position: outside; }
      li { margin: 3pt 0; text-indent: 0; }
    </style>`;
        htmlFromBody = htmlFromBody.includes('</head>')
            ? htmlFromBody.replace('</head>', `${previewBaseCss}</head>`)
            : `<!doctype html><html><head><meta charset="utf-8"/>${previewBaseCss}</head><body>${htmlFromBody}</body></html>`;
        const unknownPlaceholders = Array.from(new Set((htmlFromBody.match(/\{\{[^}]+\}\}/g) || []).filter((p) => !Object.keys(replacements).includes(p))));
        return { html: htmlFromBody, warnings: unknownPlaceholders };
    }
    async exportTemplatePdf(req, res, body) {
        const userId = req.user.sub;
        const profile = await this.profiles.getOrCreate(userId);
        const [xpList, edList, skList] = await Promise.all([
            this.experiences.list(userId),
            this.education.list(userId),
            this.skills.list(userId),
        ]);
        let tplBody = body?.body ?? '';
        let tplHtml = body?.html ?? null;
        const templateKey = body?.templateKey ?? '';
        const content = body?.contentOverride ?? '';
        if (!tplBody && typeof tplHtml === 'undefined' && templateKey) {
            const custom = await this.docs.findTemplate(userId, templateKey);
            if (custom) {
                tplBody = custom.body ?? '';
                tplHtml = custom.html ?? null;
            }
            else {
                const simple = templates_data_1.SIMPLE_TEMPLATES.find((t) => t.key === templateKey) ??
                    templates_data_1.SIMPLE_TEMPLATES[0];
                tplBody = simple.body ?? '';
                tplHtml = simple.html ?? null;
            }
        }
        const replacements = {
            '{{fullName}}': String(profile.fullName ?? ''),
            '{{headline}}': String(profile.headline ?? ''),
            '{{locationCity}}': String(profile.locationCity ?? ''),
            '{{locationState}}': String(profile.locationState ?? ''),
            '{{locationCountry}}': String(profile.locationCountry ?? ''),
            '{{linkedin}}': String(profile.linkedin ?? ''),
            '{{email}}': String(profile.email ?? ''),
            '{{phone}}': String(profile.phone ?? ''),
            '{{github}}': String(profile.github ?? ''),
            '{{website}}': String(profile.website ?? ''),
            '{{content}}': content || '',
            '{{experiences}}': xpList
                .map((x) => {
                const range = formatDateRange(x.startDate, x.endDate);
                const rangeStr = range ? ` (${range})` : '';
                return `<li><strong>${safe(x.title)}</strong> — ${safe(x.company)}${rangeStr}${x.description ? `<br/>${safe(x.description)}` : ''}</li>`;
            })
                .join(''),
            '{{education}}': edList
                .map((e) => {
                const range = formatDateRange(e.startDate, e.endDate);
                const rangeStr = range ? ` (${range})` : '';
                return `<li><strong>${safe(e.degree)}</strong> — ${safe(e.institution)}${rangeStr}</li>`;
            })
                .join(''),
            '{{skills}}': skList
                .map((s) => `<li>${s.name} — nível ${s.level}</li>`)
                .join(''),
        };
        const applyRepl = (text) => {
            let out = text;
            for (const [k, v] of Object.entries(replacements))
                out = out.split(k).join(v);
            return out;
        };
        let htmlFromBody = tplHtml
            ? applyRepl(tplHtml)
                .replace('{{experiences}}', `<ul>${replacements['{{experiences}}']}</ul>`)
                .replace('{{education}}', `<ul>${replacements['{{education}}']}</ul>`)
                .replace('{{skills}}', `<ul>${replacements['{{skills}}']}</ul>`)
            : `<div style="font-family: Arial, sans-serif; padding: 16px;">
           <h1 style="margin:0 0 8px 0; font-size:20px;">${profile.fullName ?? ''}</h1>
           <div style="margin:0 0 12px 0; color:#555;">${profile.headline ?? ''}</div>
           <div style="white-space:pre-wrap; font-size:14px; line-height:1.5;">${applyRepl(tplBody || '{{content}}').replace(/\n/g, '<br/>')}</div>
         </div>`;
        const baseCss2 = `<style>
      @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
      * { box-sizing: border-box; }
      body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; line-height: 1.5; text-align: justify; }
      a { color: #000; text-decoration: none; }
      .meta-lines, .meta, .meta-line { font-size: 12pt; }
      .label { font-size: 12pt; font-weight: bold; text-transform: uppercase; }
      p { margin: 0 0 6pt 0; text-indent: 1.25cm; }
      /* Alinhamento dos marcadores com a coluna do texto */
      ul { margin: 6pt 0 0 0; padding-left: 1.25cm; list-style-position: outside; }
      li { margin: 3pt 0; text-indent: 0; }
    </style>`;
        htmlFromBody = htmlFromBody.includes('</head>')
            ? htmlFromBody.replace('</head>', `${baseCss2}</head>`)
            : `<!doctype html><html><head><meta charset="utf-8"/>${baseCss2}</head><body>${htmlFromBody}</body></html>`;
        const isTestEnv = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
        if (!isTestEnv) {
            try {
                const puppeteer = (await import('puppeteer')).default;
                const browser = await puppeteer.launch({ headless: 'new' });
                const page = await browser.newPage();
                await page.setContent(htmlFromBody, { waitUntil: 'load' });
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                });
                await browser.close();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="curriculo.pdf"');
                return res.end(pdfBuffer);
            }
            catch { }
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="curriculo.pdf"');
        const PDFDocument = (await import('pdfkit')).default;
        const pdf = new PDFDocument();
        pdf.pipe(res);
        pdf
            .fontSize(18)
            .text(String(profile.fullName ?? ''), { underline: true });
        pdf.moveDown();
        pdf.fontSize(12).text(htmlFromBody
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim());
        pdf.end();
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateDocDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RenameDocDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "rename", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id/content'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateContentDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Get)(':id/export.pdf'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "exportPdf", null);
__decorate([
    (0, common_1.Get)('templates/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Put)(':id/template'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "setTemplate", null);
__decorate([
    (0, common_1.Get)('templates/custom'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "listCustomTemplates", null);
__decorate([
    (0, common_1.Get)('templates/favorites'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "listFavorites", null);
__decorate([
    (0, common_1.Post)('templates/favorites/:key'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "addFavorite", null);
__decorate([
    (0, common_1.Delete)('templates/favorites/:key'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "removeFavorite", null);
__decorate([
    (0, common_1.Put)('templates/custom/:key'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "upsertCustomTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/custom/:key'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "removeCustomTemplate", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "listVersions", null);
__decorate([
    (0, common_1.Post)(':id/versions/:versionId/restore'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "restoreVersion", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(':id/unarchive'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "unarchive", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Post)('templates/preview'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "previewTemplate", null);
__decorate([
    (0, common_1.Post)('templates/export.pdf'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "exportTemplatePdf", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('documents'),
    __param(5, (0, typeorm_1.InjectRepository)(template_favorite_entity_1.TemplateFavoriteEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService,
        profile_service_1.ProfileService,
        experience_service_1.ExperienceService,
        education_service_1.EducationService,
        skill_service_1.SkillService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map