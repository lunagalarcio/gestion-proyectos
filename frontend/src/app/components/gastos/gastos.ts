import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GastoService } from '../../services/gastos.service';
import { ProyectoService } from '../../services/proyectos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.html',
  styleUrls: ['./gastos.css'],
  providers: [GastoService, ProyectoService],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],

})
export class GastosComponent implements OnInit {
  gastos: any[] = [];
  proyectos: any[] = [];
  gastoForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private gastoService: GastoService,
    private proyectoService: ProyectoService
  ) {
    this.gastoForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1)]],
      fecha: ['', Validators.required],
      proyectoid: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerGastos();
    this.obtenerProyectos();
  }

  obtenerGastos(): void {
    this.cargando = true;
    this.gastoService.obtenerGastos().subscribe({
      next: (data) => {
        this.gastos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener gastos:', err);
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

  agregarGasto(): void {
    if (this.gastoForm.invalid) return;

    this.gastoService.agregarGasto(this.gastoForm.value).subscribe({
      next: () => {
        this.obtenerGastos();
        this.gastoForm.reset();
      },
      error: (err) => console.error('Error al agregar gasto:', err)
    });
  }

  eliminarGasto(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este gasto?')) return;

    this.gastoService.eliminarGasto(id).subscribe({
      next: () => this.obtenerGastos(),
      error: (err) => console.error('Error al eliminar gasto:', err)
    });
  }
}

