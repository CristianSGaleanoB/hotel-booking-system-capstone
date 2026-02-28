import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../core/interfaces/hotel.interface';
import { SearchResult } from '../../../core/interfaces/searchResult.interface';
import { Room } from '../room/room';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customPinIcon, customImageIcon, customBookIcon } from '../../../core/constants/custom-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule, Room, FontAwesomeModule, RouterModule],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss',
})
export class HotelCard {
  @Input() data!: SearchResult | Hotel;
  
  pinIcon = customPinIcon; 
  imageIcon = customImageIcon;
  bookIcon = customBookIcon;
  
  get roomSuggestions(): any[] {
    if ('rooms' in this.data && this.data.rooms) {
      return this.data.rooms;
    }
    return [];
  }

  get hasSuggestedRooms(): boolean {
    return this.roomSuggestions.length > 0;
  }

  get promotions(): { name: string }[] {
    if ('appliedPromotions' in this.data && Array.isArray(this.data.appliedPromotions) && this.data.appliedPromotions.length > 0) {
      return this.data.appliedPromotions;
    }

    return [
       { name: 'CARNAVAL' },
       { name: 'FAMILIAS DE MÁS DE 8 INTEGRANTES' },
       { name: 'NIÑOS MENORES DE 5 AÑOS NO PAGAN ESTADÍA' },
       { name: 'DESAYUNOS INCLUIDOS' }
    ];
  }

  get hasPromotions(): boolean {
    return true; 
  }

  get hotel(): Hotel {
    if ('hotelName' in this.data) {
      return {
        _id: this.data.hotelId,
        name: this.data.hotelName,
        description: this.data.description ?? '',
        city: this.data.location,
        isActive: true,
        appliedPromotions: this.data.appliedPromotions
      };
    }
    return this.data as Hotel;
  }
}
