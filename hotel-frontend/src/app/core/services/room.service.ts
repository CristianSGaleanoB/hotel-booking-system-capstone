import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Room } from '../interfaces/room.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  readonly #http = inject(HttpClient);
  readonly #api = inject(ApiConfigService);
  readonly #url = this.#api.getApiUrl('rooms');
 
  public rooms = signal<Room[]>([]);
  public isLoading = signal(false);

  constructor() {
    this.loadRooms();
  }

  async loadRooms() {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(this.#http.get<Room[]>(this.#url));
      this.rooms.set(response);
    } catch(error) {
      console.error('Error loading rooms:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}

