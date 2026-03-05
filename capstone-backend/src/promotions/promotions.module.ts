import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FestiveCalendar,
  FestiveCalendarSchema,
} from './entities/festive-calendar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FestiveCalendar.name, schema: FestiveCalendarSchema },
    ]),
  ],
  providers: [PromotionsService],
  exports: [PromotionsService, MongooseModule],
})
export class PromotionsModule {}
