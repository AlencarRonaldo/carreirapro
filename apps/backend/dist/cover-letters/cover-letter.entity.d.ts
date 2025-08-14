import { UserEntity } from '../auth/user.entity';
export declare class CoverLetterEntity {
    id: string;
    userId: string;
    user: UserEntity;
    jobTitle: string;
    company: string;
    content: string;
    tone?: string | null;
    language: string;
    metadata?: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
}
