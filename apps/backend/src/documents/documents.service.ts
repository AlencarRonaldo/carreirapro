import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentVersionEntity } from './document-version.entity';
import { TemplateEntity } from './template.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repo: Repository<DocumentEntity>,
    @InjectRepository(DocumentVersionEntity)
    private readonly versions: Repository<DocumentVersionEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templates: Repository<TemplateEntity>,
  ) {}

  list(ownerId: string, includeArchived = false) {
    return this.repo.find({
      where: { ownerId, ...(includeArchived ? {} : { isArchived: false }) },
      order: { updatedAt: 'DESC' },
    });
  }

  async create(ownerId: string, title: string) {
    const doc = this.repo.create({ ownerId, title });
    return this.repo.save(doc);
  }

  async rename(ownerId: string, id: string, title: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    doc.title = title;
    return this.repo.save(doc);
  }

  async remove(ownerId: string, id: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    await this.repo.remove(doc);
  }

  async archive(ownerId: string, id: string, archived: boolean) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    doc.isArchived = archived;
    return this.repo.save(doc);
  }

  async duplicate(ownerId: string, id: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    const copy = this.repo.create({
      ownerId,
      title: `${doc.title} (cópia)`,
      content: doc.content,
      status: doc.status,
    });
    return this.repo.save(copy);
  }

  async get(ownerId: string, id: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return doc;
  }

  async updateContent(ownerId: string, id: string, content: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    // save version before updating
    await this.versions.save(
      this.versions.create({ document: doc, content: doc.content ?? '' }),
    );
    doc.content = content;
    return this.repo.save(doc);
  }

  async updateStatus(
    ownerId: string,
    id: string,
    status: 'draft' | 'pending' | 'done',
  ) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    doc.status = status;
    return this.repo.save(doc);
  }

  async listVersions(ownerId: string, id: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return this.versions.find({
      where: { document: { id: doc.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async restoreVersion(ownerId: string, id: string, versionId: string) {
    const doc = await this.repo.findOne({ where: { id, ownerId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    const version = await this.versions.findOne({
      where: { id: versionId, document: { id: doc.id } },
    });
    if (!version) throw new NotFoundException('Versão não encontrada');
    await this.versions.save(
      this.versions.create({ document: doc, content: doc.content ?? '' }),
    );
    doc.content = version.content;
    return this.repo.save(doc);
  }

  async findTemplate(
    ownerId: string,
    key: string,
  ): Promise<TemplateEntity | null> {
    return this.templates.findOne({ where: { ownerId, key } });
  }

  async listTemplates(ownerId: string) {
    return this.templates.find({
      where: { ownerId },
      order: { updatedAt: 'DESC' },
    });
  }

  async upsertTemplate(ownerId: string, data: Partial<TemplateEntity>) {
    let tpl = await this.templates.findOne({
      where: { ownerId, key: data.key! },
    });
    if (!tpl)
      tpl = this.templates.create({
        ownerId,
        key: data.key!,
        name: data.name || data.key!,
        body: data.body || '',
        html: data.html ?? null,
      });
    else {
      tpl.name = data.name ?? tpl.name;
      tpl.body = data.body ?? tpl.body;
      tpl.html = typeof data.html === 'undefined' ? tpl.html : data.html;
    }
    return this.templates.save(tpl);
  }

  async removeTemplate(ownerId: string, key: string) {
    const tpl = await this.templates.findOne({ where: { ownerId, key } });
    if (!tpl) return;
    await this.templates.remove(tpl);
  }
}
