import type { Cancha } from "../../interfaces/canchas";
import Swal from "sweetalert2";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { Link } from "react-router";
import { borrarCanchaApi } from "../../helpers/queries";

interface ItemTablaCanchaProps {
  cancha: Cancha;
  fila: number;
  setCanchas: React.Dispatch<React.SetStateAction<Cancha[]>>;
}

const ItemTablaCanchas = ({
  cancha,
  fila,
  setCanchas,
}: ItemTablaCanchaProps) => {
  const eliminarCancha = () => {
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
        const respuesta = await borrarCanchaApi(cancha._id);
        if (respuesta && respuesta.status === 200) {
          setCanchas((prevCanchas) =>
            prevCanchas.filter((item) => item._id !== cancha._id),
          );
          Swal.fire({
            title: "Eliminado",
            text: `la cancha fue eliminada correctamente`,
            icon: "success",
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonColor: "#3b82f6",
          });
        } else {
          Swal.fire({
            title: "Ocurrio un error",
            text: `La cancha no fue eliminada `,
            icon: "error",
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonColor: "#3b82f6",
          });
        }
      }
    });
  };

  return (
    <tr className="border-b border-slate-400 hover:bg-slate-400/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">
        {fila}
      </td>
      <div className="flex items-center gap-3">
        <img
          src={cancha.imagen}
          alt={`${cancha.nombreCancha} avatar`}
          className="w-9 h-9 rounded-full shrink-0"
        />
        <div className="flex flex-col">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">
            {cancha.nombreCancha}
          </td>
        </div>
      </div>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
        {cancha.categoria.nombre}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
        {cancha.precio}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-3">
          <Link
            to={`/administrador/canchas/editar/${cancha._id}`}
            className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            Editar <LuPencil />
          </Link>
          <button
            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
            onClick={eliminarCancha}
          >
            Borrar <LuTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ItemTablaCanchas;
