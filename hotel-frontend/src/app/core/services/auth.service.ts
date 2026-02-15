import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../app.constants';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  isLoggedIn = signal<boolean>(!!localStorage.getItem('auth_token'));

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  login(credentials: any) {
    return this.http.post<{ token: string }>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.isLoggedIn.set(true);
          this.router.navigate(['/']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/auth']);
  }
}
