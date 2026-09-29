// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

// 1. Definimos las interfaces para Props y State
interface Props {
  children?: ReactNode;
  fallback?: ReactNode; // Interfaz alternativa opcional para mostrar cuando hay un error
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // 2. Este método se llama cuando un componente hijo lanza un error.
  // Permite actualizar el estado para mostrar la UI de repuesto (fallback).
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // 3. Este método se usa para registrar el error (puedes conectarlo a Sentry, Datadog, etc.)
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Puedes renderizar el prop 'fallback' si se proporcionó, 
      // o una interfaz de error genérica por defecto.
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-100 p-6 text-center bg-zinc-950 text-zinc-100 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-bold text-rose-500 mb-4">¡Ups! Algo salió mal.</h2>
          <p className="text-zinc-400 mb-6">
            Ha ocurrido un error inesperado en esta parte de la aplicación.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    // Si no hay errores, renderiza los componentes hijos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;