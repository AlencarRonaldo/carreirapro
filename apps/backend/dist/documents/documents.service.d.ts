import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentVersionEntity } from './document-version.entity';
import { TemplateEntity } from './template.entity';
export declare class DocumentsService {
    private readonly repo;
    private readonly versions;
    private readonly templates;
    constructor(repo: Repository<DocumentEntity>, versions: Repository<DocumentVersionEntity>, templates: Repository<TemplateEntity>);
    list(ownerId: string, includeArchived?: boolean): Promise<DocumentEntity[]>;
    create(ownerId: string, title: string): Promise<DocumentEntity>;
    rename(ownerId: string, id: string, title: string): Promise<DocumentEntity>;
    remove(ownerId: string, id: string): Promise<void>;
    archive(ownerId: string, id: string, archived: boolean): Promise<DocumentEntity>;
    duplicate(ownerId: string, id: string): Promise<DocumentEntity>;
    get(ownerId: string, id: string): Promise<DocumentEntity>;
    updateContent(ownerId: string, id: string, content: string): Promise<DocumentEntity>;
    updateStatus(ownerId: string, id: string, status: 'draft' | 'pending' | 'done'): Promise<DocumentEntity>;
    listVersions(ownerId: string, id: string): Promise<DocumentVersionEntity[]>;
    restoreVersion(ownerId: string, id: string, versionId: string): Promise<DocumentEntity>;
    findTemplate(ownerId: string, key: string): Promise<TemplateEntity | null>;
    listTemplates(ownerId: string): Promise<TemplateEntity[]>;
    upsertTemplate(ownerId: string, data: Partial<TemplateEntity>): Promise<TemplateEntity>;
    removeTemplate(ownerId: string, key: string): Promise<void>;
}
