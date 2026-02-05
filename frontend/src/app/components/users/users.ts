import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/users.interface';
import { UserService } from '../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  imports: [CommonModule],
  styleUrl: './users.css',
})
export class UsersComponent implements OnInit{
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

}
