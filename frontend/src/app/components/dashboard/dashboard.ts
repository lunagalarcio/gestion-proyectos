import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashboardService, Proyecto, Presupuesto, Gasto, Tarea, Recurso, Empleado, Cliente } from '../../services/dashboard.service';

interface DashboardStats {
  totalProyectos: number;
  proyectosActivos: number;
  proyectosFinalizados: number;
  proyectosProximosVencer: number;
  totalPresupuesto: number;
  totalGastado: number;
  presupuestoRestante: number;
  totalEmpleados: number;
  totalClientes: number;
  totalTareas: number;
  totalRecursos: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProyectos: 0,
    proyectosActivos: 0,
    proyectosFinalizados: 0,
    proyectosProximosVencer: 0,
    totalPresupuesto: 0,
    totalGastado: 0,
    presupuestoRestante: 0,
    totalEmpleados: 0,
    totalClientes: 0,
    totalTareas: 0,
    totalRecursos: 0
  };

  proyectosRecientes: Proyecto[] = [];
  proyectosProximos: Proyecto[] = [];
  cargando = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    forkJoin({
      proyectos: this.dashboardService.getProyectos(),
      presupuestos: this.dashboardService.getPresupuestos(),
      gastos: this.dashboardService.getGastos(),
      tareas: this.dashboardService.getTareas(),
      recursos: this.dashboardService.getRecursos(),
      empleados: this.dashboardService.getEmpleados(),
      clientes: this.dashboardService.getClientes()
    }).subscribe({
      next: (data) => {
        this.calcularEstadisticas(data);
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar datos del dashboard:', err);
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas(data: {
    proyectos: Proyecto[];
    presupuestos: Presupuesto[];
    gastos: Gasto[];
    tareas: Tarea[];
    recursos: Recurso[];
    empleados: Empleado[];
    clientes: Cliente[]
  }) {
    const hoy = new Date();
    const treintaDias = new Date();
    treintaDias.setDate(hoy.getDate() + 30);

    const proyectosActivos = data.proyectos.filter(p => {
      const fin = new Date(p.fechafin);
      return fin >= hoy;
    });

    const proyectosFinalizados = data.proyectos.filter(p => {
      const fin = new Date(p.fechafin);
      return fin < hoy;
    });

    const proyectosProximosVencer = data.proyectos.filter(p => {
      const fin = new Date(p.fechafin);
      return fin >= hoy && fin <= treintaDias;
    }).slice(0, 5);

    const totalPresupuesto = data.presupuestos.reduce((sum, p) => sum + Number(p.monto), 0);
    const totalGastado = data.gastos.reduce((sum, g) => sum + Number(g.monto), 0);

    this.stats = {
      totalProyectos: data.proyectos.length,
      proyectosActivos: proyectosActivos.length,
      proyectosFinalizados: proyectosFinalizados.length,
      proyectosProximosVencer: proyectosProximosVencer.length,
      totalPresupuesto: totalPresupuesto,
      totalGastado: totalGastado,
      presupuestoRestante: totalPresupuesto - totalGastado,
      totalEmpleados: data.empleados.length,
      totalClientes: data.clientes.length,
      totalTareas: data.tareas.length,
      totalRecursos: data.recursos.length
    };

    this.proyectosRecientes = [...data.proyectos]
      .sort((a, b) => new Date(b.fechainicio).getTime() - new Date(a.fechainicio).getTime())
      .slice(0, 5);

    this.proyectosProximos = proyectosProximosVencer;
  }
}
