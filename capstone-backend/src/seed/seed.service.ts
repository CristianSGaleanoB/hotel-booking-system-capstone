import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Room, RoomType } from '../rooms/entities/room.entity';
import { FestiveCalendar } from '../promotions/entities/festive-calendar.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(FestiveCalendar.name)
    private readonly festiveModel: Model<FestiveCalendar>,
  ) {}

  async runSeed() {
    await this.roomModel.deleteMany({});
    await this.hotelModel.deleteMany({});
    await this.festiveModel.deleteMany({});

    const hotels = await this.hotelModel.insertMany([
      {
        name: 'Hotel Salitre Funza',
        address: 'Calle 15 # 10-20',
        city: 'Funza',
        description: 'Modern hotel near Bogota with great service.',
      },
      {
        name: 'Refugio del Cocuy',
        address: 'Vereda El Mortiño',
        city: 'Cocuy',
        description: 'Cozy retreat with stunning views of the Nevado.',
      },
      {
        name: 'Casona Colonial Soata',
        address: 'Carrera 4 # 5-12',
        city: 'Soata',
        description: 'Traditional stay in the heart of Soata.',
      },
      {
        name: 'Sal de Nemocon Resort',
        address: 'Diagonal 2 # 1-05',
        city: 'Nemocon',
        description: 'Luxury resort near the salt mines.',
      },
      {
        name: 'Patrimonio Salamina',
        address: 'Calle de la Realidad',
        city: 'Salamina',
        description: 'Stay in a historical building in the coffee region.',
      },
      {
        name: 'Boutique Santa Marta Beach',
        address: 'Rodadero Carrera 2',
        city: 'Santa Marta',
        description: 'Beautiful beach hotel with direct ocean access.',
      },
    ]);

    const rooms: Partial<Room>[] = [];
    hotels.forEach((hotel, index) => {
      rooms.push(
        {
          hotel: hotel._id,
          roomNumber: `${index + 1}01`,
          type: RoomType.SIMPLE_SINGLE,
          price: 80,
          capacity: 1,
          isAvailable: true,
        },
        {
          hotel: hotel._id,
          roomNumber: `${index + 1}02`,
          type: RoomType.SIMPLE_DOUBLE,
          price: 120,
          capacity: 2,
          isAvailable: true,
        },
        {
          hotel: hotel._id,
          roomNumber: `${index + 1}03`,
          type: RoomType.SIMPLE_TRIPLE,
          price: 180,
          capacity: 3,
          isAvailable: true,
        },
        {
          hotel: hotel._id,
          roomNumber: `${index + 1}04`,
          type: RoomType.SUITE_FAMILY,
          price: 300,
          capacity: 5,
          isAvailable: true,
        },
      );
    });

    await this.roomModel.insertMany(rooms);

    await this.festiveModel.insertMany([
      {
        name: 'Feria de las Flores',
        startDate: new Date('2026-08-07'),
        city: 'Santa Marta',
        discountPercentage: 20,
      },
      {
        name: 'Carnaval de Negros y Blancos',
        startDate: new Date('2026-01-05'),
        city: 'Pasto',
        discountPercentage: 15,
      },
    ]);

    return {
      message: 'Seed executed successfully',
      hotels: hotels.length,
      rooms: rooms.length,
      festivals: 2,
    };
  }
}
