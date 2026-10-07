export interface CategoriaProducto{
   _id: string;
  nombre: string; 
   descripcion: string;
}

export interface Producto {
  _id: string;
  nombreProducto: string;
  precio: number;
  imagen: string;
  categoria: CategoriaProducto ;
  descripcion: string;
}

export type ProductoFormData = Omit<Producto, '_id'>;