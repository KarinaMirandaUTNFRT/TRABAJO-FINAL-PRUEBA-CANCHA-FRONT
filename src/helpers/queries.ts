import type { CanchaFormData } from "../interfaces/canchas";
import type { Producto, ProductoFormData } from "../interfaces/productos";
import { httpClient } from "./httpClient";
import type { ICarrito } from "../interfaces/carrito";
import type { Reserva } from "../interfaces/reserva";

const urlCanchas = `${import.meta.env.VITE_ALQUILER_CANCHAS}/canchas`;
const urlReservas = `${import.meta.env.VITE_ALQUILER_CANCHAS}/reservas/disponibles`;
const urlCategorias = `${import.meta.env.VITE_ALQUILER_CANCHAS}/categoriaCanchas`;
const urlUsuarios = `${import.meta.env.VITE_ALQUILER_CANCHAS}/usuarios`;
const urlProductos = `${import.meta.env.VITE_ALQUILER_CANCHAS}/productos`;
const urlCategoriasProductos = `${import.meta.env.VITE_ALQUILER_CANCHAS}/categoriaProductos`;
const urlCarrito = `${import.meta.env.VITE_ALQUILER_CANCHAS}/carrito`;
const urlPagoProducto = `${import.meta.env.VITE_ALQUILER_CANCHAS}/pagoProducto`;
const urlPagoCancha = `${import.meta.env.VITE_ALQUILER_CANCHAS}/pagoCancha`;
const urlMisReservas = `${import.meta.env.VITE_ALQUILER_CANCHAS}/reservas/mis-reservas`;
const urlReservasTotales = `${import.meta.env.VITE_ALQUILER_CANCHAS}/reservas`;

export interface ListarProductosParams {
  paginaNumero?: number;
  cantProductos?: number;
  pagina?: number;
  limite?: number;
  termino?: string;
}
export interface ListarReservasParams {
  paginaNumero?: number;
  cantReservas?: number;
  pagina?: number;
  limite?: number;
  termino?: string;
}
 export const listarCanchasApi = async (): Promise<any> => {
  try {
    const respuesta = await httpClient.get("/canchas");

    return respuesta;
  } catch (error) {
    console.error("Error al listar canchas:", error);
    throw error;
  }
};

export const buscarCanchaApi = async (id: string): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlCanchas}/${id}`);
    return respuesta;
  } catch (error) {
    console.error(`Error al buscar la cancha con id ${id}:`, error);
    throw error;
  }
};

export const crearCanchaApi = async (
  cancha: CanchaFormData,
): Promise<Response> => {
  try {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const respuesta = await fetch(urlCanchas, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cancha),
    });
    return respuesta;
  } catch (error) {
    console.error("Error al crear la cancha:", error);
    throw error;
  }
};

export const editarCanchaApi = async (
  id: string,
  cancha: CanchaFormData,
): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlCanchas}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cancha),
    });
    return respuesta;
  } catch (error) {
    console.error(`Error al editar la cancha con id ${id}:`, error);
    throw error;
  }
};

export const borrarCanchaApi = async (id: string): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlCanchas}/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respuesta;
  } catch (error) {
    console.error(`Error al borrar la cancha con id ${id}:`, error);
    throw error;
  }
};

export const listarReservasApiAdm = async (
  params: ListarReservasParams = {},
): Promise<Response> => {
  try {
    const query = new URLSearchParams();
    const pagina = params.pagina ?? params.paginaNumero ?? 1;
    const limite = params.limite ?? params.cantReservas ?? 8;
    query.set("pagina", String(pagina));
    query.set("limite", String(limite));
    if (params.termino) {
      query.set("termino", params.termino);
    }
    const respuesta = await fetch(`${urlReservasTotales}?${query.toString()}`);
    return respuesta;
  } catch (error) {
    console.error("Error al listar Reservas:", error);
    throw error;
  }
};
export const listarReservasApiCliente = async (
  _id: string | number,
  params: ListarReservasParams = {},
): Promise<Response> => {
  try {
    const query = new URLSearchParams();
    const pagina = params.pagina ?? params.paginaNumero ?? 1;
    const limite = params.limite ?? params.cantReservas ?? 8;
    query.set("pagina", String(pagina));
    query.set("limite", String(limite));
    if (params.termino) {
      query.set("termino", params.termino);
    }
    const respuesta = await fetch(`${urlMisReservas}?/${_id}`);
    return respuesta;
  } catch (error) {
    console.error("Error al listar Reservas:", error);
    throw error;
  }
};
export const listarReservasApi = async (
  canchaId: string,
  fecha: string,
  signal?: AbortSignal,
): Promise<Response> => {
  try {
    const respuesta = await fetch(
      `${urlReservas}?canchaId=${encodeURIComponent(canchaId)}&fecha=${encodeURIComponent(fecha)}`,
      { signal },
    );
    return respuesta;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw error;
    }
    console.error("Error al conectar con la API de reservas/turnos:", error);
    throw error;
  }
};
export const borrarReservaApi = async (
  id: string | number,
): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlReservas}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const listarCategoriasApi = async (): Promise<any[]> => {
  try {
    const respuesta = await fetch(urlCategorias);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al listar categorías:", error);
    return [];
  }
};
export const listarProductosApi = async (
  params: ListarProductosParams = {},
): Promise<Response> => {
  try {
    const query = new URLSearchParams();
    const pagina = params.pagina ?? params.paginaNumero ?? 1;
    const limite = params.limite ?? params.cantProductos ?? 8;
    query.set("pagina", String(pagina));
    query.set("limite", String(limite));
    if (params.termino) {
      query.set("termino", params.termino);
    }
    const respuesta = await fetch(`${urlProductos}?${query.toString()}`);
    return respuesta;
  } catch (error) {
    console.error("Error al listar productos:", error);
    throw error;
  }
};

export const listarCategoriasProductosApi = async (): Promise<any[]> => {
  try {
    const respuesta = await fetch(urlCategoriasProductos);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al listar categorías:", error);
    return [];
  }
};

export const crearProductoApi = async (
  producto: ProductoFormData,
): Promise<Response> => {
  try {
    const respuesta = await fetch(urlProductos, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const borrarProductoApi = async (
  id: string | number,
): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlProductos}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const buscarProductoApi = async (
  id: string | number,
): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlProductos}/${id}`);
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarProductoApi = async (
  id: string | number,
  producto: Partial<Producto>,
): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlProductos}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginBackendApi = async (usuario: any): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlUsuarios}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(usuario),
    });
    return respuesta;
  } catch (error) {
    console.error("Error en loginBackendApi:", error);
    throw error;
  }
};
export const logoutBackendApi = async (): Promise<Response> => {
  return fetch(`${urlUsuarios}/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const agregarAlCarritoApi = async (
  productoId: string,
  cantidad = 1,
  token?: string,
): Promise<Response> => {
  try {
    const authToken =
      token ||
      JSON.parse(
        sessionStorage.getItem("usuario") ||
          localStorage.getItem("usuario") ||
          "{}",
      )?.token;
    const respuesta = await fetch(urlCarrito, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": authToken || "",
        Authorization: `Bearer ${authToken || ""}`,
      },
      credentials: "include",
      body: JSON.stringify({ productoId, cantidad }),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const restarDelCarritoApi = async (productoId: string, token?: string): Promise<Response> => {
  const authToken =
    token ||
    JSON.parse(
      sessionStorage.getItem("usuario") ||
      localStorage.getItem("usuario") ||
      "{}"
    )?.token;

  return await fetch(`http://localhost:3000/api/carrito/restar/${productoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-token": authToken || "",
      "Authorization": `Bearer ${authToken || ""}`,
    },
    credentials: "include",
  });
};
export const eliminarProductoDelCarritoApi = async (productoId: string, token?: string): Promise<Response> => {
  const authToken =
    token ||
    JSON.parse(
      sessionStorage.getItem("usuario") ||
      localStorage.getItem("usuario") ||
      "{}"
    )?.token;

  return await fetch(`http://localhost:3000/api/carrito/${productoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": authToken || "",
      "Authorization": `Bearer ${authToken || ""}`,
    },
    credentials: "include",
  });
};

export const obtenerCantidadCarritoApi = async (): Promise<number> => {
  try {
    const respuesta = await fetch(urlCarrito, {
      method: "GET",
      credentials: "include",
    });
    if (respuesta.status === 401 || respuesta.status === 403) {
      return 0;
    }
    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el carrito");
    }
    const data = await respuesta.json();
    if (!data || !Array.isArray(data.items)) return 0;
    return data.items.reduce(
      (acc: number, it: any) => acc + (Number(it.cantidad) || 0),
      0,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerCarritoApi = async () => {
  return await httpClient.get<ICarrito>("/carrito");
};

export const crearPreferenciaPagoApi = async () => {
  return await httpClient.post<any>(`${urlPagoProducto}/crear-preferencia`);
};

export const crearPreferenciaReservaApi = async (datosTurno: any) => {
  let token = localStorage.getItem("token");

  if (!token) {
    const rawUser = localStorage.getItem("usuarioLogueado");
    if (rawUser) {
      try {
        const usuario = JSON.parse(rawUser);
        token = usuario?.token;
      } catch (err) {
        console.error("Error parseando usuario:", err);
      }
    }
  }

  return await fetch(`${urlPagoCancha}/crear-preferencia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token || "",
      "Authorization": `Bearer ${token || ""}`,
    },
    credentials: "include",
    body: JSON.stringify({ datosTurno }), 
    // Envía canchaId, fecha, hora, etc.
  });
};
export const obtenerMisReservasApi = async (): Promise<Reserva[]> => {
  let token = localStorage.getItem("token");

  if (!token) {
    const rawUser = localStorage.getItem("usuarioLogueado");
    if (rawUser) {
      try {
        const usuario = JSON.parse(rawUser);
        token = usuario?.token;
      } catch (err) {
        console.error("Error parseando usuario:", err);
      }
    }
  }

  const resp = await fetch(`${urlPagoCancha}/mis-reservas`, { // Ajusta la ruta a tu endpoint
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": token || "",
      "Authorization": `Bearer ${token || ""}`,
    },
    credentials: "include",
  });

  if (!resp.ok) {
    throw new Error("Error al obtener las reservas");
  }
const data: Reserva[] = await resp.json();
  return data;
  
};