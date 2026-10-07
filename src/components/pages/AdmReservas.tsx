import ItemTablaReserva from "../services/itemTablaReservas";
import { listarReservasApiAdm } from "../../helpers/queries";
import type { Reserva } from "../../interfaces/reserva";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdmReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    cargarReservas();
  }, []);
  const cargarReservas = async () => {
    const respuestaReserva = await listarReservasApiAdm();

    if (respuestaReserva && respuestaReserva.status === 200) {
      const data = await respuestaReserva.json();
      setReservas(data.reservas);
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: `no se puede mostrar las reservas en este momento`,
        icon: "success",
      });
    }
  };
  return (
    <section className="animate-fadeIn space-y-6">
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-400/40 p-6 rounded-2xl border border-slate-300">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Administración Reservas
          </h1>
          <p className="text-zinc-500 text-sm">By RollingClub</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-slate-400">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Codigo Reserva
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Fecha
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Hora Inicio
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                Cliente
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-400">
            {reservas.length > 0 ? (
              reservas.map((Reserva, indice) => (
                <ItemTablaReserva
                  key={Reserva._id}
                  reserva={Reserva}
                  fila={indice + 1}
                  setReservas={setReservas}
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

export default AdmReservas;
