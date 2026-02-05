import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private API_URL = 'http://localhost:3000/api'; // cambia si tu backend usa otro puerto

  constructor(private http: HttpClient) {}


  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/empleados`);
  }

  crearEmpleado(empleado: any): Observable<any> {
    return this.http.post(`${this.API_URL}/empleados`, empleado);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/empleados/${id}`);
  }
}
