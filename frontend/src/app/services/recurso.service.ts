import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia si tu backend usa otro puerto

  constructor(private http: HttpClient) {}

  obtenerRecursos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recursos`);
  }

  obtenerMateriales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materiales`);
  }

  obtenerEquipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/equipos`);
  }

  crearRecurso(recurso: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recursos`, recurso);
  }

  eliminarRecurso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recursos/${id}`);
  }
}
