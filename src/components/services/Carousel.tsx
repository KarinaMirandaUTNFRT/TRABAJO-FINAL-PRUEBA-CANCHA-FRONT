import { useState, useEffect } from "react";

export interface Slide {
  url: string;
  title: string;
  description: string;
}
interface CarouselProps {
  slides?: Slide[];
  autoSlideInterval?: number;
}

const defaultSlides: Slide[] = [
  {
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    title: "Viví la Pasión Nocturna",
    description:
      "Sistema de iluminación LED profesional para que juegues tus partidos a toda hora sin perderte un detalle del juego.",
  },
  {
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    title: "Césped Sintético de Última Generación",
    description:
      "Superficie de alta absorción de impacto que cuida tus articulaciones y garantiza un pique óptimo de la pelota.",
  },
  {
    url: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80",
    title: "Reservá tu Cancha en Segundos",
    description:
      "Elegí el día, la hora y el tipo de cancha desde tu celular de forma rápida y sin complicaciones.",
  },
];

export default function Carousel({
  slides = defaultSlides,
  autoSlideInterval = 4000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const prevSlide = (): void => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (): void => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number): void => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, autoSlideInterval, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="h-100 w-full mb-10 relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="w-full h-full bg-center bg-cover duration-500 relative flex items-end p-8 transition-all"
      >
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl text-white max-w-lg">
          <h2 className="text-2xl font-bold mb-2">
            {slides[currentIndex].title}
          </h2>
          <p className="text-sm text-gray-200">
            {slides[currentIndex].description}
          </p>
        </div>
      </div>
      <button
        onClick={prevSlide}
        aria-label="Diapositiva anterior"
        className="hidden group-hover:block absolute top-[50%] translate-y-[-50%] left-8 text-2xl rounded-full p-3 bg-black/50 text-white cursor-pointer hover:bg-black/80 transition"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        aria-label="Diapositiva siguiente"
        className="hidden group-hover:block absolute top-[50%] translate-y-[-50%] right-8 text-2xl rounded-full p-3 bg-black/50 text-white cursor-pointer hover:bg-black/80 transition"
      >
        &#10095;
      </button>
      <div className="flex justify-center gap-2 pt-4">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
            className={`h-3 rounded-full transition-all cursor-pointer ${
              currentIndex === slideIndex
                ? "w-8 bg-green-600"
                : "w-3 bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
