import SistemaReservas from "../pages/SistemaReservas";
import { useEffect, useState } from "react";
import type { Cancha } from "../../interfaces/canchas";
import { listarCanchasApi } from "../../helpers/queries";
import Swal from "sweetalert2";
import Carousel from "../services/Carousel";
import { NavLink } from "react-router";

const Inicio = () => {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  useEffect(() => {
    cargarCanchas();
  }, []);

  const cargarCanchas = async () => {
    const respuestaCancha = await listarCanchasApi();

    if (respuestaCancha && respuestaCancha.status === 200) {
      const data = await respuestaCancha.json();

      setCanchas(data.canchas);
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: `No se puede mostrar las canchas en este momento`,
        icon: "success",
      });
    }
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      <Carousel />
      <div className="flex flex-col md:flex-row md:items-center justify-center border-b border-zinc-800 pb-5 gap-4">
        <NavLink
          to="/productos"
          className={
            "bg-green-500 hover:bg-green-600 transition text-l py-2 px-3 rounded-2xl font-bold cursor-pointer"
          }
        >
          Compra tus productos
        </NavLink>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Bienvenido a nuestro<span className="text-green-500"> Club</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Reserva tu turno en nuestras canchas o adquiere nuestros productos
          </p>
        </div>
        <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 self-start md:self-center">
          {canchas.length} canchas disponibles
        </div>
      </div>
      {canchas.length > 0 ? (
        <div className=" ">
          <SistemaReservas canchas={canchas} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
          <i className="bi bi-search text-4xl text-zinc-700 mb-4"></i>
          <p className="text-zinc-500">
            No se encontraron canchas disponibles.
          </p>
        </div>
      )}
    </section>
  );
};

export default Inicio;
