import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Asignacion, AsignacionService } from '../../services/asignaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignaciones.html',
  styleUrls: ['./asignaciones.css'],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],

})

export class AsignacionesComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  empleados: any[] = [];
  tareas: any[] = [];
  asignacionForm!: FormGroup;
  cargando: boolean = false;


  constructor(
    private asignacionService: AsignacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDatos();
  }

  // Inicializa el formulario
  initForm(): void {
    this.asignacionForm = this.fb.group({
      empleadoid: ['', Validators.required],
      tareaid: ['', Validators.required],
      horasasignadas: ['', [Validators.required, Validators.min(1)]],
      fechaasignacion: ['', Validators.required]
    });
  }

  // Cargar asignaciones, empleados y tareas
  cargarDatos(): void {
    this.cargando = true;

    this.asignacionService.getAsignaciones().subscribe({
      next: (data) => (this.asignaciones = data),
      error: (err) => console.error('Error al obtener asignaciones', err),
      complete: () => (this.cargando = false)
    });

    this.asignacionService.obtenerEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: (err) => console.error('Error al obtener empleados', err)
    });

    this.asignacionService.obtenerTareas().subscribe({
      next: (data) => (this.tareas = data),
      error: (err) => console.error('Error al obtener tareas', err)
    });
  }

  // Agregar nueva asignación
  agregarAsignacion(): void {
    if (this.asignacionForm.invalid) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    const nuevaAsignacion: Asignacion = this.asignacionForm.value;

    this.asignacionService.addAsignacion(nuevaAsignacion).subscribe({
      next: () => {
        alert('Asignación agregada correctamente');
        this.asignacionForm.reset();
        this.cargarDatos();
      },
      error: (err) => console.error('Error al agregar asignación', err)
    });
  }

  // Eliminar una asignación
  eliminarAsignacion(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta asignación?')) {
      this.asignacionService.deleteAsignacion(id).subscribe({
        next: () => {
          alert('Asignación eliminada correctamente');
          this.cargarDatos();
        },
        error: (err) => console.error('Error al eliminar asignación', err)
      });
    }
  }
}
