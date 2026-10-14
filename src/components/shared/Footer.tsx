import { Link } from "react-router";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t-4 border-green-600 text-slate-400 pb-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center h-40">
            <img
              src="https://res.cloudinary.com/ddhyg9uee/image/upload/v1788274566/rollingclub_nohrp6.png"
              alt="Logo institucional"
              className="h-50"
            />
          </div>
          <p className="text-sm font-medium uppercase tracking-wide text-center">
            &copy; {currentYear}{" "}
            <span className="text-white font-bold">
              RollingClub todos los derechos reservados
            </span>
          </p>
          <div className="w-32 border-t-2 border-dashed border-green-500/30 my-3"></div>
          <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Link className="hover:text-green-400 cursor-pointer transition-colors duration-300" 
            to="*">Privacidad</Link>
            <span className="text-green-700/50">•</span>
            <Link className="hover:text-green-400 cursor-pointer transition-colors duration-300" 
            to="/contacto">Contacto</Link>
            <span className="text-green-700/50">•</span>
            <Link className="hover:text-green-400 cursor-pointer transition-colors duration-300" 
            to="/quienessomos">Nosotros</Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
