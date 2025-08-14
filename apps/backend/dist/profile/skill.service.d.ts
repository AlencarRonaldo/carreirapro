import { Repository } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { ProfileEntity } from './profile.entity';
export declare class SkillService {
    private readonly repo;
    private readonly profiles;
    constructor(repo: Repository<SkillEntity>, profiles: Repository<ProfileEntity>);
    list(userId: string): Promise<SkillEntity[]>;
    create(userId: string, data: Partial<SkillEntity>): Promise<SkillEntity>;
    update(userId: string, id: string, data: Partial<SkillEntity>): Promise<SkillEntity>;
    remove(userId: string, id: string): Promise<void>;
}
