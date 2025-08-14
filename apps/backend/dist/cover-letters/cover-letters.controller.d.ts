import { CoverLettersService } from './cover-letters.service';
import { GenerateCoverLetterDto, UpdateCoverLetterDto } from './dto';
export declare class CoverLettersController {
    private readonly service;
    constructor(service: CoverLettersService);
    generate(req: any, body: GenerateCoverLetterDto): Promise<{
        qualityScore: any;
        suggestions: any;
        id: string;
        userId: string;
        user: import("../auth/user.entity").UserEntity;
        jobTitle: string;
        company: string;
        content: string;
        tone?: string | null;
        language: string;
        metadata?: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateVariations(req: any, body: GenerateCoverLetterDto): Promise<{
        variations: any[];
        recommendation: any;
    }>;
    update(req: any, id: string, body: UpdateCoverLetterDto): Promise<import("./cover-letter.entity").CoverLetterEntity>;
    templates(): Promise<{
        id: string;
        name: string;
        description: string;
        structure: string[];
    }[]>;
}
