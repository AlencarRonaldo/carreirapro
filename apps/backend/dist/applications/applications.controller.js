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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const applications_service_1 = require("./applications.service");
const class_validator_1 = require("class-validator");
class CreateApplicationDto {
    company;
    title;
    jobUrl;
    notes;
    status;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "jobUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['saved', 'applied', 'interview', 'offer', 'rejected']),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "status", void 0);
class UpdateApplicationDto {
    company;
    title;
    jobUrl;
    notes;
    status;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "jobUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['saved', 'applied', 'interview', 'offer', 'rejected']),
    __metadata("design:type", String)
], UpdateApplicationDto.prototype, "status", void 0);
let ApplicationsController = class ApplicationsController {
    apps;
    constructor(apps) {
        this.apps = apps;
    }
    list(req, status) {
        return this.apps.list(req.user.sub, status);
    }
    create(req, body) {
        return this.apps.create(req.user.sub, body);
    }
    update(req, id, body) {
        return this.apps.update(req.user.sub, id, body);
    }
    remove(req, id) {
        return this.apps.remove(req.user.sub, id);
    }
    metrics(req) {
        return this.apps.metrics(req.user.sub);
    }
    async exportCsv(req, res, status) {
        const list = await this.apps.list(req.user.sub, status);
        const header = [
            'company',
            'title',
            'jobUrl',
            'status',
            'createdAt',
            'updatedAt',
        ];
        const rows = list.map((i) => [
            i.company,
            i.title,
            i.jobUrl ?? '',
            i.status,
            i.createdAt.toISOString(),
            i.updatedAt.toISOString(),
        ]);
        const csv = [
            header.join(','),
            ...rows.map((r) => r
                .map((v) => String(v).replaceAll('"', '""'))
                .map((v) => (/[,\n"]/.test(v) ? `"${v}"` : v))
                .join(',')),
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
        res.end('\uFEFF' + csv);
    }
    async exportPdf(req, res, status) {
        const list = await this.apps.list(req.user.sub, status);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="applications.pdf"');
        const PDFDocument = (await import('pdfkit')).default;
        const pdf = new PDFDocument({ size: 'A4', margin: 36 });
        pdf.pipe(res);
        pdf.fontSize(16).text('Relatório de Aplicações', { underline: true });
        pdf.moveDown();
        const header = ['Empresa', 'Título', 'Status', 'URL'];
        const colWidths = [160, 160, 80, 160];
        function drawRow(values, bold = false) {
            const opts = { width: colWidths[0], continued: true };
            pdf.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
            pdf.text(values[0] ?? '', { width: colWidths[0], continued: true });
            pdf.text(values[1] ?? '', { width: colWidths[1], continued: true });
            pdf.text(values[2] ?? '', { width: colWidths[2], continued: true });
            pdf.text(values[3] ?? '', { width: colWidths[3] });
        }
        drawRow(header, true);
        pdf
            .moveTo(pdf.x, pdf.y)
            .lineTo(550, pdf.y)
            .strokeColor('#aaa')
            .stroke()
            .moveDown(0.3);
        for (const i of list) {
            drawRow([i.company, i.title, i.status, i.jobUrl ?? '']);
            pdf.moveDown(0.2);
        }
        pdf.end();
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('metrics/summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "metrics", null);
__decorate([
    (0, common_1.Get)('export.csv'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('export.pdf'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "exportPdf", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map