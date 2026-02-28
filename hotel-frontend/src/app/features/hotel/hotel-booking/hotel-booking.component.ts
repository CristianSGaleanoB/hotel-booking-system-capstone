import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { SearchFilters } from '../../../core/interfaces/search-filters.interface';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss',
})
export class HotelBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  hotelId: string | null = null;
  searchContext = this.searchService.lastFilters;

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id');
  }
}
