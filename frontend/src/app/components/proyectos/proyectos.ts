import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyectos.service';
import { Proyecto } from '../../interfaces/proyectos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../services/clientes.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.css'],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  clientes: any[] = [];
  proyectoForm: FormGroup;
  cargando = false;

  constructor(
    private proyectoService: ProyectoService,
    private clienteService: ClienteService, // ← Agregado
    private fb: FormBuilder
  ) {
    // Formulario reactivo
    this.proyectoForm = this.fb.group({
      nombreproyecto: ['', Validators.required],
      fechainicio: ['', Validators.required],
      fechafin: ['', Validators.required],
      clienteid: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerProyectos();
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al obtener clientes', err)
    });
  }

  obtenerProyectos(): void {
    this.cargando = true;
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener proyectos:', err);
        this.cargando = false;
      }
    });
  }

  crearProyecto(): void {
    if (this.proyectoForm.invalid) return;

    const nuevoProyecto: Proyecto = this.proyectoForm.value;

    this.proyectoService.crearProyecto(nuevoProyecto).subscribe({
      next: (proyectoCreado) => {
        alert('Proyecto creado correctamente');

        // Buscar el nombre del cliente y agregarlo al proyecto
        const cliente = this.clientes.find(c => c.clienteid === proyectoCreado.clienteid);
        if (cliente) {
          proyectoCreado.cliente = cliente.nombre;
        }

        this.proyectoForm.reset();
        this.proyectos.push(proyectoCreado);
      },
      error: (err) => {
        console.error('Error al crear proyecto:', err);
        alert('Error al crear el proyecto');
      }
    });
  }

  eliminarProyecto(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este proyecto?')) return;

    this.proyectoService.eliminarProyecto(id).subscribe({
      next: () => {
        this.proyectos = this.proyectos.filter(p => p.proyectoid !== id);
        alert('Proyecto eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar proyecto:', err);
        alert('No se pudo eliminar el proyecto');
      }
    });
  }
}
