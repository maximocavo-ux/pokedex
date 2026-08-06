"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Pokemon } from "./lib/pokeapi";
import { coloresPorTipo } from "./coloresPorTipo";
import {
  CARD_ANCHO,
  CARD_ALTO,
  SPRITE_TAMANIO,
  NUMERO_ALTO,
  NOMBRE_ALTO,
} from "./pokemonCardDimensions";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const colorFondo = coloresPorTipo[pokemon.types[0]?.type.name] || "#eee";

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: CARD_ANCHO,
          height: CARD_ALTO,
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 1px rgba(0,0,0,0.20)",
          backgroundColor: "white",
        }}
      >
        <p
          style={{
            position: "absolute",
            top: 4,
            left: 8,
            right: 8,
            height: NUMERO_ALTO,
            margin: 0,
            fontSize: "8px",
            color: "#999",
          }}
        >
          #{pokemon.id}
        </p>

        {pokemon.sprites.front_default && (
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "50%",
              transform: "translateX(-50%)",
              width: SPRITE_TAMANIO,
              height: SPRITE_TAMANIO,
            }}
          >
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              fill
              sizes="72px"
              style={{ objectFit: "contain" }}
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: NOMBRE_ALTO,
            backgroundColor: `${colorFondo}33`,
            borderRadius: "0 0 8px 8px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "4px",
          }}
        >
          <span style={{ fontSize: "10px", textAlign: "center" }}>
            {pokemon.name}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando Pokémon"
      style={{
        width: CARD_ANCHO,
        height: CARD_ALTO,
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 1px rgba(0,0,0,0.20)",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 8,
          width: "24px",
          height: "8px",
          borderRadius: "4px",
          backgroundColor: "#e0e0e0",
        }}
        className="skeleton-shimmer"
      />

      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          width: SPRITE_TAMANIO,
          height: SPRITE_TAMANIO,
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
        }}
        className="skeleton-shimmer"
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: NOMBRE_ALTO,
          backgroundColor: "#f0f0f0",
          borderRadius: "0 0 8px 8px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "10px",
            borderRadius: "4px",
            backgroundColor: "#e0e0e0",
          }}
          className="skeleton-shimmer"
        />
      </div>
    </div>
  );
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, ${CARD_ANCHO}px)`,
            gap: "8px",
            padding: "12px 0",
          }}
        >
          {ordenados.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
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