import Swal from "sweetalert2";
import type { Reserva } from "../../interfaces/reserva";
import { cancelarReservaApi } from "../../helpers/queries";

interface ItemTablaReservaProps {
  reserva: Reserva;
  fila: number;
  setReservas: React.Dispatch<React.SetStateAction<Reserva[]>>;
  recargarReservas?: () => void;
}

const ItemTablaReserva = ({ reserva, fila, recargarReservas }: ItemTablaReservaProps) => {
  const nombreCancha =
    (reserva.cancha as any)?.nombreCancha ||
    (reserva.cancha as any)?.nombre ||
    "Cancha";

  const nombreCliente =
    reserva.nombreReserva ||
    (reserva.usuario as any)?.nombre ||
    (reserva.usuario as any)?.nombreUsuario ||
    "Cliente";

  const fecha = reserva.fechaJornada || reserva.fecha || reserva.fechaInicio || "-";

  const badgeEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "confirmada":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "pendiente":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "cancelada":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const handleCancelar = () => {
    Swal.fire({
      title: "¿Cancelar esta reserva?",
      text: `Se cancelará la reserva de ${nombreCliente} para el ${fecha} a las ${reserva.horaInicio} hs`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
      background: "#18181b",
      color: "#f4f4f5",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelarReservaApi(reserva._id);
          Swal.fire({
            title: "Cancelada",
            text: "La reserva fue cancelada exitosamente.",
            icon: "success",
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonColor: "#22c55e",
          });
          if (recargarReservas) recargarReservas();
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error.message || "No se pudo cancelar la reserva",
            icon: "error",
            background: "#18181b",
            color: "#f4f4f5",
          });
        }
      }
    });
  };

  return (
    <tr className="hover:bg-zinc-800/40 transition-colors">
      <td className="px-6 py-4 font-mono text-xs text-zinc-400">{fila}</td>
      <td className="px-6 py-4 font-medium text-white">{nombreCancha}</td>
      <td className="px-6 py-4 text-zinc-300">{nombreCliente}</td>
      <td className="px-6 py-4 text-zinc-300">{fecha}</td>
      <td className="px-6 py-4 font-mono text-zinc-200">{reserva.horaInicio} hs</td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${badgeEstado(
            reserva.estado
          )}`}
        >
          {reserva.estado === "confirmada" ? "Confirmada / Pagada" : reserva.estado}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {reserva.estado?.toLowerCase() !== "cancelada" ? (
          <button
            onClick={handleCancelar}
            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-xs font-semibold border border-rose-500/40 transition-all active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
        ) : (
          <span className="text-zinc-600 text-xs italic">Cancelada</span>
        )}
      </td>
    </tr>
  );
};

export default ItemTablaReserva;
