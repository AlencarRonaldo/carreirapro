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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const profile_service_1 = require("./profile.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const import_linkedin_dto_1 = require("./dto/import-linkedin.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let ProfileController = class ProfileController {
    profiles;
    constructor(profiles) {
        this.profiles = profiles;
    }
    async getMine(req) {
        const userId = req.user?.sub;
        return this.profiles.getOrCreate(userId);
    }
    async updateMine(req, body) {
        const userId = req.user?.sub;
        return this.profiles.update(userId, body);
    }
    async importFromLinkedin(req, body) {
        const userId = req.user?.sub;
        return this.profiles.importFromLinkedin(userId, body);
    }
    async importFromResume(req, file, overwrite) {
        const userId = req.user?.sub;
        const ow = String(overwrite ?? 'true').toLowerCase() !== 'false';
        return this.profiles.importFromResume(userId, file, ow);
    }
    async importFromPdf(req, file, overwrite) {
        const userId = req.user?.sub;
        const ow = String(overwrite ?? 'true').toLowerCase() !== 'false';
        return this.profiles.importFromResume(userId, file, ow);
    }
    async importFromCv(req, file, overwrite) {
        const userId = req.user?.sub;
        const ow = String(overwrite ?? 'true').toLowerCase() !== 'false';
        return this.profiles.importFromResume(userId, file, ow);
    }
    async debugLinkedInImport(body) {
        console.log('🔧 DEBUG ENDPOINT - LinkedIn Import Test');
        console.log('🔧 DEBUG ENDPOINT - Body:', JSON.stringify(body, null, 2));
        try {
            const testUserId = 'test-debug-user-id';
            const result = await this.profiles.importFromLinkedin(testUserId, body);
            console.log('🔧 DEBUG ENDPOINT - Success:', result);
            return { success: true, data: result };
        }
        catch (error) {
            console.error('🔧 DEBUG ENDPOINT - Error:', error);
            return { success: false, error: error.message };
        }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMine", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateMine", null);
__decorate([
    (0, common_1.Post)('import/linkedin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, import_linkedin_dto_1.ImportLinkedinDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "importFromLinkedin", null);
__decorate([
    (0, common_1.Post)('import/resume'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('overwrite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "importFromResume", null);
__decorate([
    (0, common_1.Post)('import/pdf'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('overwrite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "importFromPdf", null);
__decorate([
    (0, common_1.Post)('import/cv'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('overwrite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "importFromCv", null);
__decorate([
    (0, common_1.Post)('debug/linkedin-import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_linkedin_dto_1.ImportLinkedinDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "debugLinkedInImport", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map