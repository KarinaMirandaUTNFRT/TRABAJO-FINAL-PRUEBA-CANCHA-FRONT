import { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { AppContext } from "./context/AppContext";
import type { Usuario } from "./interfaces/usuarios";
import { loginBackendApi } from "./helpers/queries";


// --- Importaciones Estáticas ---

import Footer from "./components/shared/Footer";
import Menu from "./components/shared/Menu";
import ProtectorRutas from "./components/routes/ProtectorRutas";
import ErrorBoundary from "./components/ErrorBoundary";
import MisReservas from "./components/pages/MisReservas";

// --- Importaciones Dinámicas (Lazy Loading) ---

const Inicio = lazy(() => import("./components/pages/Inicio"));
const Login = lazy(() => import("./components/pages/Login"));
const RegistroUsuario = lazy(() => import("./components/pages/RegistroUsuario"));
const Administrador = lazy(() => import("./components/pages/Administrador"));
const Formulario = lazy(() => import("./components/pages/Formulario"));
const FormCancha = lazy(() => import("./components/pages/FormCancha"));
const Error404 = lazy(() => import("./components/pages/Error404"));
const QuienesSomos = lazy(() => import("./components/pages/QuienesSomos"));
const Contacto = lazy(() => import("./components/pages/Contacto"));
const AdmReservas = lazy(() => import("./components/pages/AdmReservas"));
const AdmCanchas = lazy(() => import("./components/pages/AdmCanchas"));
const CatalogoProductos = lazy(() => import("./components/pages/CatalogoProductos"));
const AdmProductos = lazy(() => import("./components/pages/AdmProductos"));
const DetalleProducto = lazy(() => import("./components/pages/DetalleProducto"));
const Carrito = lazy(() => import("./components/pages/Carrito"));
const AdmReservasClientes = lazy(() => import("./components/pages/AdmReservascliente"));

// Componente visual de carga para mostrar mientras se descarga la página
const FallbackCarga = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-zinc-400 font-medium">Cargando...</p>
  </div>
);

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(() => {
    const sesion = sessionStorage.getItem("usuarioLogueado");
    return sesion ? JSON.parse(sesion) : null;
  });

  const [loadingSession, setLoadingSession] = useState(false);
  const [carritoCount, setCarritoCount] = useState<number>(0);

  const loginBackend = async (
    email: string,
    pass: string,
  ): Promise<Usuario | null> => {
    try {
      setLoadingSession(true);
      const resp = await loginBackendApi({ email, pass });
      if (!resp.ok) return null;

      const data = await resp.json();
      setUsuarioLogueado(data);
      return data;
    } catch (error) {
      console.error("Error en login:", error);
      return null;
    } finally {
      setLoadingSession(false);
    }
  };

  const logoutBackend = async (): Promise<void> => {
    setUsuarioLogueado(null);
    localStorage.removeItem("usuario");
  };

  const refreshCarritoCount = async (): Promise<void> => {};

  useEffect(() => {
    sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
  }, [usuarioLogueado]);

  return (
    <AppContext.Provider
      value={{
        usuarioLogueado,
        setUsuarioLogueado,
        loadingSession,
        carritoCount,
        setCarritoCount,
        refreshCarritoCount,
        logoutBackend,
        loginBackend,
      }}
    >
     <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
                   <Menu />
                    <main className="w-full grow">
                       <Suspense fallback={<FallbackCarga />}>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reservas" element={<AdmReservasClientes />} />
                <Route path="/registrate" element={<RegistroUsuario />} />
                
                <Route path="/administrador" element={<ProtectorRutas />}>
                  <Route index element={<Administrador />} />
                  <Route path="/administrador/productos" element={<AdmProductos />} />
                  <Route path="/administrador/productos/crear" element={<Formulario titulo={"Crear Producto"} />} />
                  <Route path="/administrador/productos/editar/:id" element={<Formulario titulo={"Editar Producto"} />} />
                  <Route path="/administrador/reservas" element={<AdmReservas />} />
                  <Route path="/administrador/canchas" element={<AdmCanchas />} />
                  <Route path="/administrador/canchas/crear" element={<FormCancha titulo={"Crear cancha"} />} />
                  <Route path="/administrador/canchas/editar/:id" element={<FormCancha titulo={"Editar cancha"} />} />
                </Route>
                
                <Route path="/productos" element={<CatalogoProductos />} />
                <Route path="/productos/detalle/:id" element={<DetalleProducto />} />
                <Route path="/quienessomos" element={<QuienesSomos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/mis-reservas" element={<MisReservas />} />

                <Route path="*" element={<Error404 />} />
              </Routes>
            </Suspense>
          </main>
          
          
          <Footer />
        </div>
      </BrowserRouter>
      </ErrorBoundary>
    </AppContext.Provider>
  );
}

export default App;