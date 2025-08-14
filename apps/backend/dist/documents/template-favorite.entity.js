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
exports.TemplateFavoriteEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/user.entity");
let TemplateFavoriteEntity = class TemplateFavoriteEntity {
    id;
    userId;
    user;
    templateKey;
    createdAt;
};
exports.TemplateFavoriteEntity = TemplateFavoriteEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TemplateFavoriteEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TemplateFavoriteEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.UserEntity)
], TemplateFavoriteEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TemplateFavoriteEntity.prototype, "templateKey", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TemplateFavoriteEntity.prototype, "createdAt", void 0);
exports.TemplateFavoriteEntity = TemplateFavoriteEntity = __decorate([
    (0, typeorm_1.Entity)('template_favorites'),
    (0, typeorm_1.Unique)(['userId', 'templateKey'])
], TemplateFavoriteEntity);
//# sourceMappingURL=template-favorite.entity.js.map