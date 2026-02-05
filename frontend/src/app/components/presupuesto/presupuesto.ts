import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PresupuestoService, Presupuesto } from '../../services/presupuesto.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuesto.html',
  styleUrls: ['./presupuesto.css'],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],

})
export class PresupuestosComponent implements OnInit {
  presupuestoForm!: FormGroup;
  presupuestos: Presupuesto[] = [];
  proyectos: any[] = [];
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private presupuestoService: PresupuestoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarPresupuestos();
    this.cargarProyectos();
  }

  inicializarFormulario(): void {
    this.presupuestoForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1)]],
      proyectoid: ['', Validators.required]
    });
  }

  // 🧾 Agregar nuevo presupuesto
  agregarPresupuesto(): void {
    if (this.presupuestoForm.invalid) return;

    const nuevoPresupuesto: Presupuesto = this.presupuestoForm.value;

    this.presupuestoService.addPresupuesto(nuevoPresupuesto).subscribe({
      next: (res) => {
        alert('Presupuesto agregado exitosamente');
        this.presupuestoForm.reset();
        this.cargarPresupuestos();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Error al agregar presupuesto');
      }
    });
  }

  // 📋 Cargar todos los presupuestos
  cargarPresupuestos(): void {
    this.cargando = true;
    this.presupuestoService.getPresupuestos().subscribe({
      next: (data) => {
        this.presupuestos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar presupuestos', err);
        this.cargando = false;
      }
    });
  }

  // 🔽 Cargar proyectos (para el select)
  cargarProyectos(): void {
    this.http.get<any[]>('http://localhost:3000/api/proyectos').subscribe({
      next: (data) => this.proyectos = data,
      error: (err) => console.error('Error al cargar proyectos', err)
    });
  }
}
