import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import type { ApplicationStatus } from './applications.entity';
import type { Response } from 'express';

class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  company!: string;
  @IsString()
  @MaxLength(255)
  title!: string;
  @IsOptional()
  @IsUrl()
  jobUrl?: string;
  @IsOptional()
  @IsString()
  notes?: string;
  @IsOptional()
  @IsIn(['saved', 'applied', 'interview', 'offer', 'rejected'])
  status?: ApplicationStatus;
}

class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
  @IsOptional()
  @IsUrl()
  jobUrl?: string;
  @IsOptional()
  @IsString()
  notes?: string;
  @IsOptional()
  @IsIn(['saved', 'applied', 'interview', 'offer', 'rejected'])
  status?: ApplicationStatus;
}

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly apps: ApplicationsService) {}

  @Get()
  list(@Req() req: any, @Query('status') status?: ApplicationStatus) {
    return this.apps.list(req.user.sub, status);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateApplicationDto) {
    return this.apps.create(req.user.sub, body);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateApplicationDto,
  ) {
    return this.apps.update(req.user.sub, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.apps.remove(req.user.sub, id);
  }

  @Get('metrics/summary')
  metrics(@Req() req: any) {
    return this.apps.metrics(req.user.sub);
  }

  @Get('export.csv')
  async exportCsv(
    @Req() req: any,
    @Res() res: Response,
    @Query('status') status?: ApplicationStatus,
  ) {
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
      ...rows.map((r) =>
        r
          .map((v) => String(v).replaceAll('"', '""'))
          .map((v) => (/[,\n"]/.test(v) ? `"${v}"` : v))
          .join(','),
      ),
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="applications.csv"',
    );
    res.end('\uFEFF' + csv);
  }

  @Get('export.pdf')
  async exportPdf(
    @Req() req: any,
    @Res() res: Response,
    @Query('status') status?: ApplicationStatus,
  ) {
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
    function drawRow(values: string[], bold = false) {
      const opts = { width: colWidths[0], continued: true } as any;
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
}
