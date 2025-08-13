import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  private getAccessSecret(): string {
    return process.env.JWT_SECRET ?? 'dev-secret';
  }

  private getRefreshSecret(): string {
    return process.env.REFRESH_SECRET ?? 'dev-refresh-secret';
  }

  private async signTokens(
    user: UserRecord,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

  async validateAndSign(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.signTokens(user);
  }

  async register(
    email: string,
    password: string,
    selectedPlan?: 'starter' | 'pro' | 'team',
    name?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    requiresPayment?: boolean;
  }> {
    let user = await this.users.findOne({ where: { email } });
    if (!user) {
      const plan =
        selectedPlan && ['starter', 'pro', 'team'].includes(selectedPlan)
          ? selectedPlan
          : 'starter';
      const subscriptionStatus =
        plan === 'starter' ? 'active' : 'pending_payment';
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

  private resetTokens = new Map<string, { token: string; expiresAt: number }>();

  async requestPasswordReset(
    email: string,
  ): Promise<{ ok: true; token: string }> {
    const user = await this.users.findOne({ where: { email } });
    if (!user) return { ok: true, token: '' } as any;
    const token = randomBytes(16).toString('hex');
    const expiresAt = Date.now() + 1000 * 60 * 15; // 15 min
    this.resetTokens.set(email, { token, expiresAt });
    // Em produção: enviar e-mail via Resend/SES/etc.
    return { ok: true, token };
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<{ ok: true }> {
    const rec = this.resetTokens.get(email);
    if (!rec || rec.token !== token || rec.expiresAt < Date.now()) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    await this.users.save(user);
    this.resetTokens.delete(email);
    return { ok: true };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const decoded: any = await this.jwt.verifyAsync(refreshToken, {
        secret: this.getRefreshSecret(),
      });
      if (!decoded || typeof decoded.email !== 'string') {
        throw new UnauthorizedException('Refresh inválido');
      }
      const user = await this.users.findOne({
        where: { email: decoded.email },
      });
      if (!user) {
        throw new UnauthorizedException('Refresh inválido');
      }
      const payload = { sub: user.id, email: user.email };
      const accessToken = await this.jwt.signAsync(payload, {
        secret: this.getAccessSecret(),
        expiresIn: '1h',
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh inválido');
    }
  }
}
