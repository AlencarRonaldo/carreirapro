export interface ParsedResume {
    fullName?: string;
    email?: string;
    phone?: string;
    headline?: string;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    maritalStatus?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    experiences?: Array<{
        title: string;
        company: string;
        startDate?: string | null;
        endDate?: string | null;
        description?: string | null;
    }>;
    education?: Array<{
        institution: string;
        degree: string;
        startDate?: string | null;
        endDate?: string | null;
    }>;
    skills?: string[];
}
export declare class ResumeParserService {
    parseResumeText(text: string): ParsedResume;
    private parseExperiences;
    private parseEducation;
    private parseSkills;
}
