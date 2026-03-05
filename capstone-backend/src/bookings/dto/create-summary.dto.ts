import {
  IsArray,
  IsDateString,
  IsInt,
  IsMongoId,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAfter } from 'src/common/decorators/is-after.decorator';

export class CreateSummaryDto {
  @ApiProperty({ description: 'The check-in date', example: '2026-05-10' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'The check-out date', example: '2026-05-15' })
  @IsDateString()
  @IsAfter('startDate', {
    message: 'The end date must be after the start date',
  })
  endDate: string;

  @ApiProperty({
    description: 'List of room IDs to book',
    example: ['678fc79a8501168171f6507b'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  roomIds: string[];

  @ApiProperty({ description: 'Number of adults', example: 2 })
  @IsInt()
  @Min(1)
  adultCount: number;

  @ApiPropertyOptional({ description: 'Number of children', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount?: number;
}
