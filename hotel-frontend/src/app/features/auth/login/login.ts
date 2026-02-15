import { Component, signal, inject } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  isLoading = signal(false);

  onLogin(credentials: any) {
    this.isLoading.set(true);
    
    setTimeout(() => {
      this.authService.login();
      this.isLoading.set(false);
    }, 1500);
  }
}
