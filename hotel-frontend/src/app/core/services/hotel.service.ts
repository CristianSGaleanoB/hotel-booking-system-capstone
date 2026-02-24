import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Hotel } from '../interfaces/hotel.interface'; 
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  readonly #http = inject(HttpClient);
  readonly #api = inject(ApiConfigService);
  readonly #url = this.#api.getApiUrl('hotels');
 
  public hotels = signal<Hotel[]>([]);
  public isLoading = signal(false);

  constructor() {
    this.loadHotels();
  }

  async loadHotels() {
    this.isLoading.set(true);
    try{
      const response = await firstValueFrom(this.#http.get<Hotel[]>(this.#url));
      this.hotels.set(response);
    }catch(error){
      console.error('Error loading hotels:', error);
    }finally{
      this.isLoading.set(false);
    }
  }
}
