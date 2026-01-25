import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './entities/booking.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  providers: [BookingsService],
  exports: [MongooseModule, BookingsService],
})
export class BookingsModule {}
