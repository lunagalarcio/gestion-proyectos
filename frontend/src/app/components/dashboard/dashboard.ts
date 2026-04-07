import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardEstadisticas } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  estadisticas: DashboardEstadisticas | null = null;
  cargando = true;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.dashboardService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'Error al cargar los datos';
        this.cargando = false;
      }
    });
  }

  get presupuestoRestante(): number {
    if (!this.estadisticas) return 0;
    return this.estadisticas.presupuestoTotal - this.estadisticas.presupuestoUsado;
  }

  get porcentajeUsado(): number {
    if (!this.estadisticas || this.estadisticas.presupuestoTotal === 0) return 0;
    return Math.round((this.estadisticas.presupuestoUsado / this.estadisticas.presupuestoTotal) * 100);
  }

  get proyectosActivosPorcentaje(): number {
    if (!this.estadisticas || this.estadisticas.totalProyectos === 0) return 0;
    return Math.round((this.estadisticas.proyectosActivos / this.estadisticas.totalProyectos) * 100);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  diasRestantes(fechafin: string): number {
    const fin = new Date(fechafin);
    const hoy = new Date();
    const diff = fin.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
