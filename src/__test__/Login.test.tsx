/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router";
import Login from "../components/pages/Login"; 



// Mock del contexto de la aplicación
vi.mock("../../context/AppContext", () => ({
  useAppContext: () => ({
    setUsuarioLogueado: vi.fn(),
  }),
}));

describe("Componente Login - Pruebas Principales", () => {
  it("1. Renderiza el título de inicio de sesión correctamente", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText(/Iniciar Sesión/i)).toBeDefined();
  });

  it("2. Muestra los campos de entrada de correo y contraseña", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeDefined();
    expect(screen.getByLabelText(/Contraseña/i)).toBeDefined();
  });

  it("3. Muestra errores de validación si se intenta enviar el formulario vacío", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const botonIngresar = screen.getByRole("button", { name: /Ingresar al sistema/i });
    fireEvent.click(botonIngresar);

    expect(await screen.findByText(/El email es obligatorio/i)).toBeDefined();
    expect(await screen.findByText(/La contraseña es obligatoria/i)).toBeDefined();
  });

  it("4. Permite escribir correctamente en el campo de correo electrónico", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const inputEmail = screen.getByLabelText(/Correo Electrónico/i) as HTMLInputElement;
    fireEvent.change(inputEmail, { target: { value: "admin@rollingclub.com" } });

    expect(inputEmail.value).toBe("admin@rollingclub.com");
  });

  it("5. Permite escribir correctamente en el campo de contraseña", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const inputPassword = screen.getByLabelText(/Contraseña/i) as HTMLInputElement;
    fireEvent.change(inputPassword, { target: { value: "Password123*" } });

    expect(inputPassword.value).toBe("Password123*");
  });
});