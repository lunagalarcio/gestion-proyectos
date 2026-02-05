import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  obtenerEmpleados(): Observable<any[]> {
  return this.http.get<any[]>(`${this.API_URL}/empleados`);
}

  obtenerDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/departamentos`);
  }

  crearDepartamento(departamento: any): Observable<any> {
    return this.http.post(`${this.API_URL}/departamentos`, departamento);
  }

  eliminarDepartamento(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/departamentos/${id}`);
  }
}
