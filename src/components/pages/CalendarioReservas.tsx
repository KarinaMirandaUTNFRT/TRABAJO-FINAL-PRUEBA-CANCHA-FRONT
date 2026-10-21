import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router";
import { obtenerDisponibilidad } from "../services/disponibilidadService";
import {
  listarCanchasApi,
  crearPreferenciaReservaApi,
  crearReservaApi,
} from "../../helpers/queries";
import Swal from "sweetalert2";

interface ItemReserva {
  idTemporal: string; // canchaId + fecha + horaInicio
  canchaId: string;
  nombreCancha: string;
  fecha: string;      // Formato YYYY-MM-DD (fechaISO)
  fechaTexto: string; // Ej: "31 de octubre"
  horaInicio: string;
  horaFin: string;
  precio: number;
}

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
  const [canchas, setCanchas] = useState<any[]>([]);
  const [canchaId, setCanchaId] = useState<string>("");
  const [canchasSeleccionadas, setCanchasSeleccionadas] = useState<ItemReserva[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
  const [turnos, setTurnos] = useState<any[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const { usuarioLogueado } = useAppContext();
  const [mostrarModal, setMostrarModal] = useState(false);
  const fechaISO = convertirFechaAISO(fechaSeleccionada);
  const navegacion = useNavigate();

  // Total acumulado sumando las reservas en lista + la activa en pantalla (si la hay)
  const totalAcumulado =
    canchasSeleccionadas.reduce((acc, c) => acc + c.precio, 0) +
    (turnoSeleccionado ? turnoSeleccionado.precio : 0);

  // 1. Cargar las canchas al montar el componente
  useEffect(() => {
    async function cargarCanchas() {
      try {
        const respuesta = await listarCanchasApi();
        let lista = [];

        if (Array.isArray(respuesta)) {
          lista = respuesta;
        } else if (respuesta && typeof respuesta === "object") {
          lista =
            respuesta.canchas ||
            respuesta.data?.canchas ||
            respuesta.data ||
            respuesta.lista ||
            respuesta.items ||
            [];

          if (lista.length === 0 && (respuesta._id || respuesta.id)) {
            lista = [respuesta];
          }
        }

        const mapeadas = lista.map((cancha: any) => ({
          id: cancha._id || cancha.id,
          nombre: cancha.nombreCancha || cancha.nombre || "Cancha sin nombre",
        }));

        setCanchas(mapeadas);
        if (mapeadas.length > 0) {
          setCanchaId(mapeadas[0].id);
        }
      } catch (err) {
        console.error("Error al listar canchas:", err);
      }
    }
    cargarCanchas();
  }, []);

  // 2. Cargar disponibilidad cuando cambian la cancha o la fecha
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
          controlador.signal
        );
        setTurnos(datos?.turnos || []);
      } catch (errorConsulta: any) {
        if (errorConsulta.name !== "AbortError") {
          setError(
            errorConsulta.message || "Error al cargar la disponibilidad"
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

  // Agrega el turno actual a la lista acumulada
  function handleElegirOtra() {
    if (!turnoSeleccionado) return;

    const idTemporal = `${canchaId}-${fechaISO}-${turnoSeleccionado.horaInicio}`;

    if (canchasSeleccionadas.some((item) => item.idTemporal === idTemporal)) {
      Swal.fire({
        icon: "warning",
        title: "Turno ya agregado",
        text: "Ya tienes este turno en tu lista de reservas.",
        background: "#ffffff",
        color: "#0f172a",
      });
      return;
    }

    const nombreCanchaActual =
      canchas.find((c) => c.id === canchaId)?.nombre || "Cancha";

    const nuevaReserva: ItemReserva = {
      idTemporal,
      canchaId,
      nombreCancha: nombreCanchaActual,
      fecha: fechaISO,
      fechaTexto: fechaSeleccionada.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
      }),
      horaInicio: turnoSeleccionado.horaInicio,
      horaFin: turnoSeleccionado.horaFin,
      precio: turnoSeleccionado.precio,
    };

    setCanchasSeleccionadas((prev) => [...prev, nuevaReserva]);
    setTurnoSeleccionado(null);
  }

  // Quitar una cancha de la lista acumulada
  function eliminarReserva(idTemporal: string) {
    setCanchasSeleccionadas((prev) =>
      prev.filter((item) => item.idTemporal !== idTemporal)
    );
  }

  function continuarReserva() {
    let listaFinal = [...canchasSeleccionadas];

    if (turnoSeleccionado) {
      const idTemporal = `${canchaId}-${fechaISO}-${turnoSeleccionado.horaInicio}`;
      if (!listaFinal.some((item) => item.idTemporal === idTemporal)) {
        listaFinal.push({
          idTemporal,
          canchaId,
          nombreCancha:
            canchas.find((c) => c.id === canchaId)?.nombre || "Cancha",
          fecha: fechaISO,
          fechaTexto: fechaSeleccionada.toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
          }),
          horaInicio: turnoSeleccionado.horaInicio,
          horaFin: turnoSeleccionado.horaFin,
          precio: turnoSeleccionado.precio,
        });
        setCanchasSeleccionadas(listaFinal);
        setTurnoSeleccionado(null);
      }
    }

    if (listaFinal.length === 0) return;

    const usuarioLogueadoSesion = sessionStorage.getItem("usuarioLogueado");
    if (!usuarioLogueadoSesion) {
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
    if (!usuarioLogueado) return;

    try {
      const respNuevaReserva = await crearReservaApi({
        nombreCliente:
          usuarioLogueado?.nombre ||
          usuarioLogueado?.email?.split("@")[0] ||
          "Cliente RollingClub",
        reservas: canchasSeleccionadas.map((item) => ({
          canchaId: item.canchaId,
          nombreCancha: item.nombreCancha,
          fecha: item.fecha,
          turnos: [item.horaInicio],
          precio: item.precio,
        })),
      } as any);

      if (!respNuevaReserva.ok) {
        const errData = await respNuevaReserva.json().catch(() => null);
        throw new Error(errData?.mensaje || "No se pudieron registrar las reservas");
      }

      const respuestaJson = await respNuevaReserva.json();
      const idOrdenOPago =
        respuestaJson.ordenId ||
        respuestaJson.grupoId ||
        respuestaJson.reservas?.[0]?._id ||
        respuestaJson._id;

      if (!idOrdenOPago) {
        throw new Error("No se pudo obtener el identificador para procesar el pago");
      }

      const respPreferencia = await crearPreferenciaReservaApi(idOrdenOPago);
      const dataPreferencia =
        typeof (respPreferencia as any)?.json === "function"
          ? await (respPreferencia as any).json()
          : respPreferencia;

      const linkPago =
        dataPreferencia.sandbox_init_point ||
        dataPreferencia.init_point ||
        dataPreferencia?.url;

      if (linkPago) {
        window.location.href = linkPago;
      } else {
        throw new Error("No se recibió la URL de pago de Mercado Pago");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar el pago",
        text: error.message || "Ocurrió un error inesperado al procesar las reservas",
        confirmButtonColor: "#ef4444",
        background: "#18181b",
        color: "#f4f4f5",
      });
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
        {/* Selector de Canchas y Calendario */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 h-fit">
          <label
            htmlFor="cancha"
            className="block mb-2 font-bold text-slate-700"
          >
            Si no existe el horario disponible puedes seleccionar otra cancha
          </label>
          <select
            id="cancha"
            value={canchaId}
            onChange={(e) => setCanchaId(e.target.value)}
            className="w-full mb-8 p-3 border-2 border-emerald-100 rounded-xl bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          >
            {canchas.map((cancha: any) => (
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

        {/* Grilla de Turnos */}
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

          {/* Barra de Turno Seleccionado Actual */}
          {turnoSeleccionado && (
            <div className="mt-6 bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-emerald-500 shadow-xl">
              <div>
                <span className="block text-slate-400 text-xs font-bold uppercase">
                  Turno seleccionado
                </span>
                <strong className="text-lg">
                  {turnoSeleccionado.horaInicio} a {turnoSeleccionado.horaFin} —{" "}
                  {formatearPrecio(turnoSeleccionado.precio)}
                </strong>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleElegirOtra}
                  className="w-full md:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl border border-emerald-500/40 transition-colors"
                >
                  + Elegir otra opcion
                </button>
                <button
                  type="button"
                  onClick={continuarReserva}
                  className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold rounded-xl transition-colors shadow-lg"
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Canchas/Turnos Acumulados que se va adjuntando debajo */}
      {canchasSeleccionadas.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8 bg-white p-6 md:p-8 rounded-2xl border border-emerald-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center justify-between border-b pb-4">
            <span>Tus reservas acumuladas ({canchasSeleccionadas.length})</span>
            <span className="text-emerald-600 font-extrabold text-2xl">
              Total: {formatearPrecio(totalAcumulado)}
            </span>
          </h3>

          <div className="divide-y divide-slate-100">
            {canchasSeleccionadas.map((item) => (
              <div
                key={item.idTemporal}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-900 text-lg">
                    {item.nombreCancha}
                  </p>
                  <p className="text-sm text-slate-500">
                    📅 {item.fechaTexto} | ⏰ {item.horaInicio} a {item.horaFin} hs
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-slate-800 text-lg">
                    {formatearPrecio(item.precio)}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarReserva(item.idTemporal)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold border border-red-200 transition-colors"
                    title="Eliminar turno"
                  >
                    ✕ Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!turnoSeleccionado && (
            <button
              type="button"
              onClick={continuarReserva}
              className="mt-6 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-lg rounded-xl shadow-lg transition-colors"
            >
              Confirmar y Pagar Todo ({formatearPrecio(totalAcumulado)})
            </button>
          )}
        </div>
      )}

      {/* Modal Desplegable con el Resumen Consolidado */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
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
                Resumen de Reservas
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Revisá el listado antes de realizar el pago conjunto
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm divide-y divide-slate-200/60">
              {canchasSeleccionadas.map((r, i) => (
                <div key={r.idTemporal || i} className="pt-2 first:pt-0">
                  <div className="flex justify-between items-center text-slate-800 font-bold">
                    <span>{r.nombreCancha}</span>
                    <span className="text-emerald-700">
                      {formatearPrecio(r.precio)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>{r.fechaTexto}</span>
                    <span>
                      {r.horaInicio} - {r.horaFin} hs
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center text-base pt-3 font-bold">
                <span className="text-slate-900">Monto Total a Pagar:</span>
                <strong className="text-xl font-extrabold text-emerald-600">
                  {formatearPrecio(totalAcumulado)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleComprar}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/30 text-center text-base flex items-center justify-center gap-2"
            >
              💳 Pagar Reservas ({formatearPrecio(totalAcumulado)})
            </button>
          </div>
        </div>
      )}
    </section>
  );
}