import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./features/search/search.routes').then(m => m.SEARCH_ROUTES)
            },
            {
                path: 'user',
                canActivate: [authGuard],
                loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
            },
            {
                path: 'auth',
                loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
            },
            {
                path: 'hotel',
                loadChildren: () => import('./features/hotel/hotel.routes').then(m => m.HOTEL_ROUTES)
            },
            {
                path: 'bookings',
                canActivate: [authGuard],
                loadChildren: () => import('./features/booking/booking.routes').then(m => m.BOOKING_ROUTES)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
