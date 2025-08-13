import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoverLettersService } from './cover-letters.service';
import { GenerateCoverLetterDto, UpdateCoverLetterDto } from './dto';
import { RequireProPlanGuard } from '../common/guards/plan.guard';

@UseGuards(JwtAuthGuard)
@Controller('cover-letters')
export class CoverLettersController {
  constructor(private readonly service: CoverLettersService) {}

  @Post('generate')
  @UseGuards(RequireProPlanGuard)
  generate(@Req() req: any, @Body() body: GenerateCoverLetterDto) {
    return this.service.generateCoverLetter(req.user.sub, body);
  }

  @Post('variations')
  @UseGuards(RequireProPlanGuard)
  generateVariations(@Req() req: any, @Body() body: GenerateCoverLetterDto) {
    return this.service.generateCoverLetterVariations(req.user.sub, body);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateCoverLetterDto,
  ) {
    return this.service.updateCoverLetter(req.user.sub, id, body);
  }

  @Get('templates')
  templates() {
    return this.service.getCoverLetterTemplates();
  }
}
