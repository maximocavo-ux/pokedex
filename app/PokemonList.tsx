"use client";

import type { Pokemon } from "./lib/pokeapi";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { coloresPorTipo } from "./coloresPorTipo";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ListaConOrden({ pokemones }: { pokemones: Pokemon[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orden = searchParams.get("orden") || "numero";

  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounced, setBusquedaDebounced] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  function cambiarOrden(nuevoOrden: string) {
    router.push(`?orden=${nuevoOrden}`);
  }

  const filtrados = pokemones.filter((pokemon) =>
    normalizar(pokemon.name).includes(normalizar(busquedaDebounced))
  );

  const ordenados = [...filtrados].sort((a, b) => {
    if (orden === "nombre") {
      return a.name.localeCompare(b.name);
    }
    return a.id - b.id;
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "280px",
          height: "32px",
          borderRadius: "16px",
          border: "1px solid #ccc",
          padding: "8px 16px 8px 12px",
          boxSizing: "border-box",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <label htmlFor="busqueda-pokemon" style={{ display: "none" }}>
          Buscar Pokémon por nombre
        </label>
        <input
          id="busqueda-pokemon"
          type="search"
          placeholder="Buscar Pokémon..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "14px",
          }}
        />

        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            aria-label="Limpiar búsqueda"
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "16px",
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
        <button
          onClick={() => cambiarOrden("numero")}
          style={{
            fontWeight: orden === "numero" ? "bold" : "normal",
            padding: "4px 12px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: orden === "numero" ? "#eee" : "white",
          }}
        >
          Número
        </button>
        <button
          onClick={() => cambiarOrden("nombre")}
          style={{
            fontWeight: orden === "nombre" ? "bold" : "normal",
            padding: "4px 12px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: orden === "nombre" ? "#eee" : "white",
          }}
        >
          Nombre
        </button>
      </div>

      {ordenados.length === 0 ? (
        <p>No se encontró ningún Pokémon con ese nombre.</p>
      ) : (
        <ul>
          {ordenados.map((pokemon) => (
            <li key={pokemon.id}>
              <Link href={`/pokemon/${pokemon.id}?orden=${orden}`}>
                {pokemon.sprites.front_default && (
                  <Image
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width={96}
                    height={96}
                  />
                )}
                {pokemon.name}
                {" "}
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    style={{
                      backgroundColor: coloresPorTipo[t.type.name] || "#999",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      marginRight: "4px",
                    }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PokemonList({ pokemones }: { pokemones: Pokemon[] }) {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ListaConOrden pokemones={pokemones} />
    </Suspense>
  );
}