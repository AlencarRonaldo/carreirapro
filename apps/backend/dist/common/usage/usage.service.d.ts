import { Repository } from 'typeorm';
import { UsageCounterEntity } from './usage.entity';
export declare class UsageService {
    private readonly repo;
    constructor(repo: Repository<UsageCounterEntity>);
    getCount(userId: string, metric: UsageCounterEntity['metric'], period?: string): Promise<number>;
    increment(userId: string, metric: UsageCounterEntity['metric'], delta?: number, period?: string): Promise<number>;
}
