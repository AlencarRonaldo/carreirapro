import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../auth/user.entity';
export declare class RequireProPlanGuard implements CanActivate {
    private readonly users;
    constructor(users: Repository<UserEntity>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
