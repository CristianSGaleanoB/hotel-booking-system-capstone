import { Types } from 'mongoose';

export interface RoomOption {
  id: Types.ObjectId;
  type: string;
  price: number;
  capacity: number;
}

export interface SearchOption {
  hotelId: Types.ObjectId;
  hotelName: string;
  location: string;
  optionLabel: string;
  rooms: RoomOption[];
  totalPrice: number;
  available: boolean;
}
