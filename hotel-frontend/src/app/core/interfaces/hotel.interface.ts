import { RoomSuggestion } from "./roomSuggestion.interface";

export interface Hotel{
    _id: string;
    name: string;
    description: string;
    city: string;
    isActive: boolean;
    rooms?: RoomSuggestion[];
}