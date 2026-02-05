import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private API_URL = 'http://localhost:3000/api'; // ajusta si usas /api

  constructor(private http: HttpClient) {}

  // Crear tarea
  crearTarea(tarea: any): Observable<any> {
    return this.http.post(`${this.API_URL}/tareas`, tarea);
  }

  // Obtener todas las tareas
  obtenerTareas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/tareas`);
  }

  // Obtener tareas críticas
  obtenerTareasCriticas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/tareas/criticas`);
  }

  // Obtener tareas opcionales
  obtenerTareasOpcionales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/tareas/opcionales`);
  }

  // Eliminar tarea
  eliminarTarea(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/tareas/${id}`);
  }
}
