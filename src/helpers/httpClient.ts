// src/helpers/httpClient.ts

// Configura tu URL base aquí (puede venir de un .env)
const BASE_URL = import.meta.env.VITE_ALQUILER_CANCHAS || "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
  timeout?: number;
  body?: any;
}

// Función genérica interna que maneja la lógica pesada
const fetchRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { timeout = 8000, body, headers, ...rest } = options; // Timeout por defecto: 8 segundos

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  // Headers por defecto, aquí puedes agregar el token de autenticación
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    // "x-token": localStorage.getItem("token") || "", 
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(id); // Limpiamos el timeout si la petición responde antes

    if (!response.ok) {
      // Capturamos el error del backend si existe, o mostramos uno genérico
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || `Error HTTP: ${response.status}`);
    }

    // Asumimos que el backend siempre responde con JSON en casos de éxito
    return (await response.json()) as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("La petición tardó demasiado (Timeout). Revisa tu conexión.");
    }
    throw error; // Propaga otros errores (ej. red caída)
  }
};

// Objeto exportado con los métodos limpios
export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    fetchRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    fetchRequest<T>(endpoint, { ...options, method: "POST", body: data }),

  put: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    fetchRequest<T>(endpoint, { ...options, method: "PUT", body: data }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    fetchRequest<T>(endpoint, { ...options, method: "DELETE" }),
};