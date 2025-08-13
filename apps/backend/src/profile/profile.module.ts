import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { SkillEntity } from './skill.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ResumeParserService } from './resume-parser.service';
import { ExperienceService } from './experience.service';
import { EducationService } from './education.service';
import { SkillService } from './skill.service';
import { ExperienceController } from './experience.controller';
import { EducationController } from './education.controller';
import { SkillController } from './skill.controller';
import { DebugProfileController } from './debug-profile.controller';
import { TestLinkedInController } from './test-linkedin.controller';
import { UserEntity } from '../auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TypeOrmModule.forFeature([
      ProfileEntity,
      ExperienceEntity,
      EducationEntity,
      SkillEntity,
      UserEntity,
    ]),
  ],
  controllers: [
    ProfileController,
    ExperienceController,
    EducationController,
    SkillController,
    DebugProfileController,
    TestLinkedInController,
  ],
  providers: [
    ProfileService,
    ResumeParserService,
    ExperienceService,
    EducationService,
    SkillService,
  ],
  exports: [
    ProfileService,
    ResumeParserService,
    ExperienceService,
    EducationService,
    SkillService,
  ],
})
export class ProfileModule {}
