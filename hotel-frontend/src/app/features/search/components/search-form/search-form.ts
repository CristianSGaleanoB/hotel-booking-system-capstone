import { Component, EventEmitter, Output, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customArrivalIcon, customDepartureIcon } from '../../../../core/constants/custom-icons';

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
  @Output() search = new EventEmitter<any>();
  
  arrivalIcon = customArrivalIcon;
  departureIcon = customDepartureIcon;

  searchForm: FormGroup = this.fb.group({
    city: [''],
    checkIn: [''],
    checkOut: [''],
    guests: [1],
    minPrice: [0],
    maxPrice: [1000]
  });

  onSubmit() {
    this.search.emit(this.searchForm.value);
  }

  clearFilters() {
    this.searchForm.reset({
      city: '',
      guests: 1,
      minPrice: 0,
      maxPrice: 1000
    });
    this.search.emit(this.searchForm.value);
  }
}
