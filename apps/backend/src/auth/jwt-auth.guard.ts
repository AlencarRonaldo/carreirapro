import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader: string | undefined =
      req.headers['authorization'] || req.headers['Authorization'];
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException('Token ausente');
    }
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const payload = await this.jwt.verifyAsync(token);
      // hydrate plan/status on req.user
      try {
        const user = await this.users.findOne({ where: { id: payload?.sub } });
        req.user = {
          ...payload,
          plan: user?.plan,
          subscriptionStatus: user?.subscriptionStatus,
        };
      } catch {
        req.user = payload;
      }
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
