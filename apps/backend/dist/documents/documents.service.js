"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./document.entity");
const document_version_entity_1 = require("./document-version.entity");
const template_entity_1 = require("./template.entity");
let DocumentsService = class DocumentsService {
    repo;
    versions;
    templates;
    constructor(repo, versions, templates) {
        this.repo = repo;
        this.versions = versions;
        this.templates = templates;
    }
    list(ownerId, includeArchived = false) {
        return this.repo.find({
            where: { ownerId, ...(includeArchived ? {} : { isArchived: false }) },
            order: { updatedAt: 'DESC' },
        });
    }
    async create(ownerId, title) {
        const doc = this.repo.create({ ownerId, title });
        return this.repo.save(doc);
    }
    async rename(ownerId, id, title) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        doc.title = title;
        return this.repo.save(doc);
    }
    async remove(ownerId, id) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        await this.repo.remove(doc);
    }
    async archive(ownerId, id, archived) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        doc.isArchived = archived;
        return this.repo.save(doc);
    }
    async duplicate(ownerId, id) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        const copy = this.repo.create({
            ownerId,
            title: `${doc.title} (cópia)`,
            content: doc.content,
            status: doc.status,
        });
        return this.repo.save(copy);
    }
    async get(ownerId, id) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        return doc;
    }
    async updateContent(ownerId, id, content) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        await this.versions.save(this.versions.create({ document: doc, content: doc.content ?? '' }));
        doc.content = content;
        return this.repo.save(doc);
    }
    async updateStatus(ownerId, id, status) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        doc.status = status;
        return this.repo.save(doc);
    }
    async listVersions(ownerId, id) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        return this.versions.find({
            where: { document: { id: doc.id } },
            order: { createdAt: 'DESC' },
        });
    }
    async restoreVersion(ownerId, id, versionId) {
        const doc = await this.repo.findOne({ where: { id, ownerId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        const version = await this.versions.findOne({
            where: { id: versionId, document: { id: doc.id } },
        });
        if (!version)
            throw new common_1.NotFoundException('Versão não encontrada');
        await this.versions.save(this.versions.create({ document: doc, content: doc.content ?? '' }));
        doc.content = version.content;
        return this.repo.save(doc);
    }
    async findTemplate(ownerId, key) {
        return this.templates.findOne({ where: { ownerId, key } });
    }
    async listTemplates(ownerId) {
        return this.templates.find({
            where: { ownerId },
            order: { updatedAt: 'DESC' },
        });
    }
    async upsertTemplate(ownerId, data) {
        let tpl = await this.templates.findOne({
            where: { ownerId, key: data.key },
        });
        if (!tpl)
            tpl = this.templates.create({
                ownerId,
                key: data.key,
                name: data.name || data.key,
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
    async removeTemplate(ownerId, key) {
        const tpl = await this.templates.findOne({ where: { ownerId, key } });
        if (!tpl)
            return;
        await this.templates.remove(tpl);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.DocumentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(document_version_entity_1.DocumentVersionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(template_entity_1.TemplateEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map