import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from '../../hotels/entities/hotel.entity';

export enum RoomType {
  SIMPLE_SINGLE = 'SIMPLE_SINGLE',
  SIMPLE_DOUBLE = 'SIMPLE_DOUBLE',
  SIMPLE_TRIPLE = 'SIMPLE_TRIPLE',
  SUITE_DOUBLE = 'SUITE_DOUBLE',
  SUITE_FAMILY = 'SUITE_FAMILY',
}

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotel: Hotel | Types.ObjectId;

  @Prop({ required: true })
  roomNumber: string;

  @Prop({ type: String, enum: RoomType, default: RoomType.SIMPLE_SINGLE })
  type: RoomType;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
