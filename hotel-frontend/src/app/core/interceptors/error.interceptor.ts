import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../interfaces/api-error.interface';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }

      const customError: ApiError = {
        status: error.status,
        message: error.message,
        error: error.statusText,
        timestamp: new Date().toISOString(),
        path: req.url
      };

      return throwError(() => customError);
    })
  );
};