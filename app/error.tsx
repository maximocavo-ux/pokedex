"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorLista({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>No se pudo cargar la Pokédex: {error.message}</p>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  );
}