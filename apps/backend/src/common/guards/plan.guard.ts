import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../auth/user.entity';

@Injectable()
export class RequireProPlanGuard implements CanActivate {
  constructor(@InjectRepository(UserEntity) private readonly users: Repository<UserEntity>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const userId: string | undefined = req?.user?.sub;
    if (!userId) throw new ForbiddenException('Acesso restrito');
    // Em desenvolvimento, liberamos recursos PRO para facilitar testes locais
    if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_PRO_IN_STARTER === '1') {
      return true;
    }
    const user = await this.users.findOne({ where: { id: userId } });
    const plan = user?.plan ?? 'starter';
    if (plan === 'starter') throw new ForbiddenException('Recurso disponível apenas no plano Pro/Team');
    return true;
  }
}


