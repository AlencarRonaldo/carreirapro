import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile/skills')
export class SkillController {
  constructor(private readonly service: SkillService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.list(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateSkillDto) {
    return this.service.create(req.user.sub, body);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateSkillDto) {
    return this.service.update(req.user.sub, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.sub, id);
  }
}


