import { Hotel } from './hotel.interface';

export interface Room {
  _id: string;
  hotel: Hotel | string; 
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  description?: string;
}
