import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from '../../hotels/entities/hotel.entity';

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SUITE = 'SUITE',
  DELUXE = 'DELUXE',
}

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotel: Hotel | Types.ObjectId;

  @Prop({ required: true })
  roomNumber: string;

  @Prop({ type: String, enum: RoomType, default: RoomType.SINGLE })
  type: RoomType;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
