import { describe, it, expect } from "vitest";
import { colorDeTexto } from "./coloresPorTipo";

describe("colorDeTexto", () => {
  it("devuelve negro para un color claro", () => {
    expect(colorDeTexto("#F8D030")).toBe("#000000");
  });

  it("devuelve blanco para un color oscuro", () => {
    expect(colorDeTexto("#705898")).toBe("#ffffff");
  });

  it("devuelve blanco para negro puro", () => {
    expect(colorDeTexto("#000000")).toBe("#ffffff");
  });

  it("devuelve negro para blanco puro", () => {
    expect(colorDeTexto("#ffffff")).toBe("#000000");
  });
});
