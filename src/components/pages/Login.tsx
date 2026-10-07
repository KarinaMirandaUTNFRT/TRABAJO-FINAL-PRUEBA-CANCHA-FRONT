import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { httpClient } from "../../helpers/httpClient";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const { setUsuarioLogueado } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navegacion = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
       const resultado: any = await httpClient.post("/usuarios/login", data);

      if (resultado) {
        const datosSesion = {
          _id: resultado.id || resultado._id,
          email: resultado.email,
          nombre: resultado.nombre,
          rol: resultado.rol,
          token: resultado.token || resultado.jwt, // Aseguramos guardar el token en la sesión
        };

        sessionStorage.setItem("usuarioLogueado", JSON.stringify(datosSesion));
        setUsuarioLogueado(datosSesion);

        if (resultado.rol?.toLowerCase() === "admin") {
          Swal.fire({
            title: `Bienvenido Administrador`,
            text: `Hola ${resultado.nombre}, ingresando al panel de control`,
            icon: "success",
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonColor: "#3b82f6",
          });
          navegacion("/administrador");
        } else {
          Swal.fire({
            title: `Bienvenido/a`,
            text: `Hola ${resultado.nombre}, ingresando al sistema`,
            icon: "success",
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonColor: "#3b82f6",
          });
          navegacion("/");
        }
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Ocurrió un error",
        text: error?.message || "Credenciales incorrectas o error de conexión",
        icon: "error",
        background: "#18181b",
        color: "#f4f4f5",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <section className="flex grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Accede al panel de{" "}
            <span className="text-green-500 font-semibold">RollingClub</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-zinc-950 border ${errors.email ? "border-red-500" : "border-zinc-700"} rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                placeholder="correo@dominio.com"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email no válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 italic">
                  {String(errors.email?.message || "")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 bg-zinc-950 border ${errors.password ? "border-red-500" : "border-zinc-700"} rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 italic">
                  {String(errors.password?.message || "")}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-blue-500 transition-all active:scale-95"
            >
              Ingresar al sistema
            </button>
          </div>
          <p className="text-center text-sm text-[#64748B] mt-6">
            ¿No tienes cuenta?{" "}
            <a
              href="/registrate"
              className="text-green-500 hover:text-green-600 font-semibold"
            >
              Click Aqui
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;