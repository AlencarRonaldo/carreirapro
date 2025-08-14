"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const profile_entity_1 = require("./profile.entity");
const experience_entity_1 = require("./experience.entity");
const education_entity_1 = require("./education.entity");
const skill_entity_1 = require("./skill.entity");
const profile_controller_1 = require("./profile.controller");
const profile_service_1 = require("./profile.service");
const resume_parser_service_1 = require("./resume-parser.service");
const experience_service_1 = require("./experience.service");
const education_service_1 = require("./education.service");
const skill_service_1 = require("./skill.service");
const experience_controller_1 = require("./experience.controller");
const education_controller_1 = require("./education.controller");
const skill_controller_1 = require("./skill.controller");
const debug_profile_controller_1 = require("./debug-profile.controller");
const test_linkedin_controller_1 = require("./test-linkedin.controller");
const user_entity_1 = require("../auth/user.entity");
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                profile_entity_1.ProfileEntity,
                experience_entity_1.ExperienceEntity,
                education_entity_1.EducationEntity,
                skill_entity_1.SkillEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [
            profile_controller_1.ProfileController,
            experience_controller_1.ExperienceController,
            education_controller_1.EducationController,
            skill_controller_1.SkillController,
            debug_profile_controller_1.DebugProfileController,
            test_linkedin_controller_1.TestLinkedInController,
        ],
        providers: [
            profile_service_1.ProfileService,
            resume_parser_service_1.ResumeParserService,
            experience_service_1.ExperienceService,
            education_service_1.EducationService,
            skill_service_1.SkillService,
        ],
        exports: [
            profile_service_1.ProfileService,
            resume_parser_service_1.ResumeParserService,
            experience_service_1.ExperienceService,
            education_service_1.EducationService,
            skill_service_1.SkillService,
        ],
    })
], ProfileModule);
//# sourceMappingURL=profile.module.js.map