import { ProfileEntity } from './profile.entity';
export declare class ExperienceEntity {
    id: string;
    title: string;
    company: string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
    profile: ProfileEntity;
}
