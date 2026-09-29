import { useState } from "react";
import { LuMenu, LuX, LuLogOut } from "react-icons/lu";
import { Link, NavLink, useNavigate } from "react-router";
import { useAppContext } from "../../context/AppContext";
import { GiShoppingCart } from "react-icons/gi";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { usuarioLogueado, setUsuarioLogueado, loadingSession } =
    useAppContext();
  const navegacion = useNavigate();

  const isAdmin = usuarioLogueado?.rol === "admin";

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-3 transition-colors duration-200 md:p-0 ${
      isActive
        ? "text-green-500 font-semibold"
        : "text-zinc-300 hover:text-green-600"
    }`;
  const logout = () => {
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("usuarioLogueado");
    setUsuarioLogueado(null);
    setIsMenuOpen(false);
    navegacion("/");
  };
  const nombreMostrar =
    usuarioLogueado?.nombre ||
    usuarioLogueado?.email?.split("@")[0] ||
    "Usuario";

  return (
    <nav className="bg-slate-500 border-b border-zinc-800 text-zinc-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <img
            src="https://res.cloudinary.com/ddhyg9uee/image/upload/v1788274566/rollingclub_nohrp6.png"
            alt="logo institucional"
            className="h-16 w-auto object-contain"
          />
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none transition-colors"
            >
              <span className="sr-only">Menu</span>
              {isMenuOpen ? (
                <LuX className="text-3xl" />
              ) : (
                <LuMenu className="text-3xl" />
              )}
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8 capitalize font-bold ">
              <NavLink to="/" className={navLinkStyles}>
                Inicio
              </NavLink>

              {loadingSession ? (
                <span className="px-3 py-2 text-sm text-zinc-400">
                  Cargando...
                </span>
              ) : usuarioLogueado ? (
                <>
                  {isAdmin && (
                    <NavLink to="/administrador" className={navLinkStyles}>
                      Administrador
                    </NavLink>
                  )}
                  {isAdmin && (
                    <NavLink
                      to="/administrador/productos"
                      className={navLinkStyles}
                    >
                      Productos
                    </NavLink>
                  )}
                  {!isAdmin && (
                    <NavLink
                      to={`/reservas/mis-reservas/${usuarioLogueado?._id}`}
                      className={navLinkStyles}
                    >
                      Tus Reservas
                    </NavLink>
                  )}
                  {!isAdmin && (
                    <Link
                      to="/carrito"
                      className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-800 text-green-400 px-3.5 py-1.5 rounded-lg border border-zinc-700/80 hover:border-green-500/50 transition-all text-sm font-semibold shadow-sm"
                      title="Ver mi carrito / reservas"
                    >
                      <GiShoppingCart className="text-2xl text-green-400" />
                      <span>{nombreMostrar}</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-red-900/40 text-red-400 px-4 py-2 rounded-md text-sm font-medium transition-all border border-zinc-700 hover:border-red-500/50"
                  >
                    <LuLogOut />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={navLinkStyles}>
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        } md:hidden transition-all duration-300 ease-in-out bg-zinc-900 border-t border-zinc-800`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/"
            className={navLinkStyles}
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </NavLink>
          {loadingSession ? (
            <span className="px-3 py-2 text-sm text-zinc-400">Cargando...</span>
          ) : usuarioLogueado ? (
            <>
              {isAdmin && (
                <NavLink
                  to="/administrador"
                  className={navLinkStyles}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administrador
                </NavLink>
              )}
              {isAdmin && (
                <NavLink
                  to="/administrador/productos"
                  className={navLinkStyles}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Productos
                </NavLink>
              )}
              <NavLink to="/reservas" className={navLinkStyles}>
                Tus Reservas
              </NavLink>
              {!isAdmin && (
              <Link
                to="/carrito"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 bg-zinc-800/80 text-green-400 px-3 py-2 rounded-lg border border-zinc-700/80 text-sm font-semibold my-1"
              >
                <GiShoppingCart className="text-xl" />
                <span>{nombreMostrar}</span>
              </Link>
              )}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-900/40 text-red-400 px-4 py-2 rounded-md text-sm font-medium transition-all border border-zinc-700 hover:border-red-500/50 mt-2"
              >
                <LuLogOut />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={navLinkStyles}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
