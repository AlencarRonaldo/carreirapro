import { AiService } from './ai.service';
declare class SuggestDto {
    role?: string;
    achievements?: string[];
    context?: string;
}
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    suggest(body: SuggestDto): Promise<{
        suggestions: string[];
    }>;
}
export {};
