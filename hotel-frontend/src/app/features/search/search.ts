import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../app.constants';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `<h1>Conexión con Backend: {{ status }}</h1>`,
})
export class Search implements OnInit {
  private http = inject(HttpClient);
  status = 'Conectando...';

  ngOnInit() {
    this.http.get(`${API_URL}/hotels`).subscribe({
      next: (val) => {
        console.log('Datos del Backend:', val);
        this.status = '¡Conectado con éxito! ';
      },
      error: (err) => {
        console.error('Error de conexión:', err);
        this.status = 'Error de conexión';
      }
    });
  }
}
