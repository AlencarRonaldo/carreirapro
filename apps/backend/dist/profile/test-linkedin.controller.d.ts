import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ProfileService } from './profile.service';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';
interface TestResult {
    step: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    data?: any;
    timing?: number;
}
interface TestResponse {
    success: boolean;
    results: TestResult[];
    summary: {
        passed: number;
        failed: number;
        warnings: number;
        totalTime: number;
    };
}
export declare class TestLinkedInController {
    private readonly profileService;
    private readonly config;
    private readonly http;
    constructor(profileService: ProfileService, config: ConfigService, http: HttpService);
    validateConfig(): Promise<TestResponse>;
    validateInput(body: ImportLinkedinDto): Promise<TestResponse>;
    testWithDebugLogs(body: ImportLinkedinDto & {
        testMode?: 'full' | 'apify-only' | 'mapping-only';
    }): Promise<TestResponse>;
    runFullTest(body: ImportLinkedinDto & {
        testMode?: 'full' | 'apify-only' | 'mapping-only';
    }): Promise<TestResponse>;
    inspectDatasetFlow(body: ImportLinkedinDto): Promise<any>;
    inspectRawData(body: ImportLinkedinDto): Promise<any>;
    verifyPersistence(body: {
        userId?: string;
    }): Promise<any>;
    testConfigurations(body: ImportLinkedinDto): Promise<TestResponse>;
}
export {};
