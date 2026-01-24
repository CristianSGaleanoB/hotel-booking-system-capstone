import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Room, RoomSchema } from '../rooms/entities/room.entity';
import { Hotel, HotelSchema } from '../hotels/entities/hotel.entity';
import { Booking, BookingSchema } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
