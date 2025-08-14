export declare class AiService {
    suggestSentences(input: {
        role?: string;
        achievements?: string[];
        context?: string;
    }): Promise<string[]>;
}
