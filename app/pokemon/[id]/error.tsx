"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorDetalle({
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
      <p>Algo salió mal: {error.message}</p>
      <button onClick={() => reset()}>Reintentar</button>
      <br />
      <Link href="/">← Volver a la lista</Link>
    </div>
  );
}