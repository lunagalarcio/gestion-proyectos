import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proyecto {
  proyectoid: number;
  nombreproyecto: string;
  fechainicio: string;
  fechafin: string;
  clienteid: number;
  cliente: string;
}

export interface Empleado {
  empleadoid: number;
  nombre: string;
  nombredepartamento: string;
}

export interface Cliente {
  clienteid: number;
  nombre: string;
  contacto: string;
}

export interface Recurso {
  recursoid: number;
  nombrerecurso: string;
  tiporecurso: string;
  cantidaddisponible: number;
  nombreproyecto: string;
  proyectoid: number;
}

export interface Tarea {
  tareaid: number;
  nombretarea: string;
  fechainicio: string;
  fechafin: string;
  tipotarea: string;
  nombreproyecto: string;
}

export interface Presupuesto {
  presupuestoid: number;
  monto: number;
  proyectoid: number;
  nombreproyecto: string;
}

export interface Gasto {
  gastoid: number;
  monto: number;
  fecha: string;
  nombreproyecto: string;
}

export interface DashboardData {
  proyectos: Proyecto[];
  empleados: Empleado[];
  clientes: Cliente[];
  recursos: Recurso[];
  tareas: Tarea[];
  presupuestos: Presupuesto[];
  gastos: Gasto[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.apiUrl}/proyectos`);
  }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`);
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  getRecursos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.apiUrl}/recursos`);
  }

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/tareas`);
  }

  getPresupuestos(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.apiUrl}/presupuestos`);
  }

  getGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}/gastos`);
  }

  getAllData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }
}
