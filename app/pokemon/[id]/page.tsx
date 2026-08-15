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
      className="p-6 min-h-screen relative overflow-hidden transition-[background] duration-500 ease-in-out"
      style={{ background: fondo, color: textoSobreFondo }}
    >
      <PokeballWatermark />

      <div className="flex items-center gap-3">
        <Link
          href={hrefVolver}
          aria-label="Volver a la lista"
          className="inline-flex no-underline"
          style={{ color: textoSobreFondo }}
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
        <h1 className="m-0">{capitalizar(pokemon.name)}</h1>
      </div>
      <div className="flex gap-1 my-1">
        {pokemon.types.map((t) => (
          <TipoChip key={t.type.name} tipo={t.type.name} />
        ))}
      </div>
      <p>Número: {pokemon.id}</p>

      <div className="flex items-center justify-center gap-4">
        {hayAnterior ? (
          <Link
            href={`/pokemon/${idNumero - 1}${orden ? `?orden=${orden}` : ""}`}
            aria-label="Pokémon anterior"
            className="text-2xl no-underline"
            style={{ color: textoSobreFondo }}
          >
            ‹
          </Link>
        ) : (
          <span className="text-2xl opacity-40">‹</span>
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
            className="text-2xl no-underline"
            style={{ color: textoSobreFondo }}
          >
            ›
          </Link>
        ) : (
          <span className="text-2xl opacity-40">›</span>
        )}
      </div>

      <div
        className="bg-white rounded-lg p-5"
        style={{ color: "var(--color-dark)" }}
      >
        <div className="flex gap-4 my-4">
          <div className="flex-1 text-center">
            <p className="text-xs">{pesoKg} kg</p>
            <p className="text-[8px] text-[#999]">Peso</p>
          </div>
          <div className="w-px bg-[#eee]" />
          <div className="flex-1 text-center">
            <p className="text-xs">{alturaMetros} m</p>
            <p className="text-[8px] text-[#999]">Altura</p>
          </div>
          <div className="w-px bg-[#eee]" />
          <div className="flex-1 text-center">
            {pokemon.abilities.map((a) => (
              <p key={a.ability.name} className="text-xs m-0">
                {a.ability.name}
              </p>
            ))}
            <p className="text-[8px] text-[#999] mt-1">Habilidades</p>
          </div>
        </div>

        <p>{descripcion}</p>

        <h2
          className="text-base font-bold text-center my-4"
          style={{ color: colores[0] }}
        >
          Base Stats
        </h2>
        <ul className="list-none p-0">
          {pokemon.stats.map((s) => (
            <li key={s.stat.name} className="flex items-center gap-2 my-1">
              <span className="w-[60px] text-xs">
                {nombresPorStat[s.stat.name] || s.stat.name}
              </span>
              <div className="flex-1 h-2 bg-[#eee] rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${(s.base_stat / STAT_MAXIMO) * 100}%`,
                    backgroundColor: colores[0],
                  }}
                />
              </div>
              <span className="w-[30px] text-xs">{s.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
