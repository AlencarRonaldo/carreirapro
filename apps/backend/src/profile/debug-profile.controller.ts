import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ImportLinkedinDto } from './dto/import-linkedin.dto';

@Controller('debug/profile')
export class DebugProfileController {
  constructor(private readonly profiles: ProfileService) {}

  // Endpoint temporário para debug - SEM autenticação
  @Post('linkedin-import')
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
      return { 
        success: false, 
        error: error.message,
        stack: error.stack
      };
    }
  }
}