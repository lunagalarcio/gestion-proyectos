import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardEstadisticas {
  totalProyectos: number;
  proyectosActivos: number;
  proyectosFinalizados: number;
  presupuestoTotal: number;
  presupuestoUsado: number;
  totalEmpleados: number;
  totalClientes: number;
  totalTareas: number;
  proyectosProximos: any[];
  ultimosProyectos: any[];
  presupuestoPorProyecto: any[];
  proyectosPorMes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEstadisticas(): Observable<DashboardEstadisticas> {
    return this.http.get<DashboardEstadisticas>(`${this.apiUrl}/dashboard/estadisticas`);
  }

  getPresupuestoGrafico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/presupuesto-grafico`);
  }
}
