import { Repository } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { SkillEntity } from './skill.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { ImportLinkedinDto } from './dto/import-linkedin.dto';
import { ResumeParserService } from './resume-parser.service';
export interface Profile {
    id: string;
    fullName: string;
    headline: string;
    locationCity: string;
    locationState: string;
    locationCountry: string;
    linkedin: string;
    github: string;
    website: string;
    email: string;
    phone: string;
    maritalStatus: string;
    experiences?: ExperienceEntity[];
    education?: EducationEntity[];
    skills?: SkillEntity[];
}
export declare class ProfileService {
    private readonly repo;
    private readonly experienceRepo;
    private readonly educationRepo;
    private readonly skillRepo;
    private readonly http;
    private readonly config;
    private readonly resumeParser;
    private readonly store;
    constructor(repo: Repository<ProfileEntity>, experienceRepo: Repository<ExperienceEntity>, educationRepo: Repository<EducationEntity>, skillRepo: Repository<SkillEntity>, http: HttpService, config: ConfigService, resumeParser: ResumeParserService);
    getOrCreate(userId: string): Promise<Profile>;
    update(userId: string, data: Partial<Profile>): Promise<Profile>;
    importFromResume(userId: string, file: any | undefined, overwrite?: boolean): Promise<Profile>;
    private extractTextBestEffort;
    importFromLinkedin(userId: string, input: ImportLinkedinDto): Promise<Profile>;
}
