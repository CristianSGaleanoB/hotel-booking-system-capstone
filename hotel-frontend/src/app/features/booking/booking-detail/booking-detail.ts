import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BookingService } from '../../../core/services/booking.service';
import { BookingSummaryRequest, BookingSummaryResponse } from '../../../core/interfaces/booking.interface';
import { ApiError } from '../../../core/interfaces/api-error.interface';
import { customArrivalIcon, customDepartureIcon, customBookIcon } from '../../../core/constants/custom-icons';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.scss',
})
export class BookingDetail implements OnInit {
  private router = inject(Router);
  private bookingService = inject(BookingService);

  summary = signal<BookingSummaryResponse | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  bookingData: BookingSummaryRequest | null = null;
  hotelName: string = '';
  hotelId: string = '';

  planeArrivalIcon = customArrivalIcon;
  planeDepartureIcon = customDepartureIcon;
  calendarIcon = customBookIcon;

  constructor() {
    const state = history.state as { bookingData: any };

    if (state && state.bookingData) {
      this.bookingData = {
        startDate: state.bookingData.startDate,
        endDate: state.bookingData.endDate,
        roomIds: state.bookingData.roomIds,
        adultCount: state.bookingData.adultCount,
        childCount: state.bookingData.childCount
      };
      this.hotelName = state.bookingData.hotelName || 'Hotel';
      this.hotelId = state.bookingData.hotelId || '';
    }
  }

  async ngOnInit() {
    if (!this.bookingData) {
      this.router.navigate(['/']);
      return;
    }

    try {
      this.isLoading.set(true);
      const res = await this.bookingService.getSummary(this.bookingData);
      this.summary.set(res);
    } catch (err: any) {
      const apiError = err as ApiError;
      const message = apiError?.message || 'Error al cargar el resumen de reserva.';
      this.error.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  cancel() {
    if (this.hotelId) {
      this.router.navigate(['/hotel', this.hotelId, 'book']);
    } else {
      window.history.back();
    }
  }

  async confirmBooking() {
    if (!this.bookingData) return;
    const current = this.summary();
    if (!current) return;

    this.error.set(null);
    this.isSubmitting.set(true);

    try {
      await this.bookingService.confirmBooking({
        ...this.bookingData,
        totalPrice: current.finalCost
      });
      this.router.navigate(['/user']);
    } catch (err: any) {
      const apiError = err as ApiError;
      if (apiError.status === 409) {
        this.error.set(
          '¡Error! Las habitaciones seleccionadas ya no están disponibles. ' +
          'Por favor, regrese a la vista de reserva para una nueva selección.'
        );
        setTimeout(() => {
          if (this.hotelId) {
            this.router.navigate(['/hotel', this.hotelId, 'book']);
          }
        }, 3000);
      } else {
        const message = apiError?.message || 'Error al confirmar la reserva.';
        this.error.set(message);
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
