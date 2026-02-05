export interface Proyecto {
  proyectoid?: number;
  nombreproyecto: string;
  fechainicio: string;
  fechafin: string;
  clienteid: number;
  cliente?: string; // opcional, para mostrar nombre del cliente
}
