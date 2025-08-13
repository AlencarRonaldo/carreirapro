import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import type { Profile } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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
  async updateMine(
    @Req() req: any,
    @Body() body: UpdateProfileDto,
  ): Promise<Profile> {
    const userId: string = req.user?.sub;
    return this.profiles.update(userId, body);
  }

  @Post('import/linkedin')
  async importFromLinkedin(
    @Req() req: any,
    @Body() body: ImportLinkedinDto,
  ): Promise<Profile> {
    const userId: string = req.user?.sub;
    return this.profiles.importFromLinkedin(userId, body);
  }

  @Post('import/resume')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async importFromResume(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('overwrite') overwrite?: string,
  ): Promise<Profile> {
    const userId: string = req.user?.sub;
    const ow = String(overwrite ?? 'true').toLowerCase() !== 'false';
    return this.profiles.importFromResume(userId, file, ow);
  }

  // Aliases para facilitar: /profile/import/pdf e /profile/import/cv
  @Post('import/pdf')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async importFromPdf(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('overwrite') overwrite?: string,
  ): Promise<Profile> {
    const userId: string = req.user?.sub;
    const ow = String(overwrite ?? 'true').toLowerCase() !== 'false';
    return this.profiles.importFromResume(userId, file, ow);
  }

  @Post('import/cv')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async importFromCv(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('overwrite') overwrite?: string,
  ): Promise<Profile> {
    const userId: string = req.user?.sub;
    const ow = String(overwrite ?? 'true').toLowerCase() !== 'false';
    return this.profiles.importFromResume(userId, file, ow);
  }

  // Endpoint temporário para debug - SEM autenticação
  @Post('debug/linkedin-import')
  async debugLinkedInImport(@Body() body: ImportLinkedinDto): Promise<any> {
    console.log('🔧 DEBUG ENDPOINT - LinkedIn Import Test');
    console.log('🔧 DEBUG ENDPOINT - Body:', JSON.stringify(body, null, 2));
    try {
      const testUserId = 'test-debug-user-id';
      const result = await this.profiles.importFromLinkedin(testUserId, body);
      console.log('🔧 DEBUG ENDPOINT - Success:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('🔧 DEBUG ENDPOINT - Error:', error);
      return { success: false, error: error.message };
    }
  }
}
