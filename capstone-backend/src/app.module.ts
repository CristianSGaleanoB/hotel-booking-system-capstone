import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { SearchModule } from './search/search.module';

import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    UsersModule,
    HotelsModule,
    RoomsModule,
    BookingsModule,
    SearchModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
