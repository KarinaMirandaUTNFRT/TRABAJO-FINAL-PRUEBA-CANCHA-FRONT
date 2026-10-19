import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ItemTablaReserva from "../services/itemTablaReservas";
import { listarReservasApiAdm } from "../../helpers/queries";
import type { Reserva } from "../../interfaces/reserva";



const AdmReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
 const [cargando, setCargando] = useState<boolean>(true);
 
  const cargarReservas = async (estado?: string) => {
try {
      setCargando(true);
     const params = estado && estado !== "todas" ? { estado } : undefined; 
     const respuestaReserva = await listarReservasApiAdm(params as any);

    if (respuestaReserva?.ok || respuestaReserva?.status === 200) {
      const data = await respuestaReserva.json();
      setReservas(data?.reservas ?? []);
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: `no se puede mostrar las reservas en este momento`,
        icon: "success",
        background: "#18181b",
          color: "#f4f4f5",
      });
    }
  }catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas(filtroEstado);
  }, [filtroEstado]);
 
  return (
    <section className="animate-fadeIn space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header con título y pestañas de filtro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-400/40 p-6 rounded-2xl border border-slate-300">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Administración Reservas
          </h1>
          <p className="text-zinc-200 text-sm">By RollingClub</p>
        </div>

        {/* Filtros de estado */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "todas", label: "Todas" },
            { id: "pendiente", label: "Pendientes (15 min)" },
            { id: "confirmada", label: "Confirmadas / Pagadas" },
            { id: "cancelada", label: "Canceladas" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltroEstado(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                filtroEstado === item.id
                  ? "bg-green-500 text-zinc-950 shadow-md shadow-green-500/30"
                  : "bg-zinc-900/80 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-700">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                #
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                Cancha
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                Cliente
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                Fecha
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold">
                Hora Inicio
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold text-center">
                Estado
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-400 font-bold text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {cargando ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 animate-pulse font-medium">
                  Cargando reservas...
                </td>
              </tr>
            ) : reservas.length > 0 ? (
              reservas.map((reserva, indice) => (
                <ItemTablaReserva
                  key={reserva._id}
                  reserva={reserva}
                  fila={indice + 1}
                  setReservas={setReservas}
                  recargarReservas={() => cargarReservas(filtroEstado)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-zinc-400 italic"
                >
                  No hay reservas registradas en este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdmReservas;
