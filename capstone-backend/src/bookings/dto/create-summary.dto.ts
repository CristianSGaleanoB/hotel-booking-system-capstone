import { IsArray, IsDateString, IsInt, IsMongoId, IsOptional, Min } from 'class-validator';

export class CreateSummaryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsMongoId({ each: true })
  roomIds: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  peopleCount?: number;
}
