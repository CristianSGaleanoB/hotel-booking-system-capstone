import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../app.constants';
import { tap } from 'rxjs';

import { LoginCredentials } from '../interfaces/login-credentials.interface';

interface LoginResponse {
  bearer: string;
}

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

  login(credentials: LoginCredentials) {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.bearer) {
          localStorage.setItem('auth_token', response.bearer);
          this.isLoggedIn.set(true);
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
