"use client";

import { coloresPorTipo } from "./coloresPorTipo";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: {
    type: { name: string };
  }[];
};

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function PokemonList({ pokemones }: { pokemones: Pokemon[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounced, setBusquedaDebounced] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const filtrados = pokemones.filter((pokemon) =>
    normalizar(pokemon.name).includes(normalizar(busquedaDebounced))
  );

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

      {filtrados.length === 0 ? (
        <p>No se encontró ningún Pokémon con ese nombre.</p>
      ) : (
        <ul>
          {filtrados.map((pokemon) => (
            <li key={pokemon.id}>
              <Link href={`/pokemon/${pokemon.id}`}>
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