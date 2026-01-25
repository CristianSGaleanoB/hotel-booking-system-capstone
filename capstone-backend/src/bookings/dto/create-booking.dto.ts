import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsArray()
  @IsMongoId({ each: true })
  roomIds: string[];

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
