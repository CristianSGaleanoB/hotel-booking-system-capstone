import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from '../rooms/entities/room.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { SearchDto } from './dto/search.dto';
import { SearchOption } from './interfaces/search-result.interface';
import { PromotionsService } from '../promotions/promotions.service';
import { FestiveCalendar } from '../promotions/entities/festive-calendar.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(FestiveCalendar.name)
    private festiveModel: Model<FestiveCalendar>,
    private promotionsService: PromotionsService,
  ) {}

  async findOptions(searchDto: SearchDto) {
    const { startDate, endDate, peopleCount, city, minPrice, maxPrice } =
      searchDto;

    const hotels = await this.hotelModel
      .find({ city, isActive: true })
      .select('_id name city')
      .exec();
    const hotelIds = hotels.map((h) => h._id);

    const festiveCalendar = await this.festiveModel.findOne({
      city,
      startDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    const priceQuery: Record<string, any> = {};
    if (minPrice !== undefined) priceQuery['$gte'] = minPrice;
    if (maxPrice !== undefined) priceQuery['$lte'] = maxPrice;

    const availableRooms = await this.roomModel.aggregate([
      {
        $match: {
          hotel: { $in: hotelIds },
          isAvailable: true,
          ...(Object.keys(priceQuery).length ? { price: priceQuery } : {}),
        },
      },
      {
        $lookup: {
          from: 'bookings',
          let: { roomId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$roomId', '$rooms'] },
                    { $eq: ['$status', 'CONFIRMED'] },
                    { $lt: ['$startDate', new Date(endDate)] },
                    { $gt: ['$endDate', new Date(startDate)] },
                  ],
                },
              },
            },
          ],
          as: 'overlappingBookings',
        },
      },
      {
        $match: {
          overlappingBookings: { $size: 0 },
        },
      },
    ]);

    const roomsByHotel: Record<string, Room[]> = {};
    availableRooms.forEach((r) => {
      const hotelId = (r.hotel as Types.ObjectId).toString();
      if (!roomsByHotel[hotelId]) roomsByHotel[hotelId] = [];
      roomsByHotel[hotelId].push(r);
    });

    const results: SearchOption[] = [];

    for (const hotel of hotels) {
      const hotelRooms = roomsByHotel[hotel._id.toString()] || [];
      if (hotelRooms.length === 0) continue;

      const totalCapacity = hotelRooms.reduce((sum, r) => sum + r.capacity, 0);
      if (totalCapacity < peopleCount) continue;

      const combinations = this.findCombinations(hotelRooms, peopleCount);
      if (combinations.length === 0) continue;

      combinations.sort((a, b) => {
        const capA = a.reduce((sum, r) => sum + r.capacity, 0);
        const capB = b.reduce((sum, r) => sum + r.capacity, 0);
        if (capA !== capB) return capA - capB;

        const priceA = a.reduce((sum, r) => sum + r.price, 0);
        const priceB = b.reduce((sum, r) => sum + r.price, 0);
        return priceA - priceB;
      });

      const bestCombo = combinations[0];
      const rawTotalPrice = bestCombo.reduce((sum, r) => sum + r.price, 0);

      const promoResult = await this.promotionsService.applyPromotions({
        adultCount: peopleCount,
        childCount: 0,
        city: hotel.city,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        basePrice: rawTotalPrice,
        festiveCalendar: festiveCalendar as FestiveCalendar,
      });

      const mappedPromotions = promoResult.promotionsApplied.map((promo) => ({
        name: promo,
      }));

      results.push({
        hotelId: hotel._id,
        hotelName: hotel.name,
        location: hotel.city,
        // Return exactly ONE option per hotel, with ONLY the best combination rooms inside
        optionLabel: `Available for ${peopleCount} People`,
        rooms: bestCombo.map((r) => ({
          id: r._id,
          type: r.type,
          price: r.price,
          capacity: r.capacity,
        })),
        totalPrice: promoResult.finalPrice,
        available: true,
        appliedPromotions: mappedPromotions,
      });
    }

    return results;
  }

  /**
   * Backtracking algorithm to find the best room combinations for a given number of people.
   * It sorts rooms by capacity and tries to fill the target capacity with the minimum number of rooms.
   * @param rooms List of available rooms in the hotel
   * @param target Number of people to accommodate
   * @returns Array of room combinations
   */
  private findCombinations(rooms: Room[], target: number): Room[][] {
    const results: Room[][] = [];

    const sortedRooms = [...rooms].sort((a, b) => b.capacity - a.capacity);

    const backtrack = (
      startIndex: number,
      currentCombo: Room[],
      currentCapacity: number,
    ) => {
      if (currentCapacity >= target) {
        results.push([...currentCombo]);
        return;
      }

      for (let i = startIndex; i < sortedRooms.length; i++) {
        if (results.length >= 20) return; // Expand search limit to allow finding better fits

        currentCombo.push(sortedRooms[i]);
        backtrack(
          i + 1,
          currentCombo,
          currentCapacity + sortedRooms[i].capacity,
        );
        currentCombo.pop();
      }
    };

    backtrack(0, [], 0);
    return results;
  }
}
