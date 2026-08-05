"use client";

import { useState } from "react";
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

export default function PokemonList({ pokemones }: { pokemones: Pokemon[] }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = pokemones.filter((pokemon) =>
    pokemon.name.includes(busqueda.toLowerCase())
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
              {" — "}
              {pokemon.types.map((t) => t.type.name).join(", ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}