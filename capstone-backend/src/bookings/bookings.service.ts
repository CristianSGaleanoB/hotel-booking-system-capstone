import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types, Connection, ClientSession } from 'mongoose';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { BookingStatus } from 'src/enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectConnection() private readonly connection: Connection,
    private readonly promotionsService: PromotionsService,
  ) {}

  /**
   * Confirms a new booking after validating the total price and availability.
   * @param createBookingDto Booking details from the request
   * @param userId ID of the user creating the booking
   * @returns The created booking document
   */
  async confirmBooking(createBookingDto: CreateBookingDto, userId: string) {
    const { roomIds, totalPrice, adultCount, childCount, startDate, endDate } =
      createBookingDto;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.checkRoomAvailability(roomIds, startDate, endDate, session);

      await this.roomModel.updateMany(
        { _id: { $in: roomIds.map((id) => new Types.ObjectId(id)) } },
        { $set: { updatedAt: new Date() } },
        { session },
      );

      const { checkIn, checkOut, promoDetails, rooms } =
        await this.calculateBookingDetails({
          startDate,
          endDate,
          roomIds,
          adultCount,
          childCount: childCount || 0,
          session,
        });

      if (totalPrice !== promoDetails.finalPrice) {
        throw new BadRequestException(
          `The provided price (${totalPrice}) does not match the server calculation (${promoDetails.finalPrice}).`,
        );
      }

      const newBooking = new this.bookingModel({
        user: new Types.ObjectId(userId),
        rooms: roomIds.map((id) => new Types.ObjectId(id)),
        hotel: (rooms[0].hotel as Hotel)._id,
        startDate: checkIn,
        endDate: checkOut,
        totalPrice: promoDetails.finalPrice,
        status: BookingStatus.CONFIRMED,
      });

      const savedBooking = await newBooking.save({ session });
      await session.commitTransaction();
      return savedBooking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getSummary(createSummaryDto: CreateSummaryDto) {
    const { startDate, endDate, roomIds, adultCount, childCount } =
      createSummaryDto;

    const { rooms, nightsCount, baseCost, promoDetails } =
      await this.calculateBookingDetails({
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

  /**
   * Cancels a booking if it's done at least 3 days before the start date.
   * @param bookingId ID of the booking to cancel
   * @param userId ID of the user requesting cancellation
   * @returns Success message
   */
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingModel.findOne({ _id: bookingId });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.user.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to cancel this booking',
      );
    }

    const cancelDate = new Date();
    const diffInMilliseconds =
      booking.startDate.getTime() - cancelDate.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays < 3) {
      throw new BadRequestException(
        'You can only cancel 3 days before the booking date',
      );
    }

    booking.status = BookingStatus.CANCELLED;
    await booking.save();
    return { message: 'Booking cancelled successfully' };
  }

  async getUserBookings(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const bookings = await this.bookingModel
      .find({ user: userObjectId })
      .populate('rooms')
      .populate('hotel')
      .exec();
    return bookings.map((booking) => ({
      id: booking._id,
      checkIn: booking.startDate,
      checkOut: booking.endDate,
      finalCost: booking.totalPrice,
      status: booking.status,
      rooms: (booking.rooms as unknown as Room[]).map((room: Room) => ({
        id: room._id,
        roomNumber: room.roomNumber,
        type: room.type,
      })),
    }));
  }

  /**
   * Internal method to calculate booking details, including availability check and promotion application.
   * @param data Booking parameters (dates, rooms, guest counts)
   * @returns Detailed calculation of the booking
   */
  private async calculateBookingDetails(data: {
    startDate: string;
    endDate: string;
    roomIds: string[];
    adultCount: number;
    childCount: number;
    session?: ClientSession;
  }) {
    await this.checkRoomAvailability(
      data.roomIds,
      data.startDate,
      data.endDate,
      data.session,
    );

    const rooms = await this.roomModel
      .find({ _id: { $in: data.roomIds } })
      .session(data.session || null)
      .populate('hotel')
      .exec();

    if (rooms.length !== data.roomIds.length) {
      throw new NotFoundException('One or more rooms were not found');
    }

    const checkIn = new Date(data.startDate);
    const checkOut = new Date(data.endDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const baseCost =
      rooms.reduce((sum, room) => sum + room.price, 0) * nightsCount;

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

  async checkRoomAvailability(
    roomIds: string[],
    startDate: string,
    endDate: string,
    session?: ClientSession,
  ): Promise<void> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBooking = await this.bookingModel
      .findOne({
        status: 'CONFIRMED',
        rooms: { $in: roomIds.map((id) => new Types.ObjectId(id)) },
        $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
      })
      .session(session || null)
      .exec();

    if (overlappingBooking) {
      throw new ConflictException(
        `One or more rooms are not available between ${startDate} and ${endDate}.`,
      );
    }
  }
}
