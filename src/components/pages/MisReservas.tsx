import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppContext } from "../../context/AppContext";
import { obtenerMisReservasApi } from "../../helpers/queries";
import type { Reserva } from "../../interfaces/reserva";

const MisReservas = () => {
  const { usuarioLogueado } = useAppContext();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioLogueado) {
      navigate("/login");
      return;
    }

    const cargarReservas = async () => {
      try {
        setCargando(true);
        const data = await obtenerMisReservasApi();
        setReservas(data);
      } catch (err: any) {
        console.error(err);
        setError("No se pudieron cargar tus reservas. Intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [usuarioLogueado, navigate]);

  // Formato de badge según el estado de la reserva
  const renderBadgeEstado = (estado: string) => {
    const estadoLower = estado?.toLowerCase() || "pendiente";
    if (estadoLower === "confirmada" || estadoLower === "pagada") {
      return (
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
          Confirmada
        </span>
      );
    }
    if (estadoLower === "cancelada") {
      return (
        <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400">
          Cancelada
        </span>
      );
    }
    return (
      <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
        Pendiente
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Encabezado con la Empresa y el Usuario */}
        <header className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                RollingClub
              </span>
              <h1 className="text-2xl font-extrabold sm:text-3xl text-zinc-100">
                Mis Reservas de Cancha
              </h1>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm">
              <span className="text-zinc-400 block text-xs">Usuario activo:</span>
              <span className="font-semibold text-zinc-200">
                {usuarioLogueado?.nombre || usuarioLogueado?.nombre || "Usuario"}
              </span>
            </div>
          </div>
        </header>

        {/* Estado de Carga y Error */}
        {cargando && (
          <div className="flex justify-center py-16">
            <p className="text-zinc-400 animate-pulse">Cargando tus reservas...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-800/50 bg-red-950/30 p-4 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Contenido Principal */}
        {!cargando && !error && (
          <>
            {reservas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 py-16 text-center">
                <p className="text-lg text-zinc-400">Aún no tienes reservas registradas en RollingClub.</p>
                <Link
                  to="/reservas"
                  className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Reservar una cancha
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reservas.map((reserva) => (
                  <article
                    key={reserva._id}
                    className="flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg transition hover:border-zinc-700"
                  >
                    <div>
                      {/* Estado y Cancha */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                          Cancha
                        </span>
                        {renderBadgeEstado(reserva.estado)}
                      </div>

                      <h2 className="text-xl font-bold text-zinc-100">
                        {reserva.cancha?.nombreCancha || "Cancha RollingClub"}
                      </h2>

                      {/* Detalles: Fecha y Hora */}
                      <div className="mt-4 space-y-2 border-t border-zinc-800/80 pt-3 text-sm text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Fecha:</span>
                          <span className="font-medium text-zinc-200">
                            {reserva.fechaInicio}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Horario:</span>
                          <span className="font-medium text-zinc-200">
                            {reserva.horaInicio} hs
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Precio:</span>
                          <span className="font-semibold text-emerald-400">
                            {(reserva.cancha?.precio || 0).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-zinc-800/80 pt-3 text-xs text-zinc-500">
                      ID Reserva: <span className="font-mono text-zinc-400">{reserva._id}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MisReservas;