import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../core/interfaces/hotel.interface';
import { SearchResult } from '../../core/interfaces/searchResult.interface';
import { HotelService } from '../../core/services/hotel.service';
import { SearchService } from '../../core/services/search.service';
import { SearchFormComponent } from './components/search-form/search-form';
import { HotelListComponent } from './components/hotel-list/hotel-list';

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

  ngOnInit() {
    this.hotelService.loadHotels();
  }

  handleSearch(filters: any) {
    console.log('Filtros recibidos:', filters);
  }

  getUniqueCities(): string[] {
    const hotels = this.hotelService.hotels();
    return [...new Set(hotels.map(h => h.city))].sort();
  }

  getDisplayData(): (Hotel | SearchResult)[] {
    const results = this.searchService.searchResults();
    if (results.length > 0) return results;
 
    return this.hotelService.hotels().map(hotel => ({
      ...hotel,
      rooms: (hotel as any).rooms || [
        { id: '1', type: 'Sencilla', price: 120, capacity: 1, description: 'Habitación acogedora para una persona.' },
        { id: '2', type: 'Doble', price: 200, capacity: 2, description: 'Espaciosa habitación con cama king.' }
      ]
    }));
  }
}
