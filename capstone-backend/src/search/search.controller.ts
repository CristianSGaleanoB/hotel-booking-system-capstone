import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query(new ValidationPipe({ transform: true })) searchDto: SearchDto) {
    return this.searchService.findOptions(searchDto);
  }
}
