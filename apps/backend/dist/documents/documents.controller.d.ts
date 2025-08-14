import { DocumentsService } from './documents.service';
import type { Response } from 'express';
import { ProfileService } from '../profile/profile.service';
import { ExperienceService } from '../profile/experience.service';
import { EducationService } from '../profile/education.service';
import { SkillService } from '../profile/skill.service';
import { TemplateEntity } from './template.entity';
import { Repository } from 'typeorm';
import { TemplateFavoriteEntity } from './template-favorite.entity';
import { UserEntity } from '../auth/user.entity';
declare class CreateDocDto {
    title: string;
}
declare class RenameDocDto extends CreateDocDto {
}
declare class UpdateContentDto {
    content: string;
}
declare class UpdateTemplateDto {
    templateKey: string;
}
declare class UpdateStatusDto {
    status: 'draft' | 'pending' | 'done';
}
export declare class DocumentsController {
    private readonly docs;
    private readonly profiles;
    private readonly experiences;
    private readonly education;
    private readonly skills;
    private readonly favs;
    private readonly users;
    constructor(docs: DocumentsService, profiles: ProfileService, experiences: ExperienceService, education: EducationService, skills: SkillService, favs: Repository<TemplateFavoriteEntity>, users: Repository<UserEntity>);
    list(req: any): Promise<import("./document.entity").DocumentEntity[]>;
    create(req: any, body: CreateDocDto): Promise<import("./document.entity").DocumentEntity>;
    rename(req: any, id: string, body: RenameDocDto): Promise<import("./document.entity").DocumentEntity>;
    updateStatus(req: any, id: string, body: UpdateStatusDto): Promise<import("./document.entity").DocumentEntity>;
    remove(req: any, id: string): Promise<void>;
    get(req: any, id: string): Promise<import("./document.entity").DocumentEntity>;
    updateContent(req: any, id: string, body: UpdateContentDto): Promise<import("./document.entity").DocumentEntity>;
    exportPdf(req: any, id: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listTemplates(): {
        key: string;
        name: string;
        atsReady: boolean;
        premium: boolean;
    }[];
    setTemplate(req: any, id: string, body: UpdateTemplateDto): Promise<any>;
    listCustomTemplates(req: any): Promise<TemplateEntity[]>;
    listFavorites(req: any): Promise<string[]>;
    addFavorite(req: any, key: string): Promise<TemplateFavoriteEntity>;
    removeFavorite(req: any, key: string): Promise<any>;
    upsertCustomTemplate(req: any, key: string, body: Partial<TemplateEntity>): Promise<TemplateEntity>;
    removeCustomTemplate(req: any, key: string): Promise<void>;
    listVersions(req: any, id: string): Promise<import("./document-version.entity").DocumentVersionEntity[]>;
    restoreVersion(req: any, id: string, versionId: string): Promise<import("./document.entity").DocumentEntity>;
    archive(req: any, id: string): Promise<import("./document.entity").DocumentEntity>;
    unarchive(req: any, id: string): Promise<import("./document.entity").DocumentEntity>;
    duplicate(req: any, id: string): Promise<import("./document.entity").DocumentEntity>;
    previewTemplate(req: any, body: {
        documentId?: string;
        templateKey?: string;
        body?: string;
        html?: string | null;
        contentOverride?: string;
    }): Promise<{
        html: string;
        warnings: string[];
    }>;
    exportTemplatePdf(req: any, res: Response, body: {
        templateKey?: string;
        body?: string;
        html?: string | null;
        contentOverride?: string;
    }): Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
