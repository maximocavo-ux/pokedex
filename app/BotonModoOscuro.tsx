"use client";

import { useState, useEffect } from "react";

function leerPreferencia() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("modoOscuro") === "true";
}

export default function BotonModoOscuro() {
  const [oscuro, setOscuro] = useState(leerPreferencia);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", oscuro);
  }, [oscuro]);

  function alternar() {
    setOscuro((prev) => {
      const nuevo = !prev;
      localStorage.setItem("modoOscuro", String(nuevo));
      return nuevo;
    });
  }

  return (
    <button
      onClick={alternar}
      aria-label={oscuro ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={oscuro}
      className="w-8 h-8 rounded-full border-none bg-white cursor-pointer text-sm"
    >
      {oscuro ? "☀" : "🌙"}
    </button>
  );
}
