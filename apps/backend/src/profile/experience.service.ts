import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceEntity } from './experience.entity';
import { ProfileEntity } from './profile.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperienceEntity) private readonly repo: Repository<ExperienceEntity>,
    @InjectRepository(ProfileEntity) private readonly profiles: Repository<ProfileEntity>,
  ) {}

  async list(userId: string): Promise<ExperienceEntity[]> {
    return this.repo.find({ where: { profile: { id: userId } }, relations: { profile: true } });
  }

  async create(userId: string, data: Partial<ExperienceEntity>): Promise<ExperienceEntity> {
    const profile = await this.profiles.findOne({ where: { id: userId } });
    const entity = this.repo.create({ ...data, profile: profile ?? ({ id: userId } as any) });
    return this.repo.save(entity);
  }

  async update(userId: string, id: string, data: Partial<ExperienceEntity>): Promise<ExperienceEntity> {
    const entity = await this.repo.findOne({ where: { id, profile: { id: userId } }, relations: { profile: true } });
    if (!entity) throw new NotFoundException('Experiência não encontrada');
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(userId: string, id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id, profile: { id: userId } }, relations: { profile: true } });
    if (!entity) throw new NotFoundException('Experiência não encontrada');
    await this.repo.remove(entity);
  }
}


