import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials } from '../../../core/interfaces/login-credentials.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onLogin(credentials: LoginCredentials) {
    this.isLoading.set(true);
    
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales inválidas. Por favor, intenta de nuevo.');
      }
    });
  }
}
