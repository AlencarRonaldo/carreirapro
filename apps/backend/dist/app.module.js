"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("./auth/auth.module");
const profile_module_1 = require("./profile/profile.module");
const throttler_1 = require("@nestjs/throttler");
const health_controller_1 = require("./health.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./auth/user.entity");
const stripe_service_1 = require("./billing/stripe.service");
const documents_module_1 = require("./documents/documents.module");
const ai_module_1 = require("./ai/ai.module");
const cover_letters_module_1 = require("./cover-letters/cover-letters.module");
const jobs_module_1 = require("./jobs/jobs.module");
const applications_module_1 = require("./applications/applications.module");
const billing_controller_1 = require("./billing/billing.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const url = process.env.DATABASE_URL;
                    if (!url) {
                        return {
                            type: 'sqlite',
                            database: ':memory:',
                            synchronize: true,
                            autoLoadEntities: true,
                        };
                    }
                    return {
                        type: 'postgres',
                        url,
                        synchronize: true,
                        autoLoadEntities: true,
                    };
                },
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.NODE_ENV === 'production'
                    ? process.env.JWT_SECRET
                    : (process.env.JWT_SECRET ?? 'dev-secret'),
                signOptions: { expiresIn: '1h' },
            }),
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            documents_module_1.DocumentsModule,
            ai_module_1.AiModule,
            cover_letters_module_1.CoverLettersModule,
            jobs_module_1.JobsModule,
            applications_module_1.ApplicationsModule,
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController, billing_controller_1.BillingController],
        providers: [
            app_service_1.AppService,
            stripe_service_1.StripeService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map