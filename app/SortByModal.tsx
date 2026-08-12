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
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          width: "100%",
        }}
      >
        <Image
          src={seleccionado ? "/radio-on.svg" : "/radio-off.svg"}
          alt=""
          width={16}
          height={16}
        />
        <span style={{ fontSize: "10px", color: "#1d1d1d" }}>{etiqueta}</span>
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
      style={{
        position: "absolute",
        top: "40px",
        right: 0,
        width: "113px",
        backgroundColor: "var(--color-primary)",
        borderRadius: "12px",
        boxShadow: "var(--elevation-2)",
        padding: "4px",
        zIndex: 10,
      }}
    >
      <div style={{ padding: "16px 20px 8px" }}>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          Sort by:
        </p>
      </div>
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "var(--elevation-inner)",
        }}
      >
        {opcion("numero", "Number")}
        {opcion("nombre", "Name")}
      </div>
    </div>
  );
}
