import { UserEntity } from '../auth/user.entity';
export declare class JobAnalysisEntity {
    id: string;
    userId: string;
    user: UserEntity;
    company: string;
    title: string;
    sourceUrl: string | null;
    requiredSkills: string[];
    responsibilities: string[];
    keywords: string[];
    createdAt: Date;
}
