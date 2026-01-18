import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HotelsModule } from '../hotels/hotels.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [HotelsModule, RoomsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
