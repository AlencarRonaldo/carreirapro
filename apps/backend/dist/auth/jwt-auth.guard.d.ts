import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwt;
    private readonly users;
    constructor(jwt: JwtService, users: Repository<UserEntity>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
