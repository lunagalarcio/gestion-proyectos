import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { ProyectoService } from '../../services/proyectos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css'],
  providers: [ReporteService, ProyectoService],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],

})
export class ReportesComponent implements OnInit {
  reportes: any[] = [];
  proyectos: any[] = [];
  reporteForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private proyectoService: ProyectoService
  ) {
    this.reporteForm = this.fb.group({
      proyecto_id: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.obtenerReportes();
    this.obtenerProyectos();
  }

  obtenerReportes(): void {
    this.cargando = true;
    this.reporteService.obtenerReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener reportes:', err);
        this.cargando = false;
      }
    });
  }

  obtenerProyectos(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => this.proyectos = data,
      error: (err) => console.error('Error al obtener proyectos:', err)
    });
  }

  crearReporte(): void {
    if (this.reporteForm.invalid) return;

    this.reporteService.agregarReporte(this.reporteForm.value).subscribe({
      next: () => {
        this.obtenerReportes();
        this.reporteForm.reset();
      },
      error: (err) => console.error('Error al crear reporte:', err)
    });
  }

  eliminarReporte(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este reporte?')) return;

    this.reporteService.eliminarReporte(id).subscribe({
      next: () => this.obtenerReportes(),
      error: (err) => console.error('Error al eliminar reporte:', err)
    });
  }
}

