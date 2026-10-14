import type { Cancha } from "../../interfaces/canchas";
import CardCancha from "../services/CardCancha";

interface SelectorCanchaProps {
  canchas: Cancha[];
  onSeleccionarCancha: (cancha: Cancha) => void;
}
export default function SelectorCancha({
  onSeleccionarCancha,
  canchas,
}: SelectorCanchaProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-700 mb-6">
        Primer pase: Elegí la cancha
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {canchas.map((canchaItem) => (
          <CardCancha
            key={canchaItem._id}
            cancha={canchaItem}
            onVerTurnos={onSeleccionarCancha}
          />
        ))}
      </div>
    </div>
  );
}