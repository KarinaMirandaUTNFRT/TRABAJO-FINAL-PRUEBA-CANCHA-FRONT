import { Navigate, Outlet } from "react-router";
import { useAppContext } from "../../context/AppContext";

const ProtectorRutas = () => {
  const { usuarioLogueado, loadingSession } = useAppContext();
  if (loadingSession) {
    return (
      <div className="flex justify-center items-center py-12 text-zinc-400">
        Verificando permisos...
      </div>
    );
  }
  if (!usuarioLogueado) {
    return <Navigate to="/login" replace />;
  }
  if (usuarioLogueado.rol === "cliente") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectorRutas;
