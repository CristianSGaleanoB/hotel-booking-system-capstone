import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../core/services/hotel.service';
import { SearchService } from '../../core/services/search.service';
import { SearchFormComponent } from './components/search-form/search-form';
import { HotelListComponent } from './components/hotel-list/hotel-list';
import { SearchFilters } from '../../core/interfaces/search-filters.interface';

interface SearchParamsBackend {
  startDate: string;
  endDate: string;
  peopleCount: number;
  city: string;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, HotelListComponent],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  public hotelService = inject(HotelService);
  public searchService = inject(SearchService);
  public errorMessage = signal<string | null>(null);
  public hasSearched = signal(false);

  ngOnInit() {
    this.hotelService.loadHotels();
  }

  async handleSearch(filters: SearchFilters) {
    this.errorMessage.set(null);
    
    if (!filters.city) {
      this.hasSearched.set(false);
      this.searchService.searchResults.set([]);
      return;
    }

    this.hasSearched.set(true);
    
    if (!filters.city || !filters.checkIn || !filters.checkOut || !filters.guests) {
      this.errorMessage.set('Por favor seleccione una ciudad, fechas de estadía y número de personas.');
      return;
    }

    const searchParams: SearchParamsBackend = {
      startDate: filters.checkIn,
      endDate: filters.checkOut,
      peopleCount: filters.guests,
      city: filters.city,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    };

    try {
      const descMap = new Map<string, string>();
      this.hotelService.hotels().forEach(h => descMap.set(h._id, h.description));
      await this.searchService.search(searchParams, descMap);
    } catch (error) {
      this.errorMessage.set('Ocurrió un error al realizar la búsqueda. Por favor verifique la disponibilidad.');
    }
  }

  getUniqueCities(): string[] {
    const hotels = this.hotelService.hotels();
    return [...new Set(hotels.map(h => h.city))].sort();
  }
}
