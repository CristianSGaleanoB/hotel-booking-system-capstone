import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async confirmBooking(createBookingDto: CreateBookingDto, userId: string) {
    const { startDate, endDate, roomIds, totalPrice } = createBookingDto;

    await this.checkRoomAvailability(roomIds, startDate, endDate);

    const rooms = await this.roomModel.find({ _id: { $in: roomIds } }).exec();
    if (rooms.length !== roomIds.length) {
      throw new NotFoundException('Una o más habitaciones no fueron encontradas');
    }

    const checkIn = new Date(startDate);
    const checkOut = new Date(endDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const serverCalculatedPrice = rooms.reduce((sum, room) => sum + room.price, 0) * nightsCount;

    if (totalPrice !== serverCalculatedPrice) {
      throw new BadRequestException(
        `El precio enviado (${totalPrice}) no coincide con el cálculo del servidor (${serverCalculatedPrice}).`,
      );
    }

      const newBooking = new this.bookingModel({
      user: new Types.ObjectId(userId),
      rooms: roomIds.map((id) => new Types.ObjectId(id)),
      hotel: rooms[0].hotel,
      startDate: checkIn,
      endDate: checkOut,
      totalPrice: serverCalculatedPrice,
      status: 'CONFIRMED',
    });

    return await newBooking.save();
  }

  async getSummary(createSummaryDto: CreateSummaryDto) {
    const { startDate, endDate, roomIds } = createSummaryDto;

    await this.checkRoomAvailability(roomIds, startDate, endDate);

    const rooms = await this.roomModel.find({ _id: { $in: roomIds } }).exec();
    if (rooms.length !== roomIds.length) {
      throw new NotFoundException('Una o más habitaciones no fueron encontradas');
    }

    const checkIn = new Date(startDate);
    const checkOut = new Date(endDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const baseCost = rooms.reduce((sum, room) => sum + room.price, 0) * nightsCount;

    return {
      validated: true,
      checkInDate: startDate,
      checkOutDate: endDate,
      roomsSelected: rooms.map(r => ({
        id: r._id,
        roomNumber: r.roomNumber,
        type: r.type,
        price: r.price,
      })),
      nightsCount,
      baseCost,
      promotionsApplied: [],
      estimatedDiscount: 0.0,
      finalCost: baseCost,
      cancellationPolicy: 'Cancelación 3 días antes de la fecha de reserva.',
    };
  }

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
