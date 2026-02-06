import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

export const USER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
