import { Component, EventEmitter, Output, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customArrivalIcon, customDepartureIcon } from '../../../../core/constants/custom-icons';
import { SearchFilters } from '../../../../core/interfaces/search-filters.interface';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss',
})
export class SearchFormComponent {
  private fb = inject(FormBuilder);
  
  @Input() cities: string[] = [];
  @Output() search = new EventEmitter<SearchFilters>();
  
  arrivalIcon = customArrivalIcon;
  departureIcon = customDepartureIcon;
  today = new Date().toISOString().split('T')[0];
  tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  searchForm: FormGroup = this.fb.group({
    city: [''],
    checkIn: [this.today],
    checkOut: [this.tomorrow],
    guests: [1],
    minPrice: [0],
    maxPrice: [1000]
  });

  onSubmit() {
    this.search.emit(this.searchForm.value as SearchFilters);
  }

  clearFilters() {
    this.searchForm.reset({
      city: '',
      checkIn: this.today,
      checkOut: this.tomorrow,
      guests: 1,
      minPrice: 0,
      maxPrice: 1000
    });
    this.search.emit(this.searchForm.value as SearchFilters);
  }
}
