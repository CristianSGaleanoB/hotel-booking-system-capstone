import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const newHotel = new this.hotelModel(createHotelDto);
    return await newHotel.save();
  }

  async findAll(): Promise<Hotel[]> {
    return await this.hotelModel.find().exec();
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelModel.findById(id).exec();
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const updatedHotel = await this.hotelModel
      .findByIdAndUpdate(id, updateHotelDto, { new: true })
      .exec();
    if (!updatedHotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return updatedHotel;
  }

  async remove(id: string): Promise<Hotel> {
    const deletedHotel = await this.hotelModel.findByIdAndDelete(id).exec();
    if (!deletedHotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return deletedHotel;
  }
}
