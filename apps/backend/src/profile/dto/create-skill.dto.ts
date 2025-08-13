import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  level!: number;
}
