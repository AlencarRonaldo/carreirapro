import { UserEntity } from '../auth/user.entity';
export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
export declare class ApplicationEntity {
    id: string;
    userId: string;
    user: UserEntity;
    company: string;
    title: string;
    jobUrl: string | null;
    notes: string | null;
    status: ApplicationStatus;
    meta?: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
}
