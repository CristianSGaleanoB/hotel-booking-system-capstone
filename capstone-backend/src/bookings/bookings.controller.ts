import { Controller, Post, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('summary')
  @UseGuards(JwtAuthGuard)
  async getSummary(@Body() createSummaryDto: CreateSummaryDto) {
    return this.bookingsService.getSummary(createSummaryDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async confirmBooking(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    const userId = req.user.sub || req.user.userId;
    return this.bookingsService.confirmBooking(createBookingDto, userId);
  }
}
