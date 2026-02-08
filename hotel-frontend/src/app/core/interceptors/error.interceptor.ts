import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../interfaces/api-error.interface';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Interceptor Error:', error);

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