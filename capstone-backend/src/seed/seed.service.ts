import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Room, RoomType } from '../rooms/entities/room.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async runSeed() {
    await this.roomModel.deleteMany({});
    await this.hotelModel.deleteMany({});

    const hotels = await this.hotelModel.insertMany([
      {
        name: 'Grand Riviera Hotel',
        address: 'Av. Coastal 123',
        city: 'Cancun',
        description: 'Luxury hotel with ocean view',
      },
      {
        name: 'Mountain Peak Lodge',
        address: 'Snowy Peak 456',
        city: 'Aspen',
        description: 'Cozy lodge in the mountains',
      },
      {
        name: 'City Center Inn',
        address: 'Main St 789',
        city: 'New York',
        description: 'Conveniently located in the heart of the city',
      },
    ]);

    const rooms = [
      { hotel: hotels[0]._id, roomNumber: '101', type: RoomType.DELUXE, price: 250, capacity: 2, isAvailable: true },
      { hotel: hotels[0]._id, roomNumber: '102', type: RoomType.SUITE, price: 400, capacity: 4, isAvailable: true },
      { hotel: hotels[0]._id, roomNumber: '103', type: RoomType.DOUBLE, price: 180, capacity: 2, isAvailable: false },
      { hotel: hotels[1]._id, roomNumber: '201', type: RoomType.SINGLE, price: 120, capacity: 1, isAvailable: true },
      { hotel: hotels[1]._id, roomNumber: '202', type: RoomType.DOUBLE, price: 200, capacity: 2, isAvailable: true },
      { hotel: hotels[1]._id, roomNumber: '203', type: RoomType.SUITE, price: 350, capacity: 3, isAvailable: true },
      { hotel: hotels[2]._id, roomNumber: '301', type: RoomType.SINGLE, price: 100, capacity: 1, isAvailable: true },
      { hotel: hotels[2]._id, roomNumber: '302', type: RoomType.SINGLE, price: 100, capacity: 1, isAvailable: false },
      { hotel: hotels[2]._id, roomNumber: '303', type: RoomType.DOUBLE, price: 160, capacity: 2, isAvailable: true },
      { hotel: hotels[2]._id, roomNumber: '304', type: RoomType.DOUBLE, price: 160, capacity: 2, isAvailable: true },
    ];

    await this.roomModel.insertMany(rooms);

    return { message: 'Seed executed successfully', hotels: hotels.length, rooms: rooms.length };
  }
}
