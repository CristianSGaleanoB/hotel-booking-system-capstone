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
}
