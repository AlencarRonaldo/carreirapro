import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export interface JobAnalysisInput {
    url?: string;
    description?: string;
}
export interface JobAnalysisResult {
    id: string;
    company: string;
    title: string;
    requiredSkills: string[];
    responsibilities: string[];
    keywords: string[];
    compatibilityScore?: number;
    suggestions?: string[];
}
export declare class JobsService {
    private readonly http;
    private readonly config;
    private readonly openaiApiKey;
    private readonly PT_STOPWORDS;
    constructor(http: HttpService, config: ConfigService);
    private isOllama;
    private getModel;
    private normalizeUrl;
    private stripHtml;
    private fetchUrlText;
    private normalize;
    private extractSection;
    private extractKeywords;
    private tryGuessCompany;
    private basicExtract;
    analyzeJob(input: JobAnalysisInput): Promise<JobAnalysisResult>;
    scoreProfileMatch(profileData: any, analysis: JobAnalysisResult): Promise<any>;
}
