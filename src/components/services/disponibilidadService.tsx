import { listarReservasApi } from "../../helpers/queries";

export async function obtenerDisponibilidad(
  canchaId: string,
  fecha: string,
  signal?: AbortSignal,
) {
  try {
    const respuesta = await listarReservasApi(canchaId, fecha, signal);

    if (!respuesta || !respuesta.ok) {
      throw new Error(
        "No se pudieron cargar las reservas de la base de datos.",
      );
    }

    const data = await respuesta.json();

    const datosCancha = Array.isArray(data?.canchas)
      ? data.canchas[0] || {}
      : Array.isArray(data)
        ? data[0] || {}
        : data || {};

    const disponibles: string[] =
      datosCancha.turnosDisponibles || data.turnosDisponibles || [];

    const ocupados: string[] =
      datosCancha.turnosOcupados || data.turnosOcupados || [];

    const pendientes: string[] =
      datosCancha.turnosPendientes || data.turnosPendientes || [];

    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const horasDelDia = data.canchas[0].turnosLibres;

    const calcularHoraFin = (hora: string) => {
      const [h, m] = hora.split(":");
      const siguiente = (parseInt(h, 10) + 1) % 24;
      return `${String(siguiente).padStart(2, "0")}:${m || "00"}`;
    };

    const turnosCompletos = horasDelDia.map((hora: any, index: any) => {
      let estado = "disponible";

      if (ocupados.includes(hora)) {
        estado = "reservado";
      } else if (pendientes.includes(hora)) {
        estado = "pendiente";
      } else if (disponibles.length > 0 && !disponibles.includes(hora)) {
        estado = "reservado";
      }

      return {
        id: `turno-${hora.replace(":", "")}-${index}`,
        horaInicio: hora,
        horaFin: calcularHoraFin(hora),
        estado,
        precio: Number(datosCancha.precio || data.precio) || 20000,
      };
    });

    return {
      canchaId,
      fecha,
      turnos: turnosCompletos,
    };
  } catch (error: any) {
    if (error.name === "AbortError" || signal?.aborted) {
      throw error;
    }
    console.error(
      "Error al cruzar disponibilidad con la base de datos:",
      error,
    );
    throw error;
  }
}
