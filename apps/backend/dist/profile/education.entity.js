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
exports.EducationEntity = void 0;
const typeorm_1 = require("typeorm");
const profile_entity_1 = require("./profile.entity");
let EducationEntity = class EducationEntity {
    id;
    institution;
    degree;
    startDate;
    endDate;
    profile;
};
exports.EducationEntity = EducationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EducationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EducationEntity.prototype, "institution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EducationEntity.prototype, "degree", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], EducationEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], EducationEntity.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_entity_1.ProfileEntity, (p) => p.education, { onDelete: 'CASCADE' }),
    __metadata("design:type", profile_entity_1.ProfileEntity)
], EducationEntity.prototype, "profile", void 0);
exports.EducationEntity = EducationEntity = __decorate([
    (0, typeorm_1.Entity)('education')
], EducationEntity);
//# sourceMappingURL=education.entity.js.map