import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ProfileModule } from '../profile/profile.module';
import { DocumentsModule } from '../documents/documents.module';
import { UserEntity } from '../auth/user.entity';

@Module({
  imports: [ProfileModule, DocumentsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}


