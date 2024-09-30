import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  search?: string;
}
