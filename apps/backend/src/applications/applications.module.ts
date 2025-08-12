import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationEntity } from './applications.entity';
import { UserEntity } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity, UserEntity])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}


