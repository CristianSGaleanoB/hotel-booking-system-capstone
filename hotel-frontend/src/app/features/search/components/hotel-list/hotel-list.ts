import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../../core/interfaces/hotel.interface';
import { SearchResult } from '../../../../core/interfaces/searchResult.interface';
import { HotelCard } from '../../../../shared/components/hotel-card/hotel-card';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, HotelCard],
  templateUrl: './hotel-list.html',
  styleUrl: './hotel-list.scss',
})
export class HotelListComponent {
  @Input() data: (Hotel | SearchResult)[] = [];

  isSearchResult(item: Hotel | SearchResult): item is SearchResult {
    return 'hotel' in item;
  }
}
