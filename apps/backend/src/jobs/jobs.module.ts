import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ProfileModule } from '../profile/profile.module';
import { DocumentsModule } from '../documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobAnalysisEntity } from './job-analysis.entity';
import { UsageCounterEntity } from '../common/usage/usage.entity';
import { UserEntity } from '../auth/user.entity';
import { RequireProPlanGuard } from '../common/guards/plan.guard';
import { UsageService } from '../common/usage/usage.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ProfileModule,
    DocumentsModule,
    TypeOrmModule.forFeature([
      JobAnalysisEntity,
      UsageCounterEntity,
      UserEntity,
    ]),
  ],
  controllers: [JobsController],
  providers: [JobsService, UsageService, RequireProPlanGuard],
})
export class JobsModule {}
