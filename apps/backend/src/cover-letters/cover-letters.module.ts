import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CoverLettersController } from './cover-letters.controller';
import { CoverLettersService } from './cover-letters.service';
import { RequireProPlanGuard } from '../common/guards/plan.guard';
import { CoverLetterEntity } from './cover-letter.entity';
import { UserEntity } from '../auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TypeOrmModule.forFeature([CoverLetterEntity, UserEntity]),
  ],
  controllers: [CoverLettersController],
  providers: [CoverLettersService, RequireProPlanGuard],
})
export class CoverLettersModule {}
