import type { Cancha } from "../../interfaces/canchas";

interface CardCanchaProps {
  cancha: Cancha;
  onVerTurnos: (cancha: Cancha) => void;
}

const CardCancha = ({ cancha, onVerTurnos }: CardCanchaProps) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border-b-4 border-green-600 hover:shadow-2xl transition-shadow duration-300 relative flex flex-col mx-auto">
      <div className="relative h-52 w-full bg-slate-200">
        <img
          src={cancha.imagen}
          alt={`Imagen de la cancha ${cancha.nombreCancha}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-linear-to-r from-green-500 to-green-700 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-white/20">
          {cancha.categoria.nombre}
        </div>
      </div>
      <div className="p-5 flex flex-col grow">
        <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-2">
          {cancha.nombreCancha}
        </h3>
        <p className="text-slate-600 text-sm mb-6 line-clamp-3">
          {cancha.descripcion}
        </p>
        <div className="flex justify-center items-end border-t-2 border-dashed border-green-200 pt-4 mt-auto">
          <button
            onClick={() => onVerTurnos(cancha)}
            className="bg-slate-900 hover:bg-green-600 text-white font-bold py-2.5 px-3 rounded-xl shadow-md transition-colors duration-300 transform active:scale-95 uppercase text-[10px] tracking-wider text-center max-w-32.5 cursor-pointer"
          >
            Ver Turnos disponibles
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCancha;
