import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
declare class RegisterDto extends LoginDto {
    name: string;
    selectedPlan?: 'starter' | 'pro' | 'team';
}
declare class ForgotDto {
    email: string;
}
declare class ResetDto {
    email: string;
    token: string;
    newPassword: string;
}
declare class RefreshDto {
    refreshToken: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(body: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        requiresPayment?: boolean;
    }>;
    forgot(body: ForgotDto): Promise<{
        ok: true;
        token: string;
    }>;
    reset(body: ResetDto): Promise<{
        ok: true;
    }>;
    refresh(body: RefreshDto): Promise<{
        accessToken: string;
    }>;
    me(req: any): Promise<any>;
}
export {};
