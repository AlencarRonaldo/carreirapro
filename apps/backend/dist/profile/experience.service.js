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
exports.ExperienceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const experience_entity_1 = require("./experience.entity");
const profile_entity_1 = require("./profile.entity");
let ExperienceService = class ExperienceService {
    repo;
    profiles;
    constructor(repo, profiles) {
        this.repo = repo;
        this.profiles = profiles;
    }
    async list(userId) {
        return this.repo.find({
            where: { profile: { id: userId } },
            relations: { profile: true },
        });
    }
    async create(userId, data) {
        const profile = await this.profiles.findOne({ where: { id: userId } });
        const entity = this.repo.create({
            ...data,
            profile: profile ?? { id: userId },
        });
        return this.repo.save(entity);
    }
    async update(userId, id, data) {
        const entity = await this.repo.findOne({
            where: { id, profile: { id: userId } },
            relations: { profile: true },
        });
        if (!entity)
            throw new common_1.NotFoundException('Experiência não encontrada');
        Object.assign(entity, data);
        return this.repo.save(entity);
    }
    async remove(userId, id) {
        const entity = await this.repo.findOne({
            where: { id, profile: { id: userId } },
            relations: { profile: true },
        });
        if (!entity)
            throw new common_1.NotFoundException('Experiência não encontrada');
        await this.repo.remove(entity);
    }
};
exports.ExperienceService = ExperienceService;
exports.ExperienceService = ExperienceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(experience_entity_1.ExperienceEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_entity_1.ProfileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExperienceService);
//# sourceMappingURL=experience.service.js.map