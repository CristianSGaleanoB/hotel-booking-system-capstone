import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  Param,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('summary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a booking summary with price calculation and promotions',
  })
  @ApiResponse({ status: 200, description: 'Summary calculated successfully' })
  async getSummary(@Body() createSummaryDto: CreateSummaryDto) {
    return this.bookingsService.getSummary(createSummaryDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiResponse({ status: 201, description: 'Booking confirmed successfully' })
  async confirmBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req,
  ) {
    const userId = req.user.sub || req.user.userId;
    return this.bookingsService.confirmBooking(createBookingDto, userId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Cancellation not allowed (e.g. less than 3 days before start)',
  })
  async cancelBooking(@Param('id') bookingId: string, @Request() req) {
    const userId = req.user.sub || req.user.userId;
    return this.bookingsService.cancelBooking(bookingId, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user booking history' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async getUserBookings(@Request() req) {
    const userId = req.user.sub || req.user.userId;
    return this.bookingsService.getUserBookings(userId);
  }
}
