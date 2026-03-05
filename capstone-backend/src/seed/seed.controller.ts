import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({
    summary:
      'Populate the database with initial data (Hotels, Rooms, Festive dates)',
  })
  @ApiResponse({ status: 201, description: 'Seeds executed successfully' })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
