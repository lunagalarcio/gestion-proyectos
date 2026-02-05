import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecursoService } from '../../services/recurso.service';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../services/proyectos.service';
@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.html',
  styleUrls: ['./recursos.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
})
export class RecursosComponent implements OnInit {

  recursoForm!: FormGroup;
  recursos: any[] = [];
  proyectos: any[] = [];
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private recursoService: RecursoService,
    private proyectoService: ProyectoService
  ) {
    this.recursoForm = this.fb.group({
      nombrerecurso: ['', Validators.required],
      tiporecurso: ['', Validators.required],
      cantidaddisponible: ['', [Validators.required, Validators.min(1)]],
      proyectoid: ['', Validators.required],
      tipomaterial: [''],
      cantidad: [''],
      tipoequipo: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerRecursos();
    this.obtenerProyectos();
  }

  obtenerRecursos(): void {
    this.cargando = true;
    this.recursoService.obtenerRecursos().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener recursos:', err);
        this.cargando = false;
      }
    });
  }

  obtenerProyectos(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => (this.proyectos = data),
      error: (err) => console.error('Error al obtener proyectos:', err)
    });
  }

  crearRecurso(): void {
    if (this.recursoForm.invalid) return;

    this.recursoService.crearRecurso(this.recursoForm.value).subscribe({
      next: (res) => {
        alert('Recurso agregado exitosamente');
        this.recursoForm.reset();
        this.obtenerRecursos();
      },
      error: (err) => console.error('Error al crear recurso:', err)
    });
  }

  eliminarRecurso(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este recurso?')) return;

    this.recursoService.eliminarRecurso(id).subscribe({
      next: () => {
        alert('Recurso eliminado');
        this.obtenerRecursos();
      },
      error: (err) => console.error('Error al eliminar recurso:', err)
    });
  }
}

