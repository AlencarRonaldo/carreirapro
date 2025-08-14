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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    jwt;
    users;
    constructor(jwt, users) {
        this.jwt = jwt;
        this.users = users;
    }
    getAccessSecret() {
        return process.env.JWT_SECRET ?? 'dev-secret';
    }
    getRefreshSecret() {
        return process.env.REFRESH_SECRET ?? 'dev-refresh-secret';
    }
    async signTokens(user) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwt.signAsync(payload, {
            secret: this.getAccessSecret(),
            expiresIn: '1h',
        });
        const refreshToken = await this.jwt.signAsync(payload, {
            secret: this.getRefreshSecret(),
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
    async validateAndSign(email, password) {
        const user = await this.users.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        return this.signTokens(user);
    }
    async register(email, password, selectedPlan, name) {
        let user = await this.users.findOne({ where: { email } });
        if (!user) {
            const plan = selectedPlan && ['starter', 'pro', 'team'].includes(selectedPlan)
                ? selectedPlan
                : 'starter';
            const subscriptionStatus = plan === 'starter' ? 'active' : 'pending_payment';
            user = this.users.create({
                email,
                name: name ?? null,
                passwordHash: bcrypt.hashSync(password, 10),
                plan,
                subscriptionStatus,
            });
            await this.users.save(user);
        }
        const tokens = await this.signTokens(user);
        return { ...tokens, requiresPayment: user.plan !== 'starter' };
    }
    resetTokens = new Map();
    async requestPasswordReset(email) {
        const user = await this.users.findOne({ where: { email } });
        if (!user)
            return { ok: true, token: '' };
        const token = (0, crypto_1.randomBytes)(16).toString('hex');
        const expiresAt = Date.now() + 1000 * 60 * 15;
        this.resetTokens.set(email, { token, expiresAt });
        return { ok: true, token };
    }
    async resetPassword(email, token, newPassword) {
        const rec = this.resetTokens.get(email);
        if (!rec || rec.token !== token || rec.expiresAt < Date.now()) {
            throw new common_1.UnauthorizedException('Token inválido ou expirado');
        }
        const user = await this.users.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        user.passwordHash = bcrypt.hashSync(newPassword, 10);
        await this.users.save(user);
        this.resetTokens.delete(email);
        return { ok: true };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = await this.jwt.verifyAsync(refreshToken, {
                secret: this.getRefreshSecret(),
            });
            if (!decoded || typeof decoded.email !== 'string') {
                throw new common_1.UnauthorizedException('Refresh inválido');
            }
            const user = await this.users.findOne({
                where: { email: decoded.email },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Refresh inválido');
            }
            const payload = { sub: user.id, email: user.email };
            const accessToken = await this.jwt.signAsync(payload, {
                secret: this.getAccessSecret(),
                expiresIn: '1h',
            });
            return { accessToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh inválido');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map