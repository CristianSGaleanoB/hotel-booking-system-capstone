import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatus } from 'src/enums/booking-status.enum';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Room' }], required: true })
  rooms: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotel: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
