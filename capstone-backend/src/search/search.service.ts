import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../rooms/entities/room.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { SearchDto } from './dto/search.dto';
import { SearchOption } from './interfaces/search-result.interface';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private promotionsService: PromotionsService,
  ) {}

  async findOptions(searchDto: SearchDto) {
    const { startDate, endDate, peopleCount, city, minPrice, maxPrice } = searchDto;

    const hotels = await this.hotelModel.find({ city, isActive: true }).exec();
    const hotelIds = hotels.map((h) => h._id);

    const priceQuery: Record<string, number> = {};
    if (minPrice !== undefined) priceQuery['$gte'] = minPrice;
    if (maxPrice !== undefined) priceQuery['$lte'] = maxPrice;

    const rooms = await this.roomModel
      .find({
        hotel: { $in: hotelIds },
        isAvailable: true,
        ...(Object.keys(priceQuery).length ? { price: priceQuery } : {}),
      })
      .exec();

    const overlappingBookings = await this.bookingModel.find({
      status: 'CONFIRMED',
      $or: [
        { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } },
      ],
    }).exec();

    const bookedRoomIds = overlappingBookings.flatMap((b) => b.rooms.map(r => r.toString()));
    
    const availableRooms = rooms
      .filter((r) => !bookedRoomIds.includes(r._id.toString()))
      .filter((r) => r.capacity <= peopleCount * 2); 
    const roomsByHotel: Record<string, Room[]> = {};
    availableRooms.forEach((r) => {
      const hotelId = r.hotel.toString();
      if (!roomsByHotel[hotelId]) roomsByHotel[hotelId] = [];
      roomsByHotel[hotelId].push(r);
    });

    const results: SearchOption[] = [];

    for (const hotel of hotels) {
      const hotelRooms = roomsByHotel[hotel._id.toString()] || [];
      if (hotelRooms.length === 0) continue;

      const combinations = this.findCombinations(hotelRooms, peopleCount);
      
      const optionPromises = combinations.map(async (combo, index) => {
        const rawTotalPrice = combo.reduce((sum, r) => sum + r.price, 0);

        const promoResult = await this.promotionsService.applyPromotions({
          adultCount: peopleCount,
          childCount: 0,
          city: hotel.city,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          basePrice: rawTotalPrice
        });

        const mappedPromotions = promoResult.promotionsApplied.map(promo => ({ name: promo }));

        return {
          hotelId: hotel._id,
          hotelName: hotel.name,
          location: hotel.city,
          optionLabel: `Opción ${index + 1} (${peopleCount} Personas)`,
          rooms: combo.map((r) => ({
            id: r._id,
            type: r.type,
            price: r.price,
            capacity: r.capacity,
          })),
          totalPrice: promoResult.finalPrice,
          available: true,
          appliedPromotions: mappedPromotions
        };
      });

      const options = await Promise.all(optionPromises);
      results.push(...options);
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

    const backtrack = (startIndex: number, currentCombo: Room[], currentCapacity: number) => {
      // If we reached or exceeded the target, we have a valid combination
      if (currentCapacity >= target) {
        results.push([...currentCombo]);
        return;
      }

      for (let i = startIndex; i < sortedRooms.length; i++) {
        // Limit to top 3 combinations for brevity
        if (results.length >= 3) return;

        currentCombo.push(sortedRooms[i]);
        backtrack(i + 1, currentCombo, currentCapacity + sortedRooms[i].capacity);
        currentCombo.pop();
      }
    };

    backtrack(0, [], 0);
    return results;
  }
}
