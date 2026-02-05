import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { RouterLink } from '@angular/router';
import { ProyectosComponent } from './components/proyectos/proyectos';
import { LayoutComponent } from './layout/layout';
import { PresupuestosComponent } from './components/presupuesto/presupuesto';
import { ClientesComponent } from './components/clientes/clientes';
import { EmpleadosComponent } from './components/empleados/empleados';
import { GastosComponent } from './components/gastos/gastos';
import { ReportesComponent } from './components/reportes/reportes';
import { TareasComponent } from './components/tareas/tareas';
import { RecursosComponent } from './components/recursos/recursos';
import { AsignacionesComponent } from './components/asignaciones/asignaciones';


export const routes: Routes = [
  // Página inicial (home)
  { path: '', component: HomeComponent, pathMatch: 'full' },

  // Páginas sin layout
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Páginas dentro del layout (protegidas o internas)
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'presupuestos', component: PresupuestosComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'gastos', component: GastosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'tareas', component: TareasComponent },
      { path: 'recursos', component: RecursosComponent },
      { path: 'asignaciones', component: AsignacionesComponent },

      // aquí puedes agregar más rutas del sistema interno
    ]
  },

  // Cualquier otra ruta redirige al home
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

