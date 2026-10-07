import type {  CanchaFormData } from "../interfaces/canchas";
import type { Producto, ProductoFormData } from "../interfaces/productos";

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
  // support both legacy frontend names and backend names
  paginaNumero?: number;
  cantProductos?: number;
  pagina?: number;
  limite?: number;
  termino?: string;
}
export interface ListarReservasParams {
  // support both legacy frontend names and backend names
  paginaNumero?: number;
  cantReservas?: number;
  pagina?: number;
  limite?: number;
  termino?: string;
}

export const listarCanchasApi = async (): Promise<Response> => {
 try {

    const respuesta = await fetch(urlCanchas);
    return respuesta;
  } catch (error) {
    console.error("Error al listar productos:", error);
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

export const crearCanchaApi = async (cancha: CanchaFormData): Promise<Response> => {
  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const respuesta = await fetch(urlCanchas, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
         "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(cancha),
    });
    return respuesta;
  } catch (error) {
    console.error("Error al crear la cancha:", error);
    throw error;
  }
};


// export const editarCanchaApi = async (
//   id: string,
//   cancha: CanchaFormData,
// ): Promise<Response> => {
//   try {
//     const respuesta = await fetch(`${urlCanchas}/${id}`, {
//       method: "PUT",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(cancha),
//     });
//     return respuesta;
//   } catch (error) {
//     console.error(`Error al editar la cancha con id ${id}:`, error);
//     throw error;
//   }
// };
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
    //console.log("Token enviado al borrar:", token);
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
    // Backend espera `pagina` y `limite`. el termino es optativo
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
    // Backend espera `pagina` y `limite`. el termino es optativo
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
    // Si fue cancelada intencionalmente por cambio de fecha o StrictMode, no lo imprimimos como error
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
      credentials:'include',
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
    // Backend espera `pagina` y `limite`. el termino es optativo
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
      credentials:'include',
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
      credentials:'include',
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

// En el PUT, usamos Partial<Producto> si solo envías los campos modificados,
// o directamente 'Producto' si mandas el objeto completo.
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
      credentials:'include',
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
  cantidad = 1
): Promise<Response> => {
  try {
    const respuesta = await fetch(urlCarrito, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ producto:productoId, cantidad }),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const restarDelCarritoApi = async (productoId: string): Promise<Response> => {
  const respuesta = await fetch(`${urlCarrito}/restar/${productoId}`, {
    method: 'PATCH',
    credentials: 'include',
  });
  return respuesta;
};

export const eliminarProductoDelCarritoApi = async (productoId: string): Promise<Response> => {
  const respuesta = await fetch(`${urlCarrito}/producto/${productoId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return respuesta;
};

export const obtenerCantidadCarritoApi = async (): Promise<number> => {
  try {
    const respuesta = await fetch(urlCarrito, {
      method: 'GET',
      credentials: 'include',
    });
    if (respuesta.status === 401 || respuesta.status === 403) {
      // usuario no autenticado: no hay carrito accesible
      return 0;
    }
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el carrito');
    }
    const data = await respuesta.json();
    if (!data || !Array.isArray(data.items)) return 0;
    return data.items.reduce((acc: number, it: any) => acc + (Number(it.cantidad) || 0), 0);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//🆕 fin consultas carrito
//🆕 obtener carrito completo
export const obtenerCarritoApi = async (): Promise<any> => {
  try {
    const respuesta = await fetch(urlCarrito, {
      method: "GET",
      credentials: "include",
    });
    if (respuesta.status === 401 || respuesta.status === 403) {
      return null;
    }
    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el carrito");
    }
    return respuesta.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//🆕 crear preferencia de pago (MercadoPago) - backend crea la preferencia y devuelve init_point
export const crearPreferenciaPagoApi = async (): Promise<Response> => {
  try {
    const respuesta = await fetch(`${urlPagoProducto}/crear-preferencia`, {
      method: 'POST',
      credentials: 'include',
    });
    return respuesta;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crearPreferenciaReservaApi = async (reservaId:any) => {
  // Recuperamos el token/usuario guardado
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado") || "{}");
  const token = usuario?.token; // Ajusta según la clave donde guardes el token JWT

  return await fetch(`${urlPagoCancha}/crear-preferencia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Necesario para req.user.id en tu backend
    },
    body: JSON.stringify({ reservaId }), // Enviamos el ID que espera req.body
  });
};