import ItemTablaProducto from "../services/ItemTablaProducto";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from "react-router";
import { listarProductosApi } from "../../helpers/queries";
import type { Producto } from "../../interfaces/productos";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdmProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  useEffect(() => {
    cargarProductos();
  }, []);
  const cargarProductos = async () => {
    const respuestaProducto = await listarProductosApi();
    if (respuestaProducto && respuestaProducto.status === 200) {
      const data = await respuestaProducto.json();
      setProductos(data.productos);
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: `no se puede mostrar las canchas en este momento`,
        icon: "success",
      });
    }
  };
  return (
    <section className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-400/40 p-6 rounded-2xl border border-slate-300">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Administración Productos
          </h1>
          <p className="text-zinc-500 text-sm">By RollingClub</p>
        </div>
        <Link
          to={"/administrador/productos/crear"}
          className="bg-green-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-center  flex
           items-center gap-1"
        >
          <LuCirclePlus />
          Agregar Producto
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-slate-400">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Item
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Producto
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Descripcion
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                precio
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-400">
            {productos.length > 0 ? (
              productos.map((Producto, indice) => (
                <ItemTablaProducto
                  key={Producto._id}
                  producto={Producto}
                  fila={indice + 1}
                  setProductos={setProductos}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-zinc-500 italic"
                >
                  No hay canchas registradas para administrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdmProductos;
