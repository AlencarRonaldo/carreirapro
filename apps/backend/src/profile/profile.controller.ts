import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import type { Profile } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  @Get()
  async getMine(@Req() req: any): Promise<Profile> {
    const userId: string = req.user?.sub;
    return this.profiles.getOrCreate(userId);
  }

  @Put()
  async updateMine(@Req() req: any, @Body() body: UpdateProfileDto): Promise<Profile> {
    const userId: string = req.user?.sub;
    return this.profiles.update(userId, body);
  }

  @Post('import/linkedin')
  async importFromLinkedin(@Req() req: any, @Body() body: ImportLinkedinDto): Promise<Profile> {
    const userId: string = req.user?.sub;
    return this.profiles.importFromLinkedin(userId, body);
  }
}


