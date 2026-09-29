import type { Producto } from './productos';

export interface CarritoItem {
  _id: string;
  producto: Producto;
  cantidad: number;
}

export interface ICarrito {
  _id: string;
  usuario: string;
  items: CarritoItem[];
}

