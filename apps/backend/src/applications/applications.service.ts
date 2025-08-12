import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEntity, ApplicationStatus } from './applications.entity';

@Injectable()
export class ApplicationsService {
  constructor(@InjectRepository(ApplicationEntity) private readonly repo: Repository<ApplicationEntity>) {}

  list(userId: string, status?: ApplicationStatus) {
    return this.repo.find({ where: { userId, ...(status ? { status } : {}) }, order: { updatedAt: 'DESC' } });
  }

  async create(userId: string, data: { company: string; title: string; jobUrl?: string | null; notes?: string | null; status?: ApplicationStatus; meta?: any }) {
    const app = this.repo.create({ userId, company: data.company, title: data.title, jobUrl: data.jobUrl ?? null, notes: data.notes ?? null, status: data.status ?? 'saved', meta: data.meta ?? null });
    return this.repo.save(app);
  }

  async update(userId: string, id: string, data: Partial<{ company: string; title: string; jobUrl: string | null; notes: string | null; status: ApplicationStatus; meta: any }>) {
    const app = await this.repo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('Aplicação não encontrada');
    Object.assign(app, data);
    return this.repo.save(app);
  }

  async remove(userId: string, id: string) {
    const app = await this.repo.findOne({ where: { id, userId } });
    if (!app) return;
    await this.repo.remove(app);
  }

  async metrics(userId: string) {
    const rows = await this.repo
      .createQueryBuilder('a')
      .select('a.status', 'status')
      .addSelect('COUNT(1)', 'count')
      .where('a.userId = :userId', { userId })
      .groupBy('a.status')
      .getRawMany<{ status: ApplicationStatus; count: string }>();
    const base: Record<ApplicationStatus, number> = {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    for (const r of rows) base[r.status] = Number(r.count) || 0;
    const total = Object.values(base).reduce((a, b) => a + b, 0);
    return { ...base, total };
  }
}


