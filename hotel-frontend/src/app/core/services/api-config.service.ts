import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl = 'http://localhost:3001';

  private readonly endpoints: Record<string, string> = {
    hotels: '/hotels',
    search: '/search',
    auth: '/auth'
  };


  getApiUrl(endpoint: string): string {
    const path = this.endpoints[endpoint];
    if (!path) {
      throw new Error(`Endpoint "${endpoint}" no está configurado en ApiConfigService`);
    }
    return `${this.baseUrl}${path}`;
  }
}
