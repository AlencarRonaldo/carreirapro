import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

class SuggestDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  role?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  context?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('suggest')
  async suggest(@Body() body: SuggestDto) {
    const suggestions = await this.ai.suggestSentences(body);
    return { suggestions };
  }
}


