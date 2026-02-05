import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/users.interface';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/proyectos.interface';


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

obtenerClientes(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/clientes`);
}
   // Crear proyecto
  crearProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.apiUrl}/proyectos`, proyecto);
  }

  // Obtener lista de proyectos
  obtenerProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.apiUrl}/proyectos`);
  }

  // Eliminar proyecto por ID
  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proyectos/${id}`);
  }
}
