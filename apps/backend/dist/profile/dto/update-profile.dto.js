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
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateProfileDto {
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
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "headline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "locationCity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "locationState", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "locationCountry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        const v = value.trim();
        if (v.length === 0)
            return undefined;
        return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    }),
    (0, class_validator_1.ValidateIf)((o) => typeof o.linkedin === 'string' && o.linkedin.trim().length > 0),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'linkedin deve ser uma URL http/https' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "linkedin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        const v = value.trim();
        if (v.length === 0)
            return undefined;
        return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    }),
    (0, class_validator_1.ValidateIf)((o) => typeof o.github === 'string' && o.github.trim().length > 0),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'github deve ser uma URL http/https' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "github", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        const v = value.trim();
        if (v.length === 0)
            return undefined;
        return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    }),
    (0, class_validator_1.ValidateIf)((o) => typeof o.website === 'string' && o.website.trim().length > 0),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'website deve ser uma URL http/https' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "maritalStatus", void 0);
//# sourceMappingURL=update-profile.dto.js.map