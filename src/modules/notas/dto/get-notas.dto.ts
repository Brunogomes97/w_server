import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

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
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order: string;

}
