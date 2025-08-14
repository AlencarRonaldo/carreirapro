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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const applications_entity_1 = require("./applications.entity");
let ApplicationsService = class ApplicationsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    list(userId, status) {
        return this.repo.find({
            where: { userId, ...(status ? { status } : {}) },
            order: { updatedAt: 'DESC' },
        });
    }
    async create(userId, data) {
        const app = this.repo.create({
            userId,
            company: data.company,
            title: data.title,
            jobUrl: data.jobUrl ?? null,
            notes: data.notes ?? null,
            status: data.status ?? 'saved',
            meta: data.meta ?? null,
        });
        return this.repo.save(app);
    }
    async update(userId, id, data) {
        const app = await this.repo.findOne({ where: { id, userId } });
        if (!app)
            throw new common_1.NotFoundException('Aplicação não encontrada');
        Object.assign(app, data);
        return this.repo.save(app);
    }
    async remove(userId, id) {
        const app = await this.repo.findOne({ where: { id, userId } });
        if (!app)
            return;
        await this.repo.remove(app);
    }
    async metrics(userId) {
        const rows = await this.repo
            .createQueryBuilder('a')
            .select('a.status', 'status')
            .addSelect('COUNT(1)', 'count')
            .where('a.userId = :userId', { userId })
            .groupBy('a.status')
            .getRawMany();
        const base = {
            saved: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
        };
        for (const r of rows)
            base[r.status] = Number(r.count) || 0;
        const total = Object.values(base).reduce((a, b) => a + b, 0);
        return { ...base, total };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(applications_entity_1.ApplicationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map