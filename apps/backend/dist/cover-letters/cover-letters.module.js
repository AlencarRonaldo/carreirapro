"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverLettersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const cover_letters_controller_1 = require("./cover-letters.controller");
const cover_letters_service_1 = require("./cover-letters.service");
const plan_guard_1 = require("../common/guards/plan.guard");
const cover_letter_entity_1 = require("./cover-letter.entity");
const user_entity_1 = require("../auth/user.entity");
let CoverLettersModule = class CoverLettersModule {
};
exports.CoverLettersModule = CoverLettersModule;
exports.CoverLettersModule = CoverLettersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([cover_letter_entity_1.CoverLetterEntity, user_entity_1.UserEntity]),
        ],
        controllers: [cover_letters_controller_1.CoverLettersController],
        providers: [cover_letters_service_1.CoverLettersService, plan_guard_1.RequireProPlanGuard],
    })
], CoverLettersModule);
//# sourceMappingURL=cover-letters.module.js.map