import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import type { Producto } from "../../interfaces/productos";
import { buscarProductoApi } from "../../helpers/queries";

const DetalleProducto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarProducto = async () => {
      if (!id) return;
      try {
        setCargando(true);
        const respuesta = await buscarProductoApi(id);
        if (respuesta.ok) {
          const dato = await respuesta.json();
          setProducto(dato);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró el producto solicitado",
          }).then(() => navigate("/productos"));
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al obtener los datos del servidor",
        });
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id, navigate]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <p className="text-lg font-semibold animate-pulse">
          Cargando detalle...
        </p>
      </div>
    );
  }

  if (!producto) {
    return null;
  }

  const nombreCategoria =
    typeof producto.categoria === "object"
      ? (producto.categoria as any)?.nombre
      : producto.categoria;

  return (
    <main className="min-h-[85vh] bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-wide">
          {producto.nombreProducto}
        </h1>
        <div className="w-full h-64 sm:h-80 bg-zinc-800/60 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
          <img
            src={producto.imagen}
            alt={producto.nombreProducto}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://res.cloudinary.com/ddhyg9uee/image/upload/v1788274566/rollingclub_nohrp6.png";
            }}
          />
        </div>
        <div className="space-y-3 mb-6 text-base sm:text-lg">
          <p>
            <span className="font-semibold text-zinc-100">Precio: </span>
            <span className="text-zinc-300 font-mono">
              ${Number(producto.precio).toLocaleString("es-AR")}
            </span>
          </p>

          <p>
            <span className="font-semibold text-zinc-100">Categoría: </span>
            <span className="text-zinc-300 capitalize">
              {nombreCategoria || "Sin categoría"}
            </span>
          </p>

          <p>
            <span className="font-semibold text-zinc-100">Descripción: </span>
            <span className="text-zinc-300 font-light">
              {producto.descripcion}
            </span>
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer text-sm shadow-sm"
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;
