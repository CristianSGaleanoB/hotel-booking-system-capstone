import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from './api-config.service';
import { firstValueFrom } from 'rxjs';
import { BookingSummaryRequest, BookingSummaryResponse, ConfirmBookingRequest } from '../interfaces/booking.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);

  private get apiUrl() {
    return this.apiConfig.getApiUrl('bookings');
  }

  async getSummary(payload: BookingSummaryRequest): Promise<BookingSummaryResponse> {
    const url = `${this.apiUrl}/summary`;
    return firstValueFrom(this.http.post<BookingSummaryResponse>(url, payload));
  }

  async confirmBooking(payload: ConfirmBookingRequest): Promise<any> {
    const url = `${this.apiUrl}`;
    return firstValueFrom(this.http.post<any>(url, payload));
  }
}
