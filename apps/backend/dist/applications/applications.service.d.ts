import { Repository } from 'typeorm';
import { ApplicationEntity, ApplicationStatus } from './applications.entity';
export declare class ApplicationsService {
    private readonly repo;
    constructor(repo: Repository<ApplicationEntity>);
    list(userId: string, status?: ApplicationStatus): Promise<ApplicationEntity[]>;
    create(userId: string, data: {
        company: string;
        title: string;
        jobUrl?: string | null;
        notes?: string | null;
        status?: ApplicationStatus;
        meta?: any;
    }): Promise<ApplicationEntity>;
    update(userId: string, id: string, data: Partial<{
        company: string;
        title: string;
        jobUrl: string | null;
        notes: string | null;
        status: ApplicationStatus;
        meta: any;
    }>): Promise<ApplicationEntity>;
    remove(userId: string, id: string): Promise<void>;
    metrics(userId: string): Promise<{
        total: number;
        saved: number;
        applied: number;
        interview: number;
        offer: number;
        rejected: number;
    }>;
}
