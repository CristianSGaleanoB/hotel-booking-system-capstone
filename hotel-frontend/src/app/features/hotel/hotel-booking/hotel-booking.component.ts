import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchService } from '../../../core/services/search.service';
import { HotelService } from '../../../core/services/hotel.service';
import { RoomService } from '../../../core/services/room.service';
import { Hotel } from '../../../core/interfaces/hotel.interface';
import { Room } from '../../../core/interfaces/room.interface';
import { customGlobeIcon, customArrivalIcon, customDepartureIcon, customPinIcon, customCapacityIcon, customBookIcon } from '../../../core/constants/custom-icons';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss'
})
export class HotelBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  private hotelService = inject(HotelService);
  private roomService = inject(RoomService);

  hotelId: string | null = null;
  hotel = signal<Hotel | null>(null);
  hotelRooms = signal<Room[]>([]);
  searchContext = this.searchService.lastFilters;

  adults = signal(1);
  children = signal(0);
  selectedRoomId = signal<string | null>(null);

  globeIcon = customGlobeIcon;
  planeArrivalIcon = customArrivalIcon;
  planeDepartureIcon = customDepartureIcon;
  pinIcon = customPinIcon;
  capacityIcon = customCapacityIcon;
  bookIcon = customBookIcon;

  async ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('id');
    
    const ctx = this.searchContext();
    if (ctx) {
      this.adults.set(ctx.peopleCount || ctx.guests || 1);
    }

    if (this.hotelId) {
      await this.hotelService.loadHotels(); 
      await this.roomService.loadRooms();
      
      const foundHotel = this.hotelService.hotels().find(h => h._id === this.hotelId);
      this.hotel.set(foundHotel || null);
      const filteredRooms = this.roomService.rooms().filter(r => {
        if (typeof r.hotel === 'string') {
          return r.hotel === this.hotelId;
        } else if (r.hotel && typeof r.hotel === 'object') {
          return r.hotel._id === this.hotelId;
        }
        return false;
      });
      this.hotelRooms.set(filteredRooms);
    }
  }

  get activePromotions(): { name: string }[] {
    const promos: { name: string }[] = [];
    const searchResults = this.searchService.searchResults();
    const currentId = this.hotelId;

    if (currentId && searchResults && searchResults.length > 0) {
      const searchResult = searchResults.find(r => r.hotelId === currentId);
      if (searchResult && searchResult.appliedPromotions) {
         return searchResult.appliedPromotions;
      }
    }

    promos.push({ name: 'Niños menores de 5 años no pagan estadía' });
    promos.push({ name: 'Desayunos incluídos' });

    return promos;
  }

  get suggestedRooms(): Room[] {
    const rooms = this.hotelRooms();
    if (!rooms || rooms.length === 0) return [];
    
    const results = this.searchService.searchResults();
    if (!results || results.length === 0) return []; 

    const result = results.find(r => r.hotelId === this.hotelId);
    if (!result || !result.rooms) return [];

    const suggestedIds = result.rooms.map(r => r.id || (r as { _id?: string })._id);
    return rooms.filter(room => suggestedIds.includes(room._id));
  }

  get otherRooms(): Room[] {
    const rooms = this.hotelRooms();
    if (!rooms || rooms.length === 0) return [];
    
    const results = this.searchService.searchResults();
    if (!results || results.length === 0) return rooms; 

    const result = results.find(r => r.hotelId === this.hotelId);
    if (!result || !result.rooms) return rooms;

    const suggestedIds = result.rooms.map(r => r.id || (r as { _id?: string })._id);
    return rooms.filter(room => !suggestedIds.includes(room._id));
  }

  updateGuests(type: 'adults' | 'children', increment: boolean) {
    if (type === 'adults') {
      const current = this.adults();
      if (increment) this.adults.set(current + 1);
      else if (current > 1) this.adults.set(current - 1);
    } else {
      const current = this.children();
      if (increment) this.children.set(current + 1);
      else if (current > 0) this.children.set(current - 1);
    }
  }

  selectRoom(roomId: string | undefined) {
    if(roomId) this.selectedRoomId.set(roomId);
  }
}
