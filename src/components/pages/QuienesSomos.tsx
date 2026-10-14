const QuienesSomos = () => {
  const teamMembers = [
    {
      name: "Gabriel Funes",
      role: "Frontend Developer",
      img: "https://res.cloudinary.com/klxcmac0/image/upload/v1788881274/Gaby_Funes.jpg",
    },
    {
      name: "Ingacio Holmquist",
      role: "Frontend Developer",
      img: "https://res.cloudinary.com/klxcmac0/image/upload/v1788876459/Ignacio_Holmquist.jpg",
    },
    {
      name: "Patricio Moyano",
      role: "Frontend Developer",
      img: "https://res.cloudinary.com/klxcmac0/image/upload/v1788876102/Patricio_Moyano.png",
    },
    {
      name: "Nair Paez",
      role: "Backend Developer",
      img: "https://res.cloudinary.com/klxcmac0/image/upload/v1788881254/Nair_Paez.jpg",
    },
    {
      name: "Karina Miranda",
      role: "Backend Developer",
      img: "https://res.cloudinary.com/klxcmac0/image/upload/v1788875583/Karina_Miranda_2.jpg.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-400 border border-slate-400/50 rounded-2xl text-white flex flex-col justify-between font-sans">
      <main className="max-w-5xl mx-auto px-4 py-12 grow flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-green-600 tracking-tight">
          ¿Quiénes somos?
        </h2>
        <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-green-600 tracking-tight">
          Equipo de Desarrollo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mb-16">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col items-center shadow-lg transition-transform hover:scale-105 hover:border-[#4ADE80]"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 mb-4 shadow-md">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-white">
                {member.name}
              </h3>
              <p className="text-sm text-slate-500 text-center mt-1 font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full text-center shadow-xl">
          <h3 className="text-2xl font-bold text-green-400 mb-4">
            Rolling Club
          </h3>
          <p className="text-white leading-relaxed max-w-2xl mx-auto text-base sm:text-lg">
            En RollingClub resolvemos lo más difícil del fútbol: que el partido
            realmente se juegue. Sabemos lo complejo que es coordinar con los
            pibes, encontrar cancha a última hora y conseguir horarios potables.
            Nuestra plataforma te permite alquilar tu cancha en solo dos clics,
            con disponibilidad en tiempo real y sin vueltas. Además, podés
            resolver todo el tercer tiempo desde la app: sumá las bebidas, la
            picada o el equipamiento que te falte directamente en tu reserva.
            Vos poné la fecha; nosotros nos encargamos del resto.
          </p>
        </div>
      </main>
    </div>
  );
};

export default QuienesSomos;
