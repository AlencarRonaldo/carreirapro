"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./auth/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    if (process.env.NODE_ENV === 'production') {
        const missing = [];
        if (!process.env.JWT_SECRET)
            missing.push('JWT_SECRET');
        if (!process.env.REFRESH_SECRET)
            missing.push('REFRESH_SECRET');
        if (missing.length) {
            throw new Error(`Variáveis obrigatórias ausentes em produção: ${missing.join(', ')}`);
        }
    }
    app.enableCors({
        origin: [
            /^http:\/\/localhost:\d+$/,
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:3002',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const ds = app.get(typeorm_1.DataSource);
    try {
        const repo = ds.getRepository(user_entity_1.UserEntity);
        const demoEmail = 'demo@carreirapro.app';
        const demoExists = await repo.findOne({ where: { email: demoEmail } });
        if (!demoExists) {
            const demoUser = repo.create({
                email: demoEmail,
                passwordHash: bcrypt.hashSync('demo123', 10),
                name: 'Demo User',
                plan: 'starter',
                subscriptionStatus: 'active',
            });
            await repo.save(demoUser);
        }
        const proEmail = 'test@carreirapro.app';
        const proExists = await repo.findOne({ where: { email: proEmail } });
        if (!proExists) {
            const proUser = repo.create({
                email: proEmail,
                passwordHash: bcrypt.hashSync('test123', 10),
                name: 'Test Pro User',
                plan: 'pro',
                subscriptionStatus: 'active',
            });
            await repo.save(proUser);
        }
    }
    catch { }
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map