const AdmCanchas = () => {
  return (
    <section className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Panel de Administración Canchas
          </h1>
          <p className="text-zinc-500 text-sm">Gestion RollingClub</p>
        </div>
        <a className="bg-green-500 hover:bg-green-600 text-white px-3 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 gap-2 text-center">
          <i className="bi bi-plus-lg"></i>
          Alta Cancha
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-zinc-800">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                #
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Nombre Cancha
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Categoria
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                descripcion
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                precio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50"></tbody>
        </table>
      </div>
    </section>
  );
};

export default AdmCanchas;
