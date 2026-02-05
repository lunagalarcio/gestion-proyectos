import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/clientes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css'],
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  clienteForm: FormGroup;
  cargando = false;

  // 🔥 Nuevo: proyectos del cliente seleccionado
  proyectosCliente: any[] = [];
  clienteSeleccionado: any = null;

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['', Validators.required],
      personaid: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.cargando = true;
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        this.cargando = false;
      }
    });
  }

  eliminarCliente(clienteid: number): void {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;

    this.clienteService.eliminarCliente(clienteid).subscribe({
      next: () => this.obtenerClientes(),
      error: (err) => console.error('Error al eliminar cliente:', err)
    });
  }

  // 🔥 Nuevo método: obtener proyectos de un cliente
  verProyectos(cliente: any): void {
    if (this.clienteSeleccionado === cliente) {
      // Si ya está seleccionado, ocultamos los proyectos
      this.clienteSeleccionado = null;
      this.proyectosCliente = [];
      return;
    }

    this.clienteSeleccionado = cliente;

    this.clienteService.obtenerProyectosPorCliente(cliente.clienteid).subscribe({
      next: (proyectos) => {
        this.proyectosCliente = proyectos;
      },
      error: (err) => {
        console.error('Error al obtener proyectos del cliente:', err);
      }
    });
  }
}
