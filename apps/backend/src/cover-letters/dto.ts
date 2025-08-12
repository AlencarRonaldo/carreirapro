import { IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateCoverLetterDto {
  @IsObject()
  profileData!: any;

  @IsObject()
  jobAnalysis!: any;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  language?: string;
}

export class UpdateCoverLetterDto {
  @IsString()
  content!: string;
}



