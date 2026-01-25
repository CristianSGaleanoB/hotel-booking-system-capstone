import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('summary')
  @UseGuards(JwtAuthGuard)
  async getSummary(@Body() createSummaryDto: CreateSummaryDto) {
    return this.bookingsService.getSummary(createSummaryDto);
  }
}
