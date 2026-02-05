import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { DepartamentoService } from '../../services/departamentos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.html',
  styleUrls: ['./empleados.css'],
  providers: [EmpleadoService, DepartamentoService],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
})
export class EmpleadosComponent implements OnInit {
  empleados: any[] = [];
  departamentos: any[] = [];
  cargando = false;

  nuevoDepartamento = {
    nombredepartamento: '',
    jefe_departamento: ''
  };

  mostrarCrearDepartamento = false;

  constructor(
    private empleadoService: EmpleadoService,
    private departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.obtenerDepartamentos();
  }

  obtenerEmpleados(): void {
    this.cargando = true;
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener empleados:', err);
        this.cargando = false;
      }
    });
  }
eliminarEmpleado(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(id).subscribe({
        next: () => {
          alert('Empleado eliminado correctamente');
          this.obtenerEmpleados(); // recargar lista
        },
        error: (err) => {
          console.error('Error al eliminar empleado:', err);
          alert('No se pudo eliminar el empleado');
        },
      });
    }
  }
  obtenerDepartamentos(): void {
    this.departamentoService.obtenerDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (err) => {
        console.error('Error al obtener departamentos:', err);
      }
    });
  }

  crearDepartamento(): void {
    if (!this.nuevoDepartamento.nombredepartamento.trim()) return;

    this.departamentoService.crearDepartamento(this.nuevoDepartamento).subscribe({
      next: (res) => {
        alert('Departamento creado correctamente');
        this.nuevoDepartamento = { nombredepartamento: '', jefe_departamento: '' };
        this.obtenerDepartamentos();
      },
      error: (err) => console.error('Error al crear departamento:', err)
    });
  }

  eliminarDepartamento(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este departamento?')) {
      this.departamentoService.eliminarDepartamento(id).subscribe({
        next: () => {
          alert('Departamento eliminado correctamente');
          this.obtenerDepartamentos();
        },
        error: (err) => {
          console.error('Error al eliminar departamento:', err);
          alert('No se pudo eliminar el departamento');
        }
      });
    }
  }
}
