import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { UserBooking } from '../../../core/interfaces/booking.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { customImageIcon, customPinIcon } from '../../../core/constants/custom-icons';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './user-bookings.html',
  styleUrl: './user-bookings.scss',
})
export class UserBookings implements OnInit {
  private bookingService = inject(BookingService);

  bookings = signal<UserBooking[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  faTimesCircle = faTimesCircle;
  customImage = customImageIcon;
  customPin = customPinIcon;

  async ngOnInit() {
    await this.loadBookings();
  }

  async loadBookings() {
    this.isLoading.set(true);
    try {
      const data = await this.bookingService.getUserBookings();
      this.bookings.set(data);
    } catch (err) {
      this.error.set('No se pudieron cargar tus reservas.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async cancelBooking(id: string) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

    try {
      await this.bookingService.cancelBooking(id);
      await this.loadBookings();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar la reserva.');
    }
  }

  isCancellable(booking: UserBooking): boolean {
    if (booking.status !== 'CONFIRMED') return false;

    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 3;
  }
}
