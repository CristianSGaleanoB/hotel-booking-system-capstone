import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    private readonly promotionsService: PromotionsService,
  ) {}

  async confirmBooking(createBookingDto: CreateBookingDto, userId: string) {
    const { roomIds, totalPrice, adultCount, childCount, startDate, endDate } = createBookingDto;

    const { checkIn, checkOut, promoDetails, rooms } = await this.calculateBookingDetails({
      startDate,
      endDate,
      roomIds,
      adultCount,
      childCount: childCount || 0,
    });

    if (totalPrice !== promoDetails.finalPrice) {
      throw new BadRequestException(
        `El precio enviado (${totalPrice}) no coincide con el cálculo del servidor (${promoDetails.finalPrice}).`,
      );
    }

    const newBooking = new this.bookingModel({
      user: new Types.ObjectId(userId),
      rooms: roomIds.map((id) => new Types.ObjectId(id)),
      hotel: (rooms[0].hotel as Hotel)._id,
      startDate: checkIn,
      endDate: checkOut,
      totalPrice: promoDetails.finalPrice,
      status: 'CONFIRMED',
    });

    return await newBooking.save();
  }

  async getSummary(createSummaryDto: CreateSummaryDto) {
    const { startDate, endDate, roomIds, adultCount, childCount } = createSummaryDto;

    const { rooms, nightsCount, baseCost, promoDetails } = await this.calculateBookingDetails({
      startDate,
      endDate,
      roomIds,
      adultCount,
      childCount: childCount || 0,
    });

    return {
      validated: true,
      checkInDate: startDate,
      checkOutDate: endDate,
      roomsSelected: rooms.map((r) => ({
        id: r._id,
        roomNumber: r.roomNumber,
        type: r.type,
        price: r.price,
      })),
      nightsCount,
      baseCost,
      promotionsApplied: promoDetails.promotionsApplied,
      estimatedDiscount: promoDetails.totalDiscount,
      finalCost: promoDetails.finalPrice,
      cancellationPolicy: 'Cancelación 3 días antes de la fecha de reserva.',
    };
  }

  private async calculateBookingDetails(data: {
    startDate: string;
    endDate: string;
    roomIds: string[];
    adultCount: number;
    childCount: number;
  }) {
    await this.checkRoomAvailability(data.roomIds, data.startDate, data.endDate);

    const rooms = await this.roomModel
      .find({ _id: { $in: data.roomIds } })
      .populate('hotel')
      .exec();

    if (rooms.length !== data.roomIds.length) {
      throw new NotFoundException('Una o más habitaciones no fueron encontradas');
    }

    const checkIn = new Date(data.startDate);
    const checkOut = new Date(data.endDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const baseCost = rooms.reduce((sum, room) => sum + room.price, 0) * nightsCount;

    const hotel = rooms[0].hotel as Hotel;

    const promoDetails = await this.promotionsService.applyPromotions({
      adultCount: data.adultCount,
      childCount: data.childCount,
      city: hotel.city,
      startDate: checkIn,
      endDate: checkOut,
      basePrice: baseCost,
    });

    return {
      rooms,
      checkIn,
      checkOut,
      nightsCount,
      baseCost,
      promoDetails,
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
