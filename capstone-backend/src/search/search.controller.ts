import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Search for available room combinations based on criteria',
  })
  @ApiResponse({ status: 200, description: 'List of available options found' })
  async search(
    @Query(new ValidationPipe({ transform: true })) searchDto: SearchDto,
  ) {
    return this.searchService.findOptions(searchDto);
  }
}
