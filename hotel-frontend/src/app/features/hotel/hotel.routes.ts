import { Routes } from '@angular/router';
import { HotelBookingComponent } from './hotel-booking/hotel-booking.component';

export const HOTEL_ROUTES: Routes = [
  { path: ':id/book', component: HotelBookingComponent }
];
