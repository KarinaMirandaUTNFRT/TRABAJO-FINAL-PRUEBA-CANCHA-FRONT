import { Link } from "react-router";
import ItemTablaCanchas from "../services/ItemTablaCanchas";
import { LuCirclePlus } from "react-icons/lu";
import { listarCanchasApi } from "../../helpers/queries";
import type { Cancha } from "../../interfaces/canchas";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Administrador = () => {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
const cargarCanchas = async () => {
    try {
      // Usamos "as any" para evitar el error de tipo unknown provocado por httpClient
      const respuesta = (await listarCanchasApi()) as any;

      let lista: Cancha[] = [];

      if (Array.isArray(respuesta)) {
        lista = respuesta;
      } else if (respuesta && typeof respuesta === "object") {
        lista = 
          respuesta.canchas || 
          respuesta.data?.canchas || 
          respuesta.data || 
          respuesta.lista || 
          respuesta.items || 
          [];
      }

      setCanchas(lista);
    } catch (error) {
      console.error("Error al cargar las canchas:", error);
      Swal.fire({
        title: "Ocurrió un error",
        text: "No se puede mostrar las canchas en este momento",
        icon: "error",
      });
    }
  };
  useEffect(() => {
    cargarCanchas();
  }, []);
    return (
    <section className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-400/40 p-6 rounded-2xl border border-slate-300">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Administración Canchas
          </h1>
          <p className="text-zinc-500 text-sm">By RollingClub</p>
        </div>
        <Link
          to={"/administrador/canchas/crear"}
          className="bg-green-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-center flex items-center gap-1"
        >
          <LuCirclePlus />
          Agregar Cancha
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-zinc-800">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Item
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Cancha
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Tipo Cancha
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                Precio
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {canchas.length > 0 ? (
              canchas.map((cancha, indice) => (
                <ItemTablaCanchas
                  key={cancha._id}
                  cancha={cancha}
                  fila={indice + 1}
                  setCanchas={setCanchas}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
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

export default Administrador;