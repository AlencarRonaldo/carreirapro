import { Repository } from 'typeorm';
import { ExperienceEntity } from './experience.entity';
import { ProfileEntity } from './profile.entity';
export declare class ExperienceService {
    private readonly repo;
    private readonly profiles;
    constructor(repo: Repository<ExperienceEntity>, profiles: Repository<ProfileEntity>);
    list(userId: string): Promise<ExperienceEntity[]>;
    create(userId: string, data: Partial<ExperienceEntity>): Promise<ExperienceEntity>;
    update(userId: string, id: string, data: Partial<ExperienceEntity>): Promise<ExperienceEntity>;
    remove(userId: string, id: string): Promise<void>;
}
