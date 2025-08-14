import { Repository } from 'typeorm';
import { EducationEntity } from './education.entity';
import { ProfileEntity } from './profile.entity';
export declare class EducationService {
    private readonly repo;
    private readonly profiles;
    constructor(repo: Repository<EducationEntity>, profiles: Repository<ProfileEntity>);
    list(userId: string): Promise<EducationEntity[]>;
    create(userId: string, data: Partial<EducationEntity>): Promise<EducationEntity>;
    update(userId: string, id: string, data: Partial<EducationEntity>): Promise<EducationEntity>;
    remove(userId: string, id: string): Promise<void>;
}
