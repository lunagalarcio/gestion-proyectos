import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/api'; // 🔹 Ajusta si usas otro puerto o prefijo

  constructor(private http: HttpClient) {}

  obtenerReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reportes`);
  }

  agregarReporte(reporte: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reportes`, reporte);
  }

  obtenerReportesPorProyecto(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reportes/proyecto/${id}`);
  }

  eliminarReporte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reportes/${id}`);
  }
}
