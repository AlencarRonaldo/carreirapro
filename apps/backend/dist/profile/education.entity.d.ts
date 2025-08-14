import { ProfileEntity } from './profile.entity';
export declare class EducationEntity {
    id: string;
    institution: string;
    degree: string;
    startDate?: string | null;
    endDate?: string | null;
    profile: ProfileEntity;
}
