import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private apiUrl = 'http://localhost:3000/api'; // 🔹 Ajusta si usas otro puerto

  constructor(private http: HttpClient) {}

  obtenerGastos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gastos`);
  }

  agregarGasto(gasto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/gastos`, gasto);
  }

  eliminarGasto(gastoid: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gastos/${gastoid}`);
  }

  obtenerGastosPorProyecto(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gastos/proyecto/${id}`);
  }
}
