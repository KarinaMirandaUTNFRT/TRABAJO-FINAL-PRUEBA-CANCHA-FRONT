import { Link } from "react-router";
import { LuTrash2, LuPencil } from "react-icons/lu";
import type { Reserva } from "../../interfaces/reserva";
import Swal from "sweetalert2";
import { borrarReservaApi } from "../../helpers/queries";

interface ItemReservaProps {
  reserva: Reserva;
  fila: number;
  setReservas: React.Dispatch<React.SetStateAction<Reserva[]>>;
}
const ItemTablaReserva = ({ reserva, fila, setReservas }: ItemReservaProps) => {
  const eliminarReserva = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No se puede revertir este proceso",
      icon: "warning",
      background: "#18181b",
      color: "#f4f4f5",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respuestaBorrarReserva = await borrarReservaApi(reserva._id);
        if (respuestaBorrarReserva && respuestaBorrarReserva.status === 200) {
          Swal.fire({
            title: "Eliminado",
            text: `El reserva fue eliminada correctamente`,
            icon: "success",
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonColor: "#3b82f6",
          });
          setReservas((prevReservas) =>
            prevReservas.filter((item) => item._id !== reserva._id),
          );
        }
      }
    });
  };
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">
        {fila}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-200">
        {reserva.nombreReserva}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-200">
        {reserva.fechaInicio}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
        $ {reserva.estado}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-3">
          <Link
            to={`/administrador/reservas/editar/${reserva._id}`}
            className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            Editar <LuPencil />
          </Link>
          <button
            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
            onClick={eliminarReserva}
          >
            Borrar <LuTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ItemTablaReserva;
