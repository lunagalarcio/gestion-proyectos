import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
correo = '';
  password = '';
  mensaje = '';

  constructor(private loginService: LoginService, private router: Router) {}

 onSubmit() {
    this.loginService.login(this.correo, this.password).subscribe({
      next: (res: any) => {
        console.log('Inicio de sesión exitoso', res);
        alert('Inicio de sesión exitoso');


        this.router.navigate(['/proyectos']);

        this.mensaje = res.message || 'Inicio de sesión exitoso';
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = err.error.error || 'Error al iniciar sesión';
        alert('Error al iniciar sesión');
      },
    });
  }
}
