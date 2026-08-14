"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type SortByModalProps = {
  orden: string;
  onCambiarOrden: (nuevoOrden: string) => void;
  onCerrar: () => void;
};

export default function SortByModal({
  orden,
  onCambiarOrden,
  onCerrar,
}: SortByModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function manejarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }

      if (e.key !== "Tab" || !modalRef.current) {
        return;
      }

      const elementosFocables = modalRef.current.querySelectorAll<HTMLElement>(
        "button, [tabindex]:not([tabindex='-1'])"
      );
      if (elementosFocables.length === 0) return;

      const primero = elementosFocables[0];
      const ultimo = elementosFocables[elementosFocables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", manejarTecla);
    return () => document.removeEventListener("keydown", manejarTecla);
  }, [onCerrar]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  function opcion(valor: string, etiqueta: string) {
    const seleccionado = orden === valor;
    return (
      <button
        onClick={() => onCambiarOrden(valor)}
        role="radio"
        aria-checked={seleccionado}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 w-full"
      >
        <Image
          src={seleccionado ? "/radio-on.svg" : "/radio-off.svg"}
          alt=""
          width={16}
          height={16}
        />
        <span className="text-[10px]" style={{ color: "var(--color-dark)" }}>
          {etiqueta}
        </span>
      </button>
    );
  }

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ordenar por"
      tabIndex={-1}
      className="absolute top-10 right-0 w-[113px] rounded-xl p-1 z-10"
      style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--elevation-2)",
      }}
    >
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs font-bold text-white m-0">Sort by:</p>
      </div>
      <div
        className="relative bg-white rounded-lg px-5 py-4 flex flex-col gap-4"
        style={{ boxShadow: "var(--elevation-inner)" }}
      >
        {opcion("numero", "Number")}
        {opcion("nombre", "Name")}
      </div>
    </div>
  );
}
