"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const jobs_controller_1 = require("./jobs.controller");
const jobs_service_1 = require("./jobs.service");
const profile_module_1 = require("../profile/profile.module");
const documents_module_1 = require("../documents/documents.module");
const typeorm_1 = require("@nestjs/typeorm");
const job_analysis_entity_1 = require("./job-analysis.entity");
const usage_entity_1 = require("../common/usage/usage.entity");
const user_entity_1 = require("../auth/user.entity");
const plan_guard_1 = require("../common/guards/plan.guard");
const usage_service_1 = require("../common/usage/usage.service");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            axios_1.HttpModule,
            profile_module_1.ProfileModule,
            documents_module_1.DocumentsModule,
            typeorm_1.TypeOrmModule.forFeature([
                job_analysis_entity_1.JobAnalysisEntity,
                usage_entity_1.UsageCounterEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [jobs_controller_1.JobsController],
        providers: [jobs_service_1.JobsService, usage_service_1.UsageService, plan_guard_1.RequireProPlanGuard],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map