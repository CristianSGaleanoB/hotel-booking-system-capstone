import { Component, OnInit, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchService } from '../../../core/services/search.service';
import { HotelService } from '../../../core/services/hotel.service';
import { RoomService } from '../../../core/services/room.service';
import { Router } from '@angular/router';
import { Hotel } from '../../../core/interfaces/hotel.interface';
import { Room } from '../../../core/interfaces/room.interface';
import { customGlobeIcon, customArrivalIcon, customDepartureIcon, customPinIcon, customCapacityIcon, customBookIcon } from '../../../core/constants/custom-icons';
import { RoomComponent } from '../../../shared/components/room/room';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RoomComponent],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss'
})
export class HotelBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchService);
  private hotelService = inject(HotelService);
  private roomService = inject(RoomService);

  hotelId: string | null = null;
  hotel = signal<Hotel | null>(null);
  hotelRooms = signal<Room[]>([]);
  searchContext = this.searchService.lastFilters;

  adults = signal(1);
  children = signal(0);
  startDate = signal<string>('');
  endDate = signal<string>('');
  
  isFiltering = signal(false);
  availableRooms = signal<Room[]>([]);
  userSelectedRooms = signal<string[]>([]);
  private isInitialRun = true;

  constructor() {
    effect(() => {
      const sDate = this.startDate();
      const eDate = this.endDate();
      const numAdults = this.adults();
      const numChildren = this.children();

      const currentHotel = this.hotel();
      if (!currentHotel) return;

      untracked(() => {
        if (this.isInitialRun) {
          this.isInitialRun = false;
          return;
        }

        this.isFiltering.set(true);
        this.userSelectedRooms.set([]);

        const filters = {
          startDate: sDate,
          endDate: eDate,
          peopleCount: numAdults + numChildren,
          city: currentHotel.city
        };

        this.searchService.search(filters)
          .then(() => {
          })
          .catch(err => console.error('Reactive search error', err));
      });
    });
  }

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
      
      let initStart: any = ctx.startDate || ctx.checkIn || '';
      let initEnd: any = ctx.endDate || ctx.checkOut || '';
      
      if (initStart instanceof Date) {
        initStart = initStart.toISOString().split('T')[0];
      } else if (typeof initStart === 'string') {
        initStart = initStart.split('T')[0];
      }
      
      if (initEnd instanceof Date) {
        initEnd = initEnd.toISOString().split('T')[0];
      } else if (typeof initEnd === 'string') {
        initEnd = initEnd.split('T')[0];
      }

      this.startDate.set(initStart as string);
      this.endDate.set(initEnd as string);
    } else {
      // Default to today and tomorrow
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.startDate.set(today.toISOString().split('T')[0]);
      this.endDate.set(tomorrow.toISOString().split('T')[0]);
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
    if (this.isFiltering()) {
       return [];
    }
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
    if (!results || results.length === 0) return this.isFiltering() ? [] : rooms; 

 
    if (this.isFiltering()) {
      const currentResult = results.find(r => r.hotelId === this.hotelId);
      if (!currentResult || !currentResult.rooms) return [];
      
      const availableIds = currentResult.rooms.map(r => r.id || (r as { _id?: string })._id);
      return rooms.filter(room => availableIds.includes(room._id));
    }
    
    const initialResults = this.searchService.searchResults();
    if (!initialResults || initialResults.length === 0) return rooms; 

    const result = initialResults.find(r => r.hotelId === this.hotelId);
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
    if (!roomId) return;
    
    this.userSelectedRooms.update(selected => {
      if (selected.includes(roomId)) {
        return selected.filter(id => id !== roomId);
      } else {
        return [...selected, roomId];
      }
    });
  }

  get canBook(): boolean {
    return this.userSelectedRooms().length > 0;
  }

  goToBookingDetail() {
    if (!this.canBook) return;

    const currentHotel = this.hotel();
    if (!currentHotel) return;

    const selectedIds = this.userSelectedRooms();
    
    const bookingData = {
      hotelId: currentHotel._id,
      hotelName: currentHotel.name,
      roomIds: selectedIds,
      startDate: this.startDate(),
      endDate: this.endDate(),
      adultCount: this.adults(),
      childCount: this.children(),
    };

    this.router.navigate(['/bookings/detail'], { state: { bookingData } });
  }
}
