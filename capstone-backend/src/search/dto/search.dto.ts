import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  peopleCount: number;

  @IsString()
  city: string;

  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}
