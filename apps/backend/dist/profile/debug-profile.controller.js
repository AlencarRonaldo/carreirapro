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
exports.DebugProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const import_linkedin_dto_1 = require("./dto/import-linkedin.dto");
let DebugProfileController = class DebugProfileController {
    profiles;
    constructor(profiles) {
        this.profiles = profiles;
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
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
};
exports.DebugProfileController = DebugProfileController;
__decorate([
    (0, common_1.Post)('linkedin-import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_linkedin_dto_1.ImportLinkedinDto]),
    __metadata("design:returntype", Promise)
], DebugProfileController.prototype, "debugLinkedInImport", null);
exports.DebugProfileController = DebugProfileController = __decorate([
    (0, common_1.Controller)('debug/profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], DebugProfileController);
//# sourceMappingURL=debug-profile.controller.js.map