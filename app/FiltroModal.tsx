"use client";

import { useEffect, useRef } from "react";

type FiltroModalProps = {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
};

export default function FiltroModal({
  titulo,
  onCerrar,
  children,
}: FiltroModalProps) {
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

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      tabIndex={-1}
      className="absolute top-10 right-0 w-[280px] rounded-xl p-1 z-10"
      style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--elevation-2)",
      }}
    >
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs font-bold text-white m-0">{titulo}</p>
      </div>
      <div
        className="relative bg-white rounded-lg p-3 flex flex-wrap gap-1.5"
        style={{ boxShadow: "var(--elevation-inner)" }}
      >
        {children}
      </div>
    </div>
  );
}
