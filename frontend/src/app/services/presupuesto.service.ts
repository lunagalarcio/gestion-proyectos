import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Presupuesto {
  presupuestoid?: number;
  monto: number;
  proyectoid: number;
  nombreproyecto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private apiUrl = 'http://localhost:3000/api/presupuestos';

  constructor(private http: HttpClient) {}

  // 🧾 Crear un nuevo presupuesto
  addPresupuesto(presupuesto: Presupuesto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, presupuesto);
  }

  // 📋 Listar todos los presupuestos
  getPresupuestos(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.apiUrl}`);
  }

  // 🔍 Obtener presupuesto por proyecto
  getPresupuestoPorProyecto(proyectoid: number): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${this.apiUrl}/proyecto/${proyectoid}`);
  }


}
