import { Routes } from '@angular/router';
import { UserBookings } from './bookings/user-bookings';

export const USER_ROUTES: Routes = [
  { path: 'bookings', component: UserBookings },
  { path: '', redirectTo: 'bookings', pathMatch: 'full' }
];
