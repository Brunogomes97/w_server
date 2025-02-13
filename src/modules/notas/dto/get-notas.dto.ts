import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class FindAllQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  offset: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  limit: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsDateString()
  started_at: Date;

  @IsOptional()
  @IsString()
  search: string;
}
