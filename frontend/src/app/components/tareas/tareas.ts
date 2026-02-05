import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../services/tarea.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../services/proyectos.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.html',
  styleUrls: ['./tareas.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
})
export class TareasComponent implements OnInit {

  tareaForm!: FormGroup;
  tareas: any[] = [];
  proyectos: any[] = [];
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService,
    private proyectoService: ProyectoService
  ) {
    this.tareaForm = this.fb.group({
      nombretarea: ['', Validators.required],
      fechainicio: ['', Validators.required],
      fechafin: ['', Validators.required],
      proyectoid: ['', Validators.required],
      impacto: [''],
      riesgo: [''],
      beneficio: [''],
      tipotarea: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerTareas();
    this.obtenerProyectos();
  }

  obtenerTareas(): void {
    this.cargando = true;
    this.tareaService.obtenerTareas().subscribe({
      next: (data) => {
        this.tareas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener tareas', err);
        this.cargando = false;
      }
    });
  }

  obtenerProyectos(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => this.proyectos = data,
      error: (err) => console.error('Error al obtener proyectos', err)
    });
  }

  crearTarea(): void {
    if (this.tareaForm.invalid) return;

    this.tareaService.crearTarea(this.tareaForm.value).subscribe({
      next: (res) => {
        alert('Tarea registrada con éxito');
        this.tareaForm.reset();
        this.obtenerTareas();
      },
      error: (err) => {
        console.error('Error al crear tarea', err);
        alert(err.error?.error || 'Error al crear tarea');
      }
    });
  }

  eliminarTarea(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;

    this.tareaService.eliminarTarea(id).subscribe({
      next: () => {
        alert('Tarea eliminada');
        this.obtenerTareas();
      },
      error: (err) => console.error('Error al eliminar tarea', err)
    });
  }
}
