import { JobsService } from './jobs.service';
import type { JobAnalysisInput } from './jobs.service';
import { ProfileService } from '../profile/profile.service';
import { DocumentsService } from '../documents/documents.service';
import { Repository } from 'typeorm';
import { JobAnalysisEntity } from './job-analysis.entity';
import { UsageService } from '../common/usage/usage.service';
export declare class JobsController {
    private readonly jobs;
    private readonly profiles;
    private readonly docs;
    private readonly jobRepo;
    private readonly usage;
    constructor(jobs: JobsService, profiles: ProfileService, docs: DocumentsService, jobRepo: Repository<JobAnalysisEntity>, usage: UsageService);
    analyze(req: any, body: JobAnalysisInput): Promise<any>;
    score(req: any, body: {
        analysis: any;
    }): Promise<any>;
    optimizeResume(req: any, body: {
        analysis: any;
        documentId?: string;
        createIfMissing?: boolean;
    }): Promise<{
        documentId: string;
        applied: any;
    } | {
        applied: any;
        documentId?: undefined;
    }>;
    saveAnalysis(req: any, body: {
        analysis: any;
        url?: string | null;
    }): Promise<JobAnalysisEntity>;
    saveAsApplication(req: any, body: {
        analysis: any;
        url?: string | null;
    }): Promise<{
        company: any;
        title: any;
        jobUrl: string | null;
        status: string;
    }>;
}
