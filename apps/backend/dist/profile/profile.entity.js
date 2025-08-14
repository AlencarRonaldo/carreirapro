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
exports.ProfileEntity = void 0;
const typeorm_1 = require("typeorm");
const experience_entity_1 = require("./experience.entity");
const education_entity_1 = require("./education.entity");
const skill_entity_1 = require("./skill.entity");
let ProfileEntity = class ProfileEntity {
    id;
    fullName;
    headline;
    locationCity;
    locationState;
    locationCountry;
    linkedin;
    github;
    website;
    email;
    phone;
    maritalStatus;
    experiences;
    education;
    skills;
};
exports.ProfileEntity = ProfileEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "headline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "locationCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "locationState", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "locationCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "github", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => experience_entity_1.ExperienceEntity, (e) => e.profile, { cascade: true }),
    __metadata("design:type", Array)
], ProfileEntity.prototype, "experiences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => education_entity_1.EducationEntity, (e) => e.profile, { cascade: true }),
    __metadata("design:type", Array)
], ProfileEntity.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => skill_entity_1.SkillEntity, (s) => s.profile, { cascade: true }),
    __metadata("design:type", Array)
], ProfileEntity.prototype, "skills", void 0);
exports.ProfileEntity = ProfileEntity = __decorate([
    (0, typeorm_1.Entity)('profiles')
], ProfileEntity);
//# sourceMappingURL=profile.entity.js.map