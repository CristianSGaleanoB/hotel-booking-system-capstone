import { IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean, IsMongoId } from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  hotel: string;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;
}
