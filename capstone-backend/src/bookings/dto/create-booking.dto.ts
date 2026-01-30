import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'The check-in date', example: '2026-05-10' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'The check-out date', example: '2026-05-15' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'List of room IDs to book', example: ['678fc79a8501168171f6507b'] })
  @IsArray()
  @IsMongoId({ each: true })
  roomIds: string[];

  @ApiProperty({ description: 'Number of adults', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  adultCount: number;

  @ApiProperty({ description: 'Number of children', example: 0 })
  @IsNumber()
  childCount: number;

  @ApiProperty({ description: 'Total price validated by the server summary', example: 240 })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
