import CardProducto from "../services/CardProducto";
import { NavLink } from "react-router";
import { useEffect, useState, useCallback, memo, type SubmitEvent, type ChangeEvent } from "react";
import { listarProductosApi } from "../../helpers/queries";
import type { Producto } from "../../interfaces/productos";


const SkeletonCardProducto = memo(() => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col w-full border border-zinc-200">
    <div className="h-48 bg-zinc-200 w-full"></div>
    <div className="p-5 flex flex-col grow">
      <div className="h-6 bg-zinc-200 rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-zinc-200 rounded-md w-1/2 mb-4"></div>
      <div className="border-t border-dashed border-zinc-300 my-4"></div>
      <div className="h-3 bg-zinc-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-zinc-200 rounded-md w-1/3 mb-4"></div>
      <div className="flex gap-2 mb-3">
        <div className="h-10 w-16 bg-zinc-200 rounded-lg"></div>
        <div className="h-10 grow bg-emerald-200 rounded-lg"></div>
      </div>
      <div className="h-10 w-full bg-blue-200 rounded-lg"></div>
    </div>
  </div>
));


const MemoizedCardProducto = memo(CardProducto);

const Inicio = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [termino, setTermino] = useState("");
  const [filtro, setFiltro] = useState("");
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
      setIsLoading(true); 
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
      setIsLoading(false); 
    }
  };

  
  const handleBuscar = useCallback((event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaginaActual(1);
    setFiltro(termino.trim());
  }, [termino]);

  const handleLimpiarFiltro = useCallback(() => {
    setTermino("");
    setFiltro("");
    setPaginaActual(1);
  }, []);

  const cambiarPagina = useCallback((pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas || pagina === paginaActual) return;
    setPaginaActual(pagina);
  }, [paginaActual, totalPaginas]);

  const handleChangeTermino = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTermino(event.target.value);
  }, []);

  return (
    <section className="space-y-8 animate-fadeIn px-10 my-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight text-center md:text-start">
            Catálogo de <span className="text-green-500">Productos</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm text-center md:text-start">
            Agrega los productos que quieras al carrito y luego termina tu compra
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            Página {paginaActual} de {totalPaginas}
          </div>
        </div>
        <NavLink
          to="/"
          className="bg-green-500 hover:bg-green-600 transition text-l py-2 px-3 rounded-2xl font-bold cursor-pointer text-center md:text-start"
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
            onChange={handleChangeTermino}
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: cantProductos }).map((_, index) => (
            <SkeletonCardProducto key={`skeleton-${index}`} />
          ))
        ) : productos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-400 bg-zinc-900 rounded-xl border border-zinc-800">
            No se encontraron productos que coincidan con tu búsqueda.
          </div>
        ) : (
          productos.map((producto) => (
           
            <MemoizedCardProducto key={producto._id} producto={producto} />
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