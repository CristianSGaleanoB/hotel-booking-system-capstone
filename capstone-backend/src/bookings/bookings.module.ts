import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './entities/booking.entity';
import { Room, RoomSchema } from '../rooms/entities/room.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
    PromotionsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [MongooseModule, BookingsService],
})
export class BookingsModule {}
