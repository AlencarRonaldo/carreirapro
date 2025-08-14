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
exports.JobAnalysisEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/user.entity");
let JobAnalysisEntity = class JobAnalysisEntity {
    id;
    userId;
    user;
    company;
    title;
    sourceUrl;
    requiredSkills;
    responsibilities;
    keywords;
    createdAt;
};
exports.JobAnalysisEntity = JobAnalysisEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JobAnalysisEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobAnalysisEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.UserEntity)
], JobAnalysisEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], JobAnalysisEntity.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], JobAnalysisEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1024, nullable: true }),
    __metadata("design:type", Object)
], JobAnalysisEntity.prototype, "sourceUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], JobAnalysisEntity.prototype, "requiredSkills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], JobAnalysisEntity.prototype, "responsibilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], JobAnalysisEntity.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobAnalysisEntity.prototype, "createdAt", void 0);
exports.JobAnalysisEntity = JobAnalysisEntity = __decorate([
    (0, typeorm_1.Entity)('job_analyses')
], JobAnalysisEntity);
//# sourceMappingURL=job-analysis.entity.js.map