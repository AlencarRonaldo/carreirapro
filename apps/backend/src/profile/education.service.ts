import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationEntity } from './education.entity';
import { ProfileEntity } from './profile.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private readonly repo: Repository<EducationEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profiles: Repository<ProfileEntity>,
  ) {}

  async list(userId: string): Promise<EducationEntity[]> {
    return this.repo.find({
      where: { profile: { id: userId } },
      relations: { profile: true },
    });
  }

  async create(
    userId: string,
    data: Partial<EducationEntity>,
  ): Promise<EducationEntity> {
    let profile = await this.profiles.findOne({ where: { id: userId } });
    if (!profile) {
      // garante que o perfil exista para satisfazer a FK
      profile = await this.profiles.save(
        this.profiles.create({ id: userId, fullName: '', headline: '' }),
      );
    }
    const entity = this.repo.create({ ...data, profile });
    return this.repo.save(entity);
  }

  async update(
    userId: string,
    id: string,
    data: Partial<EducationEntity>,
  ): Promise<EducationEntity> {
    const entity = await this.repo.findOne({
      where: { id, profile: { id: userId } },
      relations: { profile: true },
    });
    if (!entity) throw new NotFoundException('Educação não encontrada');
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(userId: string, id: string): Promise<void> {
    const entity = await this.repo.findOne({
      where: { id, profile: { id: userId } },
      relations: { profile: true },
    });
    if (!entity) throw new NotFoundException('Educação não encontrada');
    await this.repo.remove(entity);
  }
}
