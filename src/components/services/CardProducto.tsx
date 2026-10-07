import { GiShoppingCart } from "react-icons/gi";
import type { Producto } from "../../interfaces/productos";
import { useState, memo } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAppContext } from "../../context/AppContext";
import { agregarAlCarritoApi } from "../../helpers/queries";

interface CardProductoProps {
  producto: Producto;
}

const CardProducto = ({ producto }: CardProductoProps) => {
  const { usuarioLogueado, refreshCarritoCount } = useAppContext();
  const [cantidad, setCantidad] = useState<number>(1);
  const [cargando, setCargando] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAgregar = async () => {
    if (cantidad < 1) return;

    if (!usuarioLogueado) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito",
        confirmButtonColor: "#059669",
      });
      navigate("/login");
      return;
    }

    const idProducto = String(producto._id || (producto as any).id);

    try {
      setCargando(true);
      const resp = await agregarAlCarritoApi(idProducto, cantidad);

      if (!resp.ok) {
        throw new Error("No se pudo agregar al carrito");
      }

      if (refreshCarritoCount) {
        await refreshCarritoCount();
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${cantidad}x ${producto.nombreProducto} agregado`,
        showConfirmButton: false,
        timer: 1500,
        background: "#18181b",
        color: "#f4f4f5",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto al carrito",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border-b-4 border-green-600 hover:shadow-2xl transition-shadow duration-300 relative flex flex-col">
      <div className="relative h-52 w-full bg-white flex justify-center">
        <img
          src={producto.imagen}
          alt={`Imagen de la cancha ${producto.nombreProducto}`}
          className="h-full object-contain p-2"
          onError={(e) => {
            e.currentTarget.src =
              "https://res.cloudinary.com/ddhyg9uee/image/upload/v1788274566/rollingclub_nohrp6.png";
          }}
        />
        <div className="absolute top-3 right-3 bg-linear-to-r from-green-500 to-green-700 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-white/20">
          {producto.categoria.nombre}
        </div>
      </div>
      <div className="p-5 flex flex-col grow">
        <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-2">
          {producto.nombreProducto}
        </h3>

        <p className="text-slate-600 text-sm mb-6 line-clamp-3">
          {producto.descripcion}
        </p>
        <div className="border-t-2 border-dashed border-green-200 pt-4 mt-auto flex flex-col gap-3">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Precio
            </span>
            <span className="text-2xl font-black text-green-600 flex items-start">
              <span className="text-lg mt-0.5 mr-1">$</span>

              {Number(producto.precio).toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              max="99"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
              className="w-16 bg-slate-100 text-slate-900 font-bold text-center py-2.5 px-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAgregar}
              disabled={cargando}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <GiShoppingCart className="text-lg" />
              <span>{cargando ? "Agregando..." : "Agregar"}</span>
            </button>
          </div>
          <Link
            to={`/productos/detalle/${producto._id}`}
            className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(CardProducto);
