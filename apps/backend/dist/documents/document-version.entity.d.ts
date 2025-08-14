import { DocumentEntity } from './document.entity';
export declare class DocumentVersionEntity {
    id: string;
    document: DocumentEntity;
    content: string;
    createdAt: Date;
}
