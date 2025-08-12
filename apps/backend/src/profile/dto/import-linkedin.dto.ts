import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ImportLinkedinDto {
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    if (!v) return v;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'url deve ser uma URL http/https' })
  url!: string;

  @IsOptional()
  @IsBoolean()
  overwrite?: boolean;
}


