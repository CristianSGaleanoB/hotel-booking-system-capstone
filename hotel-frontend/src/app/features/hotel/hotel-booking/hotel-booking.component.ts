import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../core/interfaces/hotel.interface';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss'
})
export class HotelBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  private hotelService = inject(HotelService);

  hotelId: string | null = null;
  hotel = signal<Hotel | null>(null);
  searchContext = this.searchService.lastFilters;

  async ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('id');
    if (this.hotelId) {
      await this.hotelService.loadHotels(); 
      const foundHotel = this.hotelService.hotels().find(h => h._id === this.hotelId);
      this.hotel.set(foundHotel || null);
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
}
