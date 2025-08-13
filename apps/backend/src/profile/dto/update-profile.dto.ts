import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationState?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    if (v.length === 0) return undefined;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  @ValidateIf(
    (o) => typeof o.linkedin === 'string' && o.linkedin.trim().length > 0,
  )
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'linkedin deve ser uma URL http/https' },
  )
  linkedin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    if (v.length === 0) return undefined;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  @ValidateIf((o) => typeof o.github === 'string' && o.github.trim().length > 0)
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'github deve ser uma URL http/https' },
  )
  github?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    if (v.length === 0) return undefined;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  @ValidateIf(
    (o) => typeof o.website === 'string' && o.website.trim().length > 0,
  )
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'website deve ser uma URL http/https' },
  )
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  maritalStatus?: string;
}
