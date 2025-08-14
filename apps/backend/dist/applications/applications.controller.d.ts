import { ApplicationsService } from './applications.service';
import type { ApplicationStatus } from './applications.entity';
import type { Response } from 'express';
declare class CreateApplicationDto {
    company: string;
    title: string;
    jobUrl?: string;
    notes?: string;
    status?: ApplicationStatus;
}
declare class UpdateApplicationDto {
    company?: string;
    title?: string;
    jobUrl?: string;
    notes?: string;
    status?: ApplicationStatus;
}
export declare class ApplicationsController {
    private readonly apps;
    constructor(apps: ApplicationsService);
    list(req: any, status?: ApplicationStatus): Promise<import("./applications.entity").ApplicationEntity[]>;
    create(req: any, body: CreateApplicationDto): Promise<import("./applications.entity").ApplicationEntity>;
    update(req: any, id: string, body: UpdateApplicationDto): Promise<import("./applications.entity").ApplicationEntity>;
    remove(req: any, id: string): Promise<void>;
    metrics(req: any): Promise<{
        total: number;
        saved: number;
        applied: number;
        interview: number;
        offer: number;
        rejected: number;
    }>;
    exportCsv(req: any, res: Response, status?: ApplicationStatus): Promise<void>;
    exportPdf(req: any, res: Response, status?: ApplicationStatus): Promise<void>;
}
export {};
