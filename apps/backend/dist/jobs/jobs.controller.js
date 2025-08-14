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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const jobs_service_1 = require("./jobs.service");
const profile_service_1 = require("../profile/profile.service");
const documents_service_1 = require("../documents/documents.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_analysis_entity_1 = require("./job-analysis.entity");
const plan_guard_1 = require("../common/guards/plan.guard");
const usage_service_1 = require("../common/usage/usage.service");
let JobsController = class JobsController {
    jobs;
    profiles;
    docs;
    jobRepo;
    usage;
    constructor(jobs, profiles, docs, jobRepo, usage) {
        this.jobs = jobs;
        this.profiles = profiles;
        this.docs = docs;
        this.jobRepo = jobRepo;
        this.usage = usage;
    }
    async analyze(req, body) {
        const plan = req.user?.plan || 'starter';
        if (plan === 'starter') {
            const used = await this.usage.getCount(req.user.sub, 'job_analyses');
            if (used >= 3) {
                return {
                    error: 'limit',
                    message: 'Limite mensal atingido no plano Starter (3 análises/mês)',
                };
            }
        }
        const result = await this.jobs.analyzeJob(body);
        if (plan === 'starter')
            await this.usage.increment(req.user.sub, 'job_analyses', 1);
        return result;
    }
    score(req, body) {
        return this.jobs.scoreProfileMatch({ userId: req.user.sub }, body.analysis);
    }
    async optimizeResume(req, body) {
        const userId = req.user.sub;
        const profile = await this.profiles.getOrCreate(userId);
        const suggestions = await this.jobs.scoreProfileMatch(profile, body.analysis);
        const missing = Array.isArray(suggestions?.missingKeywords)
            ? suggestions.missingKeywords
            : [];
        const extra = missing.length
            ? `\n\nPalavras-chave adicionadas: ${missing.join(', ')}`
            : '';
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
    async saveAnalysis(req, body) {
        const userId = req.user.sub;
        const a = body.analysis || {};
        const entity = this.jobRepo.create({
            userId,
            company: a.company ?? '',
            title: a.title ?? '',
            sourceUrl: body.url ?? null,
            requiredSkills: Array.isArray(a.requiredSkills) ? a.requiredSkills : [],
            responsibilities: Array.isArray(a.responsibilities)
                ? a.responsibilities
                : [],
            keywords: Array.isArray(a.keywords) ? a.keywords : [],
        });
        const saved = await this.jobRepo.save(entity);
        return saved;
    }
    async saveAsApplication(req, body) {
        const userId = req.user.sub;
        const a = body.analysis || {};
        const app = (await this.docs);
        return {
            company: a.company ?? '',
            title: a.title ?? '',
            jobUrl: body.url ?? null,
            status: 'saved',
        };
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "analyze", null);
__decorate([
    (0, common_1.Post)('score'),
    (0, common_1.UseGuards)(plan_guard_1.RequireProPlanGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "score", null);
__decorate([
    (0, common_1.Post)('optimize-resume'),
    (0, common_1.UseGuards)(plan_guard_1.RequireProPlanGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "optimizeResume", null);
__decorate([
    (0, common_1.Post)('save-analysis'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "saveAnalysis", null);
__decorate([
    (0, common_1.Post)('save-as-application'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "saveAsApplication", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('jobs'),
    __param(3, (0, typeorm_1.InjectRepository)(job_analysis_entity_1.JobAnalysisEntity)),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        profile_service_1.ProfileService,
        documents_service_1.DocumentsService,
        typeorm_2.Repository,
        usage_service_1.UsageService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map