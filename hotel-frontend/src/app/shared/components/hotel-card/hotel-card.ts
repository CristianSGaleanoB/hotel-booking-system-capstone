import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../core/interfaces/hotel.interface';
import { SearchResult } from '../../../core/interfaces/searchResult.interface';
import { Room } from '../room/room';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customUserIcon } from '../../../core/constants/custom-icons';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule, Room, FontAwesomeModule],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss',
})
export class HotelCard {
  @Input() data!: SearchResult | Hotel;
  customUser = customUserIcon; 
  
  get hasSuggestedRooms(): boolean {
    return 'rooms' in this.data && this.data.rooms.length > 0;
  }

  get hotel(): Hotel {
    return 'hotel' in this.data ? this.data.hotel : this.data;
  }
}
