import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router";
import { obtenerDisponibilidad } from "../services/disponibilidadService";
import {
  listarCanchasApi,
  crearPreferenciaReservaApi,
} from "../../helpers/queries";
import Swal from "sweetalert2";

const respuesta = await listarCanchasApi();
const canchasData = await respuesta.json();
const lista = canchasData.canchas;

const CANCHAS = lista.map((cancha: any) => ({
  id: cancha._id,
  nombre: cancha.nombreCancha,
}));

function convertirFechaAISO(fecha: any): string {
  if (!fecha || !(fecha instanceof Date) || isNaN(fecha.getTime())) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio || 0);
}

export default function CalendarioReservas() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
  const [canchaId, setCanchaId] = useState<string>(CANCHAS[0].id);
  const [turnos, setTurnos] = useState<any[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const { usuarioLogueado } = useAppContext();
  const [mostrarModal, setMostrarModal] = useState(false);
  const fechaISO = convertirFechaAISO(fechaSeleccionada);
  const navegacion = useNavigate();
  useEffect(() => {
    const controlador = new AbortController();

    async function cargarDisponibilidad() {
      try {
        setCargando(true);
        setError("");
        setTurnos([]);
        setTurnoSeleccionado(null);

        const datos = await obtenerDisponibilidad(
          canchaId,
          fechaISO,
          controlador.signal,
        );
        setTurnos(datos?.turnos || []);
      } catch (errorConsulta: any) {
        if (errorConsulta.name !== "AbortError") {
          setError(
            errorConsulta.message || "Error al cargar la disponibilidad",
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }
    if (canchaId && fechaISO) {
      cargarDisponibilidad();
    }
    return () => controlador.abort();
  }, [canchaId, fechaISO]);
  function seleccionarTurno(turno: any) {
    if (turno.estado?.toLowerCase() !== "disponible") return;
    setTurnoSeleccionado(turno);
  }
  function continuarReserva() {
    if (!turnoSeleccionado) return;
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");

    if (!usuarioLogueado) {
      Swal.fire({
        title: "¡Inicia sesión para continuar!",
        text: "Debes estar registrado e iniciar sesión para poder reservar un turno.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Ir a Login",
        cancelButtonText: "Cancelar",
        background: "#ffffff",
        color: "#0f172a",
      }).then((result) => {
        if (result.isConfirmed) {
          navegacion("/login");
        }
      });

      return;
    }
    setMostrarModal(true);
  }
  const handleComprar = async () => {
    if (!usuarioLogueado) return navegacion("/login");
    const idReserva = turnoSeleccionado?.id || turnoSeleccionado?._id;
    if (!idReserva) {
      return Swal.fire(
        "Error",
        "No se encontró el ID de la reserva a pagar",
        "error",
      );
    }
    try {
      const resp = await crearPreferenciaReservaApi(idReserva);

      if (!resp.ok) {
        const errorJson = await resp.json().catch(() => ({}));
        throw new Error(
          errorJson.mensaje || "Error al generar la preferencia de pago",
        );
      }

      const data = await resp.json();
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("Respuesta inválida de preferencia", data);
        Swal.fire("Error", "No se obtuvo la URL de pago", "error");
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar el pago",
      });
    } finally {
    }
  };
  const getEstilosTurno = (turno: any, isSelected: boolean) => {
    const base =
      "flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all duration-150 select-none";
    const estado = (turno.estado || "").toLowerCase();
    if (isSelected) {
      return `${base} bg-emerald-600 border-emerald-700 text-white shadow-md scale-105`;
    }
    if (estado === "disponible") {
      return `${base} bg-emerald-50/80 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100 text-emerald-950 cursor-pointer`;
    }
    if (
      estado === "reservado" ||
      estado === "confirmada" ||
      estado === "ocupado"
    ) {
      return `${base} bg-red-50/80 border-red-200 text-red-800 cursor-not-allowed opacity-60`;
    }
    // Pendiente
    return `${base} bg-amber-50/80 border-amber-200 text-amber-900 cursor-not-allowed opacity-60`;
  };

  return (
    <section className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <header className="max-w-6xl mx-auto mb-10">
        <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase flex items-center gap-2">
          ⚽ Reserva tu cancha
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Sistema de Turnos F5
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Seleccioná la fecha y asegurá tu partido.
        </p>
      </header>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 h-fit">
          <label
            htmlFor="cancha"
            className="block mb-2 font-bold text-slate-700"
          >
            Selecciona la cancha
          </label>
          <select
            id="cancha"
            value={canchaId}
            onChange={(e) => setCanchaId(e.target.value)}
            className="w-full mb-8 p-3 border-2 border-emerald-100 rounded-xl bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          >
            {CANCHAS.map((cancha: any) => (
              <option key={cancha.id} value={cancha.id}>
                {cancha.nombre}
              </option>
            ))}
          </select>
          <div className="calendar-wrapper overflow-hidden rounded-xl border border-slate-200">
            <Calendar
              onChange={(val) => {
                if (val instanceof Date) setFechaSeleccionada(val);
              }}
              value={fechaSeleccionada}
              minDate={new Date()}
              locale="es-AR"
              className="w-full border-none font-sans"
            />
          </div>
        </div>
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize border-b-2 border-emerald-100 pb-4">
            Turnos del{" "}
            <span className="text-emerald-600">
              {fechaSeleccionada.toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </h2>
          <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Disponible
            </span>
          </div>

          {cargando && (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 animate-pulse font-medium">
              Buscando horarios disponibles...
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 flex flex-col gap-1">
              <strong className="font-bold">Error en la cancha</strong>
              <span>{error}</span>
            </div>
          )}

          {!cargando && !error && turnos.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 border border-slate-200">
              ⚽ No hay turnos programados para esta fecha.
            </div>
          )}

          {!cargando && !error && turnos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {turnos.map((turno) => {
                const disponible =
                  (turno.estado || "").toLowerCase() === "disponible";
                const seleccionado = turnoSeleccionado?.id === turno.id;

                return (
                  <button
                    type="button"
                    key={turno.id}
                    disabled={!disponible}
                    onClick={() => seleccionarTurno(turno)}
                    className={getEstilosTurno(turno, seleccionado)}
                  >
                    <span className="text-lg font-extrabold tracking-tight">
                      {turno.horaInicio} - {turno.horaFin}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
                      {turno.estado}
                    </span>
                    <strong className="text-xs mt-0.5 font-medium">
                      {formatearPrecio(turno.precio)}
                    </strong>
                  </button>
                );
              })}
            </div>
          )}
          {turnoSeleccionado && (
            <div className="mt-10 bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border-t-4 border-emerald-500">
              <div className="flex gap-8 w-full md:w-auto">
                <div>
                  <span className="block text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">
                    Tu Horario
                  </span>
                  <strong className="text-xl">
                    {turnoSeleccionado.horaInicio} a {turnoSeleccionado.horaFin}
                  </strong>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">
                    Total a Pagar
                  </span>
                  <strong className="text-xl text-emerald-400">
                    {formatearPrecio(turnoSeleccionado.precio)}
                  </strong>
                </div>
              </div>
              <button
                type="button"
                onClick={continuarReserva}
                className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              >
                Confirmar Reserva
              </button>
            </div>
          )}
        </div>
      </div>
      {mostrarModal && turnoSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl border border-slate-100 space-y-6 animate-fadeIn">
            <button
              type="button"
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-lg font-bold"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <div className="text-center border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                ⚽
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Detalle de Reserva
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Revisá los datos antes de realizar el pago
              </p>
            </div>
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Cancha:</span>
                <strong className="text-slate-900 font-bold">
                  {CANCHAS.find((e: any) => e.id === canchaId)?.nombre ||
                    "Cancha seleccionada"}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Fecha:</span>
                <strong className="text-slate-900 font-bold capitalize">
                  {fechaSeleccionada.toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Horario:</span>
                <strong className="text-slate-900 font-bold">
                  {turnoSeleccionado.horaInicio} - {turnoSeleccionado.horaFin}{" "}
                  hs
                </strong>
              </div>
              <hr className="border-slate-200 my-2" />
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-slate-800">Monto Total:</span>
                <strong className="text-xl font-extrabold text-emerald-600">
                  {formatearPrecio(turnoSeleccionado.precio)}
                </strong>
              </div>
            </div>
            <button
              type="button"
              onClick={handleComprar}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/30 active:scale-95 text-center text-base flex items-center justify-center gap-2"
            >
              💳 Pagar Reserva
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
