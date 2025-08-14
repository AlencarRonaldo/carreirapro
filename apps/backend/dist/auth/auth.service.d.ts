import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwt;
    private readonly users;
    constructor(jwt: JwtService, users: Repository<UserEntity>);
    private getAccessSecret;
    private getRefreshSecret;
    private signTokens;
    validateAndSign(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(email: string, password: string, selectedPlan?: 'starter' | 'pro' | 'team', name?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        requiresPayment?: boolean;
    }>;
    private resetTokens;
    requestPasswordReset(email: string): Promise<{
        ok: true;
        token: string;
    }>;
    resetPassword(email: string, token: string, newPassword: string): Promise<{
        ok: true;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
