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
exports.SkillEntity = void 0;
const typeorm_1 = require("typeorm");
const profile_entity_1 = require("./profile.entity");
let SkillEntity = class SkillEntity {
    id;
    name;
    level;
    profile;
};
exports.SkillEntity = SkillEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SkillEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SkillEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SkillEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_entity_1.ProfileEntity, (p) => p.skills, { onDelete: 'CASCADE' }),
    __metadata("design:type", profile_entity_1.ProfileEntity)
], SkillEntity.prototype, "profile", void 0);
exports.SkillEntity = SkillEntity = __decorate([
    (0, typeorm_1.Entity)('skills')
], SkillEntity);
//# sourceMappingURL=skill.entity.js.map