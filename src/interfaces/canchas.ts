export interface CategoriaCancha{
   _id: string;
  nombre: string; 
   descripcion: string;
}

export interface Cancha {
  _id: string;
  nombreCancha: string;
  precio: number;
  imagen: string;
  categoria: CategoriaCancha ;
  descripcion: string;
}

export type CanchaFormData = Omit<Cancha, '_id'>;