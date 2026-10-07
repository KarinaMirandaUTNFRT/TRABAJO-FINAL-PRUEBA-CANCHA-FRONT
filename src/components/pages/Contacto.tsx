import { useForm } from "react-hook-form";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const Contacto = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = () => {
    alert("¡Mensaje enviado con éxito!");
    reset();
  };

  return (
    <section
      id="contacto"
      className="bg-slate-900 border border-slate-900 rounded-2xl text-white py-12 px-4 flex flex-col items-center justify-center"
    >
      <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-green-500 mb-2 tracking-tight">
          Contáctanos
        </h2>
        <p className="text-center text-slate-500 text-sm sm:text-base mb-8">
          Déjanos tu consulta o mándanos mensaje en nuestras redes abajo
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div>
            <input
              type="text"
              placeholder="Nombre y Apellido"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors"
              {...register("fullName", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.fullName && (
              <span className="text-red-400 text-xs mt-1 block"></span>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Correo"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Formato de correo inválido",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-400 text-xs mt-1 block"></span>
            )}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Número de Celular"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors"
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9+\s-]{8,15}$/,
                  message: "Ingresá un número de teléfono válido",
                },
              })}
            />
            {errors.phone && (
              <span className="text-red-400 text-xs mt-1 block"></span>
            )}
          </div>
          <div>
            <textarea
              placeholder="Escribe detalladamente aquí..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors resize-none"
              {...register("message", {
                required: "Por favor escribe tu consulta",
                minLength: {
                  value: 10,
                  message: "El mensaje debe tener al menos 10 caracteres",
                },
              })}
            ></textarea>
            {errors.message && (
              <span className="text-red-400 text-xs mt-1 block"></span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md active:scale-[0.99]"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </form>
        <div className="flex justify-center items-center gap-8 mt-10 pt-6 border-t border-slate-700/60">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-colors text-m font-medium"
          >
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[20px]">
              <FaInstagram />
            </span>
            Instagram
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-colors text-m font-medium"
          >
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[20px]">
              <FaWhatsapp />
            </span>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
