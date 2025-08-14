export declare class UsageCounterEntity {
    id: string;
    userId: string;
    metric: 'job_analyses' | 'ai_requests' | 'exports';
    period: string;
    count: number;
    createdAt: Date;
}
