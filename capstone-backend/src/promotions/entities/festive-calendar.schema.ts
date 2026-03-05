import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FestiveCalendar extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, min: 0, max: 100 })
  discountPercentage: number;
}

export const FestiveCalendarSchema =
  SchemaFactory.createForClass(FestiveCalendar);
