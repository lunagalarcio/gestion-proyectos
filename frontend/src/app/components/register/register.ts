import { Component } from '@angular/core';
import { User } from '../../interfaces/users.interface';
import { RegisterService } from '../../services/register.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Departamento {
  departamentoid?: number;
  nombredepartamento: string;
  jefedepartamento: string;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
    user: User = {
      nombre: '',
      correo: '',
      telefono: '',
      tipo_persona: '',
      password: '',
      personaid: 0
    };
    departamentos: Departamento[] = [];


  constructor(private registerService: RegisterService) {}

  ngOnInit(): void {
    this.cargarDepartamentos();
  }
  cargarDepartamentos() {
    this.registerService.getDepartamentos().subscribe({
      next: (data) => (this.departamentos = data),
      error: (err) => console.error('Error al obtener departamentos:', err)
    });
  }

  registrarUsuario() {
    this.registerService.registerUser(this.user).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        alert('Usuario registrado con éxito');
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Error al registrar el usuario');
      }
    });
  }

}
