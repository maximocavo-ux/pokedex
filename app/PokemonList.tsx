"use client";

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

const coloresPorTipo: Record<string, string> = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  poison: "#A040A0",
  flying: "#A890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
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
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "4px 8px",
          width: "fit-content",
        }}
      >
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ border: "none", outline: "none" }}
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "16px",
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