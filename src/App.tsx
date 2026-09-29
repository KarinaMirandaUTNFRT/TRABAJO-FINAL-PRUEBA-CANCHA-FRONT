import Administrador from "./components/pages/Administrador";
import Formulario from "./components/pages/Formulario";
import FormCancha from "./components/pages/FormCancha";
import Inicio from "./components/pages/Inicio";
import Login from "./components/pages/Login";
import Footer from "./components/shared/Footer";
import Menu from "./components/shared/Menu";
import Error404 from "./components/pages/Error404";
import QuienesSomos from "./components/pages/QuienesSomos";
import Contacto from "./components/pages/Contacto";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectorRutas from "./components/routes/ProtectorRutas";
import RegistroUsuario from "./components/pages/RegistroUsuario";
import AdmReservas from "./components/pages/AdmReservas";
import AdmCanchas from "./components/pages/AdmCanchas";
import { useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import CatalogoProductos from "./components/pages/CatalogoProductos";
import AdmProductos from "./components/pages/AdmProductos";
import DetalleProducto from "./components/pages/DetalleProducto";
import Carrito from "./components/pages/Carrito";
import type { Usuario } from "./interfaces/usuarios";
import AdmReservasClientes from "./components/pages/AdmReservascliente";
import { loginBackendApi } from "./helpers/queries";

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(() => {
    const sesion = sessionStorage.getItem("usuarioLogueado");
    return sesion ? JSON.parse(sesion) : null;
  });

  const [loadingSession, setLoadingSession] = useState(false);

  //const [loadingSession ] = useState<boolean>(true);

  const [carritoCount, setCarritoCount] = useState<number>(0);
  // Funciones requeridas por la interfaz
  // const loginBackend = async (email: string, pass: string): Promise<Usuario | null> => {
  //   // Lógica de login o llamada a tu helper
  //   return null;
  // };
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
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
          <Menu />
          <main className="w-full grow">
            <Routes>
              <Route path="/" element={<Inicio></Inicio>} />
              <Route path="/login" element={<Login></Login>} />
              <Route path="/reservas" element={<AdmReservasClientes />} />
              <Route path="/registrate" element={<RegistroUsuario />} />
              <Route path="/administrador" element={<ProtectorRutas />}>
                <Route index element={<Administrador />} />
                <Route
                  path="/administrador/productos"
                  element={<AdmProductos></AdmProductos>}
                />
                <Route
                  path="/administrador/productos/crear"
                  element={<Formulario titulo={"Crear Producto"}></Formulario>}
                />
                <Route
                  path="/administrador/productos/editar/:id"
                  element={<Formulario titulo={"Editar Producto"}></Formulario>}
                />
                <Route
                  path="/administrador/reservas"
                  element={<AdmReservas></AdmReservas>}
                />
                <Route
                  path="/administrador/canchas"
                  element={<AdmCanchas></AdmCanchas>}
                />
                <Route
                  path="/administrador/canchas/crear"
                  element={<FormCancha titulo={"Crear cancha"}></FormCancha>}
                />
                <Route
                  path="/administrador/canchas/editar/:id"
                  element={<FormCancha titulo={"Editar cancha"}></FormCancha>}
                />
              </Route>
              <Route
                path="/productos"
                element={<CatalogoProductos></CatalogoProductos>}
              />
              <Route
                path="/productos/detalle/:id"
                element={<DetalleProducto />}
              />
              <Route path="*" element={<Error404></Error404>} />
              <Route
                path="/quienessomos"
                element={<QuienesSomos></QuienesSomos>}
              />
              <Route path="/contacto" element={<Contacto></Contacto>} />
              <Route path="/carrito" element={<Carrito />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
export default App;
