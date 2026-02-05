import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asignacion {
  asignacionid: number;
  empleadoid: number;
  tareaid: number;
  horasasignadas: string;
  fechaasignacion: string;
  empleado?: string;
  nombretarea?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAsignaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/asignaciones`);
  }

  addAsignacion(asignacion: Asignacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignaciones`, asignacion);
  }

  deleteAsignacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/asignaciones/${id}`);
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`);
  }

  obtenerTareas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tareas`);
  }
}
