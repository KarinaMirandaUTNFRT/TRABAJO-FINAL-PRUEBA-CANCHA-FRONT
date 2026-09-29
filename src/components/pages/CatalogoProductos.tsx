import CardProducto from "../services/CardProducto";
import { NavLink } from "react-router";
import { useEffect, useState, type FormEvent } from "react";
import { listarProductosApi } from "../../helpers/queries";
import type { Producto } from "../../interfaces/productos";

// 1. Creamos el Skeleton basado en el diseño de tus tarjetas blancas
const SkeletonCardProducto = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col w-full border border-zinc-200">
    {/* Imagen */}
    <div className="h-48 bg-zinc-200 w-full"></div>
    <div className="p-5 flex flex-col flex-grow">
      {/* Título y categoría */}
      <div className="h-6 bg-zinc-200 rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-zinc-200 rounded-md w-1/2 mb-4"></div>
      
      {/* Línea divisoria */}
      <div className="border-t border-dashed border-zinc-300 my-4"></div>
      
      {/* Precio */}
      <div className="h-3 bg-zinc-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-zinc-200 rounded-md w-1/3 mb-4"></div>
      
      {/* Input de cantidad y botón Agregar */}
      <div className="flex gap-2 mb-3">
        <div className="h-10 w-16 bg-zinc-200 rounded-lg"></div>
        <div className="h-10 flex-grow bg-emerald-200 rounded-lg"></div>
      </div>
      
      {/* Botón Ver Detalle */}
      <div className="h-10 w-full bg-blue-200 rounded-lg"></div>
    </div>
  </div>
);

const Inicio = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [termino, setTermino] = useState("");
  const [filtro, setFiltro] = useState("");
  // 2. Agregamos el estado de carga
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const cantProductos = 8;

  useEffect(() => {
    cargarProductos(paginaActual, filtro);
  }, [paginaActual, filtro]);

  const cargarProductos = async (
    paginaNumero: number,
    terminoFiltro: string,
  ) => {
    try {
      setIsLoading(true); // Iniciamos la carga
      const respuestaProductos = await listarProductosApi({
        pagina: paginaNumero,
        limite: cantProductos,
        termino: terminoFiltro || undefined,
      });

      if (respuestaProductos.ok) {
        const datos = await respuestaProductos.json();
        setProductos(datos.productos ?? []);
        setCantidadProductos(datos.cantidadProductos ?? 0);
        setTotalPaginas(datos.totalPaginas ?? 1);

        if (
          typeof datos.paginaActual === "number" &&
          datos.paginaActual !== paginaNumero
        ) {
          setPaginaActual(datos.paginaActual);
        }
      } else {
        setProductos([]);
        setCantidadProductos(0);
        setTotalPaginas(1);
      }
    } catch (error) {
      console.error(error);
      setProductos([]);
      setCantidadProductos(0);
      setTotalPaginas(1);
    } finally {
      setIsLoading(false); // 3. Descomentado y activado al finalizar
    }
  };

  const handleBuscar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaginaActual(1);
    setFiltro(termino.trim());
  };

  const handleLimpiarFiltro = () => {
    setTermino("");
    setFiltro("");
    setPaginaActual(1);
  };

  const cambiarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas || pagina === paginaActual) return;
    setPaginaActual(pagina);
  };

  return (
    <section className="space-y-8 animate-fadeIn px-10 my-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight text-center md:text-start">
            Catálogo de <span className="text-green-500">Productos</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm text-center md:text-start">
            Agrega los productos que quieras al carrito y luego termina tu
            compra
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            Página {paginaActual} de {totalPaginas}
          </div>
        </div>
        <NavLink
          to="/"
          className={
            "bg-green-500 hover:bg-green-600 transition text-l py-2 px-3 rounded-2xl font-bold cursor-pointer text-center md:text-start"
          }
        >
          Volver al juego ⚽
        </NavLink>
        <form
          onSubmit={handleBuscar}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <label className="sr-only" htmlFor="buscador-productos">
            Buscar productos
          </label>
          <input
            id="buscador-productos"
            type="text"
            value={termino}
            onChange={(event) => setTermino(event.target.value)}
            placeholder="Buscar por nombre, categoría o descripción"
            className="w-full sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Buscar
          </button>
          {filtro && (
            <button
              type="button"
              onClick={handleLimpiarFiltro}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Limpiar filtro
            </button>
          )}
        </form>
      </div>

      {/* 4. Lógica de renderizado condicional para el Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Renderiza 8 Skeletons mientras está cargando
          Array.from({ length: cantProductos }).map((_, index) => (
            <SkeletonCardProducto key={`skeleton-${index}`} />
          ))
        ) : productos.length === 0 ? (
          // Mensaje si no hay resultados
          <div className="col-span-full text-center py-12 text-zinc-400 bg-zinc-900 rounded-xl border border-zinc-800">
            No se encontraron productos que coincidan con tu búsqueda.
          </div>
        ) : (
          // Renderiza las tarjetas reales
          productos.map((producto) => (
            <CardProducto key={producto._id} producto={producto} />
          ))
        )}
      </div>

      {(totalPaginas > 1 || cantidadProductos > cantProductos) && !isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <div className="text-sm text-zinc-400">
            Mostrando {productos.length} de {cantidadProductos} resultados
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={paginaActual === 1}
              onClick={() => cambiarPagina(paginaActual - 1)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white"
            >
              Anterior
            </button>

            <span className="px-3 py-2 text-sm text-zinc-400">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              type="button"
              disabled={paginaActual === totalPaginas}
              onClick={() => cambiarPagina(paginaActual + 1)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Inicio;