import { useState } from "react";
import SelectorCancha from "./SelectorCancha";
import CalendarioReservas from "./CalendarioReservas";
import type { Cancha } from "../../interfaces/canchas";

interface SistemaReservasProps {
  canchas: Cancha[];
}

export default function SistemaReservas({ canchas }: SistemaReservasProps) {
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(
    null,
  );

  return (
    <main className="min-h-screen bg-slate-400 rounded-4xl p-6 md:p-10 font-sans text-slate-800">
      <header className="max-w-6xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-emerald-600  text-3xl font-bold tracking-wider  uppercase flex items-center justify-center md:justify-start gap-2">
          ⚽ Reserva tu partido
        </h1>
      </header>
      {!canchaSeleccionada ? (
        <SelectorCancha
          canchas={canchas}
          onSeleccionarCancha={setCanchaSeleccionada}
        />
      ) : (
        <CalendarioReservas />
      )}
    </main>
  );
}
