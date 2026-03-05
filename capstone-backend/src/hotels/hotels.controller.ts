import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiResponse({ status: 201, description: 'Hotel created successfully' })
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all active hotels' })
  @ApiResponse({ status: 200, description: 'List of hotels' })
  findAll() {
    return this.hotelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel found' })
  @ApiResponse({ status: 404, description: 'Hotel not found' })
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a hotel' })
  @ApiResponse({ status: 200, description: 'Hotel updated successfully' })
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a hotel (soft delete/deactivate)' })
  @ApiResponse({ status: 200, description: 'Hotel removed successfully' })
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(id);
  }
}
