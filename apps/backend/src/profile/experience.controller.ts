import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile/experiences')
export class ExperienceController {
  constructor(private readonly service: ExperienceService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.list(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateExperienceDto) {
    return this.service.create(req.user.sub, body);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateExperienceDto) {
    return this.service.update(req.user.sub, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.sub, id);
  }
}


