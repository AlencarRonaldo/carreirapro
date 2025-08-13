import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { ProfileEntity } from './profile.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly repo: Repository<SkillEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profiles: Repository<ProfileEntity>,
  ) {}

  async list(userId: string): Promise<SkillEntity[]> {
    return this.repo.find({
      where: { profile: { id: userId } },
      relations: { profile: true },
    });
  }

  async create(
    userId: string,
    data: Partial<SkillEntity>,
  ): Promise<SkillEntity> {
    const profile = await this.profiles.findOne({ where: { id: userId } });
    const entity = this.repo.create({
      ...data,
      profile: profile ?? ({ id: userId } as any),
    });
    return this.repo.save(entity);
  }

  async update(
    userId: string,
    id: string,
    data: Partial<SkillEntity>,
  ): Promise<SkillEntity> {
    const entity = await this.repo.findOne({
      where: { id, profile: { id: userId } },
      relations: { profile: true },
    });
    if (!entity) throw new NotFoundException('Skill não encontrada');
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(userId: string, id: string): Promise<void> {
    const entity = await this.repo.findOne({
      where: { id, profile: { id: userId } },
      relations: { profile: true },
    });
    if (!entity) throw new NotFoundException('Skill não encontrada');
    await this.repo.remove(entity);
  }
}
