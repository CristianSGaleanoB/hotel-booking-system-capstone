import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
  ) {}

  async checkRoomAvailability(roomIds: string[], startDate: string, endDate: string): Promise<void> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    const overlappingBooking = await this.bookingModel.findOne({
      status: 'CONFIRMED',
      rooms: { $in: roomIds.map(id => new Types.ObjectId(id)) },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    }).exec();

    if (overlappingBooking) {
      throw new ConflictException(
        `Una o más habitaciones no están disponibles entre ${startDate} y ${endDate}.`,
      );
    }
  }
}
