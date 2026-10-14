import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppContext } from "../../context/AppContext";
import {
  cancelarReservaApi,
  crearPreferenciaReservaApi,
  obtenerMisReservasApi,
} from "../../helpers/queries";
import type { Reserva } from "../../interfaces/reserva";
import Swal from "sweetalert2";

const [searchParams] = useSearchParams();

const MisReservas = () => {
  const { usuarioLogueado } = useAppContext();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const data: Reserva[] = await obtenerMisReservasApi();
      setReservas(data);
    } catch (err: any) {
      console.error(err);
      setError("No se pudieron cargar tus reservas. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!usuarioLogueado) {
      navigate("/login");
      return;
    }

    void cargarReservas();

    // Captura el resultado del pago que manda Mercado Pago
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");

    if (status === "approved") {
      Swal.fire({
        title: "¡Pago confirmado!",
        text: `Tu reserva se confirmó correctamente.${paymentId ? ` Comprobante N°: ${paymentId}` : ""}`,
        icon: "success",
        confirmButtonColor: "#22c55e",
      });

      // Limpia los parámetros de la URL para que no vuelva a saltar si el usuario recarga la página
      navigate("/mis-reservas", { replace: true });
    } else if (status === "rejected") {
      Swal.fire({
        title: "Pago rechazado",
        text: "No se pudo procesar el pago. Puedes volver a intentarlo desde la lista.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      navigate("/mis-reservas", { replace: true });
    } else if (status === "pending") {
      Swal.fire({
        title: "Pago en proceso",
        text: "El pago está pendiente de acreditación.",
        icon: "info",
        confirmButtonColor: "#3b82f6",
      });
      navigate("/mis-reservas", { replace: true });
    }

  }, [usuarioLogueado, navigate, searchParams]);

  const handleCancelarReserva = async (reserva: Reserva) => {
    const confirmacion = await Swal.fire({
      title: "¿Deseas cancelar la reserva?",
      text: `¿Estás seguro de cancelar la reserva de "${reserva.cancha?.nombreCancha || "Cancha"}" para el ${reserva.fechaInicio} a las ${reserva.horaInicio} hs?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Sí, cancelar reserva",
      cancelButtonText: "Volver",
      background: "#18181b",
      color: "#f4f4f5",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const resp = await cancelarReservaApi(reserva._id);

      if (resp.ok) {
        await Swal.fire({
          icon: "success",
          title: "Reserva cancelada",
          text: "Tu reserva ha sido cancelada exitosamente.",
          confirmButtonColor: "#10b981",
          background: "#18181b",
          color: "#f4f4f5",
        });
        // Recargar la lista de reservas
        void cargarReservas();
      } else {
        const errorData = await resp.json().catch(() => null);
        throw new Error(errorData?.mensaje || "No se pudo cancelar la reserva");
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Ocurrió un error al procesar la cancelación.",
        confirmButtonColor: "#ef4444",
        background: "#18181b",
        color: "#f4f4f5",
      });
    }
  };

  // Handler: Solicitar Reembolso
  const handleSolicitarReembolso = async (reserva: Reserva) => {
    const { value: motivo } = await Swal.fire({
      title: "Solicitar Reembolso",
      text: `Ingresa el motivo por el cual solicitas el reembolso de la cancha ${reserva.cancha?.nombreCancha || ""}:`,
      input: "textarea",
      inputPlaceholder: "Escribe aquí el motivo de tu solicitud...",
      inputAttributes: {
        "aria-label": "Motivo del reembolso",
      },
      showCancelButton: true,
      confirmButtonColor: "#0284c7",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Enviar Solicitud",
      cancelButtonText: "Cancelar",
      background: "#18181b",
      color: "#f4f4f5",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Por favor ingresa un motivo para continuar";
        }
      },
    });

    if (motivo) {
      // Aquí puedes conectar el endpoint de soporte o reembolso cuando lo tengas listo
      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Tu solicitud de reembolso fue recibida por la administración de RollingClub. Nos pondremos en contacto a la brevedad.",
        confirmButtonColor: "#10b981",
        background: "#18181b",
        color: "#f4f4f5",
      });
    }
  };

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
  const handlePagarPendiente = async (reservaId: string) => {
    try {
      const resp = await crearPreferenciaReservaApi(reservaId);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(
          data.mensaje || "Error al generar la preferencia de pago",
        );
      }

      // Mercado Pago devuelve init_point (o sandbox_init_point en modo prueba)
      const urlPago = data.sandbox_init_point ||data.init_point ||  data.url;

      if (urlPago) {
        window.location.href = urlPago; // Redirige al usuario al checkout de Mercado Pago
      } else {
        console.error("No se encontró la URL de pago en la respuesta:", data);
      }
    } catch (error: any) {
      console.error("Error al reintentar pago:", error);
      alert(error.message || "No se pudo iniciar el pago");
    }
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
              <h2>
                Recuerda que tu reserva se elimina automaticamente despues de los 15 minutos si no esta pagada
              </h2>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm">
              <span className="text-zinc-400 block text-xs">
                Usuario activo:
              </span>
              <span className="font-semibold text-zinc-200">
                {usuarioLogueado?.nombre ||
                  usuarioLogueado?.nombre ||
                  "Usuario"}
              </span>
            </div>
          </div>
        </header>

        {/* Estado de Carga y Error */}
        {cargando && (
          <div className="flex justify-center py-16">
            <p className="text-zinc-400 animate-pulse">
              Cargando tus reservas...
            </p>
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
                <p className="text-lg text-zinc-400">
                  Aún no tienes reservas registradas en RollingClub.
                </p>
                <Link
                  to="/reservas"
                  className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Reservar una cancha
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reservas.map((reserva) => {
                  const yaCancelada =
                    reserva.estado?.toLowerCase() === "cancelada";

                  return (
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
                              {(reserva as any).fechaJornada ||
                                reserva.fechaInicio ||
                                "No especificada"}
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
                              {(reserva.cancha?.precio || 0).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="mt-5 flex flex-col gap-2 border-t border-zinc-800/80 pt-4">
                        
                          <button
                            type="button"
                            className="w-full rounded-lg bg-blue-200-600/15 py-2 text-xs font-semibold text-blue-200-400 border border-amber-50-500/20 transition hover:bg-cyan-500-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => void handlePagarPendiente(reserva._id)}
                          >
                            💳 <span>Pagar Reserva</span>
                          </button>
                        

                        <button
                          type="button"
                          onClick={() => void handleCancelarReserva(reserva)}
                          disabled={yaCancelada}
                          className="w-full rounded-lg bg-rose-600/15 py-2 text-xs font-semibold text-rose-400 border border-rose-500/20 transition hover:bg-rose-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {yaCancelada
                            ? "Reserva Cancelada"
                            : "Cancelar Reserva"}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleSolicitarReembolso(reserva)}
                          className="w-full rounded-lg bg-sky-600/15 py-2 text-xs font-semibold text-sky-400 border border-sky-500/20 transition hover:bg-sky-600 hover:text-white"
                        >
                          Solicitar Reembolso
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MisReservas;
