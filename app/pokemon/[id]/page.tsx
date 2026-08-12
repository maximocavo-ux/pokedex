import TipoChip from "../../TipoChip";
import Image from "next/image";
import Link from "next/link";
import { coloresPorTipo, colorDeTexto } from "../../coloresPorTipo";
import PokeballWatermark from "../../PokeballWatermark";
import {
  getPokemonDetail,
  getPokemonSpecies,
  TOTAL_POKEMON,
} from "../../lib/pokeapi";
import { nombresPorStat } from "../../nombresPorStat";
import { capitalizar } from "../../capitalizar";

const STAT_MAXIMO = 255;

function limpiarDescripcion(texto: string) {
  return texto
    .replace(/[\n\f\r\u00ad]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function DetallePokemon({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ orden?: string }>;
}) {
  const { id } = await params;
  const { orden } = await searchParams;
  const idNumero = Number(id);

  const hrefVolver = orden ? `/?orden=${orden}` : "/";

  const [pokemon, species] = await Promise.all([
    getPokemonDetail(id),
    getPokemonSpecies(id),
  ]);

  if (!pokemon) {
    return <p>No existe ese Pokémon.</p>;
  }

  const descripcionEntry =
    species?.flavor_text_entries.find(
      (entry) => entry.language.name === "es"
    ) ||
    species?.flavor_text_entries.find((entry) => entry.language.name === "en");
  const descripcion = descripcionEntry
    ? limpiarDescripcion(descripcionEntry.flavor_text)
    : "Sin descripción disponible.";

  const alturaMetros = (pokemon.height / 10).toFixed(1);
  const pesoKg = (pokemon.weight / 10).toFixed(1);

  const hayAnterior = idNumero > 1;
  const haySiguiente = idNumero < TOTAL_POKEMON;

  const colores = pokemon.types.map(
    (t) => coloresPorTipo[t.type.name] || "#eee"
  );
  const fondo =
    colores.length === 2
      ? `linear-gradient(135deg, ${colores[0]}, ${colores[1]})`
      : colores[0];

  const textoSobreFondo = colorDeTexto(colores[0]);

  return (
    <div
      style={{
        background: fondo,
        transition: "background 0.4s ease",
        padding: "24px",
        minHeight: "100vh",
        color: textoSobreFondo,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PokeballWatermark />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href={hrefVolver}
          aria-label="Volver a la lista"
          style={{
            color: textoSobreFondo,
            display: "inline-flex",
            textDecoration: "none",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 style={{ margin: 0 }}>{capitalizar(pokemon.name)}</h1>
      </div>
      <div style={{ display: "flex", gap: "4px", margin: "4px 0" }}>
        {pokemon.types.map((t) => (
          <TipoChip key={t.type.name} tipo={t.type.name} />
        ))}
      </div>
      <p>Número: {pokemon.id}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {hayAnterior ? (
          <Link
            href={`/pokemon/${idNumero - 1}${orden ? `?orden=${orden}` : ""}`}
            aria-label="Pokémon anterior"
            style={{
              color: textoSobreFondo,
              fontSize: "24px",
              textDecoration: "none",
            }}
          >
            ‹
          </Link>
        ) : (
          <span style={{ fontSize: "24px", opacity: 0.4 }}>‹</span>
        )}

        {pokemon.sprites.front_default && (
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={200}
            height={200}
          />
        )}

        {haySiguiente ? (
          <Link
            href={`/pokemon/${idNumero + 1}${orden ? `?orden=${orden}` : ""}`}
            aria-label="Pokémon siguiente"
            style={{
              color: textoSobreFondo,
              fontSize: "24px",
              textDecoration: "none",
            }}
          >
            ›
          </Link>
        ) : (
          <span style={{ fontSize: "24px", opacity: 0.4 }}>›</span>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          color: "#000000",
        }}
      >
        <div style={{ display: "flex", gap: "16px", margin: "16px 0" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: "12px" }}>{pesoKg} kg</p>
            <p style={{ fontSize: "8px", color: "#999" }}>Peso</p>
          </div>
          <div style={{ width: "1px", backgroundColor: "#eee" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: "12px" }}>{alturaMetros} m</p>
            <p style={{ fontSize: "8px", color: "#999" }}>Altura</p>
          </div>
          <div style={{ width: "1px", backgroundColor: "#eee" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            {pokemon.abilities.map((a) => (
              <p key={a.ability.name} style={{ fontSize: "12px", margin: 0 }}>
                {a.ability.name}
              </p>
            ))}
            <p style={{ fontSize: "8px", color: "#999", marginTop: "4px" }}>
              Habilidades
            </p>
          </div>
        </div>

        <p>{descripcion}</p>

        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            textAlign: "center",
            margin: "16px 0 8px",
            color: colores[0],
          }}
        >
          Base Stats
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pokemon.stats.map((s) => (
            <li
              key={s.stat.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "4px 0",
              }}
            >
              <span style={{ width: "60px", fontSize: "12px" }}>
                {nombresPorStat[s.stat.name] || s.stat.name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "8px",
                  backgroundColor: "#eee",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(s.base_stat / STAT_MAXIMO) * 100}%`,
                    height: "100%",
                    backgroundColor: colores[0],
                  }}
                />
              </div>
              <span style={{ width: "30px", fontSize: "12px" }}>
                {s.base_stat}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
