import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api'; // 🔹 Ajusta el puerto según tu backend

  constructor(private http: HttpClient) {}

  obtenerClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`);
  }

  agregarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  eliminarCliente(clienteid: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${clienteid}`);
  }
  obtenerProyectosPorCliente(clienteId: number) {
  return this.http.get<any[]>(`${this.apiUrl}/clientes/${clienteId}/proyectos`);
}

}
