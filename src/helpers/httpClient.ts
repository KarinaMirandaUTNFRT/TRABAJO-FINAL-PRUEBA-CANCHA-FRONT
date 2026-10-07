
const BASE_URL = import.meta.env.VITE_ALQUILER_CANCHAS || "http://localhost:3000/api";
interface RequestOptions extends RequestInit {
  timeout?: number;
  body?: any;
}
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Función genérica interna que maneja la lógica pesada
const fetchRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  
  const { timeout = 8000, body, headers, method = "GET", ...rest } = options; 

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const csrfToken = getCookie("XSRF-TOKEN");
  
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
   
    ...(csrfToken && ["POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase()) 
        ? { "X-CSRF-Token": csrfToken } 
        : {})
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      method, 
      credentials: "include", 
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(id); 

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || `Error HTTP: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("La petición tardó demasiado (Timeout). Revisa tu conexión.");
    }
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Error de red o bloqueo por CORS. Revisa la consola.");
    }
    throw error; 
  }
};
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