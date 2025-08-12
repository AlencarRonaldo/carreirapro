import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { ImportLinkedinDto } from './dto/import-linkedin.dto';

export interface Profile {
  id: string;
  fullName: string;
  headline: string;
}

@Injectable()
export class ProfileService {
  private readonly store = new Map<string, Profile>();

  constructor(
    @InjectRepository(ProfileEntity) private readonly repo: Repository<ProfileEntity>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getOrCreate(userId: string): Promise<Profile> {
    if (this.repo) {
      const found = await this.repo.findOne({ where: { id: userId } });
      if (found) return found as unknown as Profile;
      // Criar perfil vazio (sem placeholders) para não marcar passo como completo
      const created = this.repo.create({ id: userId });
      const saved = await this.repo.save(created);
      return saved as unknown as Profile;
    }
    if (!this.store.has(userId)) {
      // Fallback em memória sem placeholders
      this.store.set(userId, {
        id: userId,
        fullName: '',
        headline: '',
      });
    }
    return this.store.get(userId)!;
  }

  async update(userId: string, data: Partial<Profile>): Promise<Profile> {
    if (this.repo) {
      const current = await this.getOrCreate(userId);
      const merged = this.repo.merge(current as any, data);
      const saved = await this.repo.save(merged as any);
      return saved;
    }
    const current = await this.getOrCreate(userId);
    const updated: Profile = { ...current, ...data };
    this.store.set(userId, updated);
    return updated;
  }

  async importFromLinkedin(userId: string, input: ImportLinkedinDto): Promise<Profile> {
    const apiKey = this.config.get<string>('PROXYCURL_API_KEY');
    if (!apiKey) {
      // Sem API, não falha: apenas retorna o perfil atual
      return this.getOrCreate(userId);
    }
    // Proxycurl Person API
    const endpoint = 'https://nubela.co/proxycurl/api/v2/linkedin';
    const url = `${endpoint}?url=${encodeURIComponent(input.url)}&use_cache=if-present`;
    const resp = await firstValueFrom(
      this.http.get(url, { headers: { Authorization: `Bearer ${apiKey}` } }),
    );
    const data = resp.data ?? {};
    // Mapear campos básicos
    const fullName: string = data.full_name || data.first_name && data.last_name ? `${data.first_name} ${data.last_name}`.trim() : '';
    const headline: string = data.headline || '';
    const city: string = data.city || data.location || '';
    const country: string = data.country || '';
    const website: string = Array.isArray(data.website) ? (data.website[0]?.url ?? '') : (data.website_url || '');
    const email: string = data.email || '';
    const linkedin: string = input.url;

    const current = await this.getOrCreate(userId);
    const merged: Partial<ProfileEntity> = {
      fullName: input.overwrite ? (fullName || current.fullName) : (current.fullName || fullName),
      headline: input.overwrite ? (headline || current.headline) : (current.headline || headline),
      locationCity: input.overwrite ? (city || (current as any).locationCity) : ((current as any).locationCity || city),
      locationState: (current as any).locationState, // LinkedIn raramente provê
      locationCountry: input.overwrite ? (country || (current as any).locationCountry) : ((current as any).locationCountry || country),
      linkedin,
      website: input.overwrite ? (website || (current as any).website) : ((current as any).website || website),
      email: input.overwrite ? (email || (current as any).email) : ((current as any).email || email),
    } as any;

    if (this.repo) {
      const entity = await this.repo.findOne({ where: { id: userId } });
      const updated = this.repo.merge(entity ?? ({ id: userId } as any), merged);
      const saved = await this.repo.save(updated);
      return saved;
    }
    // fallback memória
    const updatedMem: Profile = { ...current, ...(merged as any) };
    this.store.set(userId, updatedMem);
    return updatedMem;
  }
}


