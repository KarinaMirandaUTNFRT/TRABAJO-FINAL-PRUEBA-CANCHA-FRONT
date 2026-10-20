import { useSearchParams, useNavigate } from "react-router";

const CheckoutResultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mercado Pago envía 'collection_status' o 'status'
  const status = searchParams.get("collection_status") || searchParams.get("status");
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

  const esExitoso = status === "approved";
  const esPendiente = status === "pending" || status === "in_process";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {esExitoso && (
        <div className="bg-zinc-900 border border-emerald-500/30 p-8 rounded-2xl max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Pago Confirmado!</h2>
          <p className="text-zinc-400 mb-4">
            Tu reserva ha sido procesada con éxito.
          </p>
          {paymentId && (
            <p className="text-xs text-zinc-500 mb-6">
              Comprobante N°: <span className="font-mono text-zinc-400">{paymentId}</span>
            </p>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/mis-reservas")}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Ver mis reservas
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}

      {esPendiente && (
        <div className="bg-zinc-900 border border-amber-500/30 p-8 rounded-2xl max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ⏳
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Pago Pendiente</h2>
          <p className="text-zinc-400 mb-6">
            Tu pago está siendo procesado. Te notificaremos cuando se acredite.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full inline-block py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Ir a mis reservas
          </button>
        </div>
      )}

      {!esExitoso && !esPendiente && (
        <div className="bg-zinc-900 border border-red-500/30 p-8 rounded-2xl max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✕
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No se completó el pago</h2>
          <p className="text-zinc-400 mb-6">
            La operación fue cancelada o no pudo procesarse.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full inline-block py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutResultado;