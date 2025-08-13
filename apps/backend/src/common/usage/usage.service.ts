import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsageCounterEntity } from './usage.entity';

function currentPeriod(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

@Injectable()
export class UsageService {
  constructor(
    @InjectRepository(UsageCounterEntity)
    private readonly repo: Repository<UsageCounterEntity>,
  ) {}

  async getCount(
    userId: string,
    metric: UsageCounterEntity['metric'],
    period = currentPeriod(),
  ): Promise<number> {
    const row = await this.repo.findOne({ where: { userId, metric, period } });
    return row?.count ?? 0;
  }

  async increment(
    userId: string,
    metric: UsageCounterEntity['metric'],
    delta = 1,
    period = currentPeriod(),
  ): Promise<number> {
    let row = await this.repo.findOne({ where: { userId, metric, period } });
    if (!row) row = this.repo.create({ userId, metric, period, count: 0 });
    row.count += delta;
    await this.repo.save(row);
    return row.count;
  }
}
