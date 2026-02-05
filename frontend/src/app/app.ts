import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersComponent } from "./components/users/users";
import { RegisterComponent } from "./components/register/register";
import { LoginComponent } from "./components/login/login";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [UsersComponent, RegisterComponent, LoginComponent, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
