import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CoverLetterEntity } from './cover-letter.entity';
import { GenerateCoverLetterDto, UpdateCoverLetterDto } from './dto';
export declare class CoverLettersService {
    private readonly coverLetters;
    private readonly config;
    private readonly http;
    private readonly openaiApiKey;
    constructor(coverLetters: Repository<CoverLetterEntity>, config: ConfigService, http: HttpService);
    private isOllama;
    private getModel;
    private stripJsonFences;
    private chatToText;
    generateCoverLetter(userId: string, generateDto: GenerateCoverLetterDto): Promise<{
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
    private buildCoverLetterPrompt;
    private analyzeCoverLetterQuality;
    updateCoverLetter(userId: string, letterId: string, updateDto: UpdateCoverLetterDto): Promise<CoverLetterEntity>;
    getCoverLetterTemplates(): Promise<{
        id: string;
        name: string;
        description: string;
        structure: string[];
    }[]>;
    generateCoverLetterVariations(userId: string, generateDto: GenerateCoverLetterDto): Promise<{
        variations: any[];
        recommendation: any;
    }>;
}
