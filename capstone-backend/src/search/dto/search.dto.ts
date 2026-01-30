import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ description: 'The check-in date', example: '2026-05-10' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'The check-out date', example: '2026-05-15' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Total number of guests', example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  peopleCount: number;

  @ApiProperty({ description: 'City to search in', example: 'Funza' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ description: 'Minimum room price', example: 50 })
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum room price', example: 500 })
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}
