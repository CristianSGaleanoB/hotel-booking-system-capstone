import { Component, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginCredentials } from '../../../../../core/interfaces/login-credentials.interface';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  isLoading = input<boolean>(false);
  loginSubmit = output<LoginCredentials>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginSubmit.emit(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
