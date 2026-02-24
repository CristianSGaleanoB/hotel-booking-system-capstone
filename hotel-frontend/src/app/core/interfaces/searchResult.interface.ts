import { Hotel } from "./hotel.interface";
import { RoomSuggestion } from "./roomSuggestion.interface";
import { AppliedPromotion } from "./appliedPrommotion.interface";

export interface SearchResult {
    hotel: Hotel;
    rooms: RoomSuggestion[];
    totalPrice: number;
    totalDiscount: number;
    appliedPromotions: AppliedPromotion[];
}