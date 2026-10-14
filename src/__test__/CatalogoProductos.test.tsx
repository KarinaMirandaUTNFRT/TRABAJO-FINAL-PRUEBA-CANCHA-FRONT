/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router";
import Inicio from "../components/pages/CatalogoProductos";


describe("Componente Catálogo de Productos - Pruebas Principales", () => {
  it("1. Renderiza correctamente la vista o contenedor del catálogo", () => {
    render(
      <BrowserRouter>
         <Inicio /> 
      </BrowserRouter>
    );
     expect(screen.getByText(/Catálogo de Productos/i)).toBeDefined();
  });

  it("2. Muestra el campo de búsqueda de productos", () => {
    render(
      <BrowserRouter>
        <Inicio /> 
      </BrowserRouter>
    );
     expect(screen.getByPlaceholderText(/Buscar producto/i)).toBeDefined();
  });

  it("3. Permite ingresar texto en el buscador para filtrar elementos", () => {
    render(
      <BrowserRouter>
        <Inicio /> 
      </BrowserRouter>
    );
     const inputBusqueda = screen.getByPlaceholderText(/Buscar producto/i) as HTMLInputElement;
     fireEvent.change(inputBusqueda, { target: { value: "pelota" } });
     expect(inputBusqueda.value).toBe("pelota");
  });

  it("4. Muestra opciones de filtrado o categorías", () => {
    render(
      <BrowserRouter>
        <Inicio /> 
      </BrowserRouter>
    );
     expect(screen.getByText(/Todas las categorías/i)).toBeDefined();
  });

  it("5. Maneja correctamente el estado cuando no hay productos disponibles", () => {
    render(
      <BrowserRouter>
        <Inicio /> 
      </BrowserRouter>
    );
     expect(screen.getByText(/No se encontraron productos/i)).toBeDefined();
  });
});