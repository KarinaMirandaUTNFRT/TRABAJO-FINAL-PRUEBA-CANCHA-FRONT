export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: "admin" | "cliente"; 
}
export interface Cancha {
  _id: string;
  nombreCancha: string;
  precio: number;
  imagen: string;
  categoria: CategoriaCancha ;
  descripcion: string;
}
export interface CategoriaCancha{
   _id: string;
  nombre: string; 
   descripcion: string;
}

export interface Reserva {
  _id: string;
  nombreCliente?: string;
  nombreReserva?: string;
  usuario: Usuario;
  cancha: Cancha;
  fechaJornada?: string;
  fechaInicio?: string;
  fecha?: string;
  horaInicio: string;
  estado: string;
}

export type  ReservaFormData = Omit<Reserva, '_id'>;