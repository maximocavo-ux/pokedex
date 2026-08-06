import Image from "next/image";
import Link from "next/link";
import { coloresPorTipo, colorDeTexto } from "../../coloresPorTipo";
import { getPokemonDetail, getPokemonSpecies } from "../../lib/pokeapi";

const TOTAL_POKEMON = 50;
const STAT_MAXIMO = 255;

function limpiarDescripcion(texto: string) {
  return texto.replace(/[\n\f\r\u00ad]/g, " ").replace(/\s+/g, " ").trim();
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

  const descripcionEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === "es"
  ) || species.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );
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
      }}
    >
      <Link href={hrefVolver} style={{ color: textoSobreFondo }}>
        ← Volver
      </Link>
      <h1>{pokemon.name}</h1>
      <p>Número: {pokemon.id}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {hayAnterior ? (
          <Link
            href={`/pokemon/${idNumero - 1}${orden ? `?orden=${orden}` : ""}`}
            aria-label="Pokémon anterior"
            style={{ color: textoSobreFondo }}
          >
            ← Anterior
          </Link>
        ) : (
          <span style={{ opacity: 0.4 }}>← Anterior</span>
        )}

        {pokemon.sprites.front_default && (
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={150}
            height={150}
          />
        )}

        {haySiguiente ? (
          <Link
            href={`/pokemon/${idNumero + 1}${orden ? `?orden=${orden}` : ""}`}
            aria-label="Pokémon siguiente"
            style={{ color: textoSobreFondo }}
          >
            Siguiente →
          </Link>
        ) : (
          <span style={{ opacity: 0.4 }}>Siguiente →</span>
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
        <p>{descripcion}</p>

        <div style={{ display: "flex", gap: "24px", margin: "16px 0" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#999" }}>Peso</p>
            <p>{pesoKg} kg</p>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#999" }}>Altura</p>
            <p>{alturaMetros} m</p>
          </div>
        </div>

        <h2>Stats</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pokemon.stats.map((s) => (
            <li
              key={s.stat.name}
              style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}
            >
              <span style={{ width: "60px", fontSize: "12px" }}>
                {s.stat.name}
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