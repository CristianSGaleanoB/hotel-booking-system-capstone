import { IsArray, IsDateString, IsInt, IsMongoId, IsOptional, Min } from 'class-validator';

export class CreateSummaryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsMongoId({ each: true })
  roomIds: string[];

  @IsInt()
  @Min(1)
  adultCount: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  childCount?: number;
}
