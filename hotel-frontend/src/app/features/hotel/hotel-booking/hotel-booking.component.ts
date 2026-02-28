import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss',
})
export class HotelBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  hotelId: string | null = null;

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id');
  }
}
