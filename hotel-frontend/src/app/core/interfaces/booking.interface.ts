export interface BookingSummaryRequest {
  startDate: string;
  endDate: string;
  roomIds: string[];
  adultCount: number;
  childCount?: number;
}

export interface RoomSummaryItem {
  id: string;
  roomNumber: number;
  type: string;
  price: number;
}

export interface BookingSummaryResponse {
  validated: boolean;
  checkInDate: string;
  checkOutDate: string;
  roomsSelected: RoomSummaryItem[];
  nightsCount: number;
  baseCost: number;
  promotionsApplied: string[];
  estimatedDiscount: number;
  finalCost: number;
  cancellationPolicy: string;
}

export interface ConfirmBookingRequest extends BookingSummaryRequest {
  totalPrice: number;
}
