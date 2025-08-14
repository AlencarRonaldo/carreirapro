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
exports.CoverLettersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cover_letters_service_1 = require("./cover-letters.service");
const dto_1 = require("./dto");
const plan_guard_1 = require("../common/guards/plan.guard");
let CoverLettersController = class CoverLettersController {
    service;
    constructor(service) {
        this.service = service;
    }
    generate(req, body) {
        return this.service.generateCoverLetter(req.user.sub, body);
    }
    generateVariations(req, body) {
        return this.service.generateCoverLetterVariations(req.user.sub, body);
    }
    update(req, id, body) {
        return this.service.updateCoverLetter(req.user.sub, id, body);
    }
    templates() {
        return this.service.getCoverLetterTemplates();
    }
};
exports.CoverLettersController = CoverLettersController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(plan_guard_1.RequireProPlanGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.GenerateCoverLetterDto]),
    __metadata("design:returntype", void 0)
], CoverLettersController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('variations'),
    (0, common_1.UseGuards)(plan_guard_1.RequireProPlanGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.GenerateCoverLetterDto]),
    __metadata("design:returntype", void 0)
], CoverLettersController.prototype, "generateVariations", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateCoverLetterDto]),
    __metadata("design:returntype", void 0)
], CoverLettersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoverLettersController.prototype, "templates", null);
exports.CoverLettersController = CoverLettersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cover-letters'),
    __metadata("design:paramtypes", [cover_letters_service_1.CoverLettersService])
], CoverLettersController);
//# sourceMappingURL=cover-letters.controller.js.map