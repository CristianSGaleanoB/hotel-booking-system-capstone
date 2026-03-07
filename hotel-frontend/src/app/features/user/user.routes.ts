import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { UserBookings } from './bookings/user-bookings';

export const USER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'bookings', component: UserBookings },
  { path: '', redirectTo: 'bookings', pathMatch: 'full' }
];
