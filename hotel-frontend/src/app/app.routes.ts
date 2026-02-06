import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/search/search.routes').then(m => m.SEARCH_ROUTES)
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
