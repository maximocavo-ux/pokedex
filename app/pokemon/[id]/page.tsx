import Image from "next/image";
import Link from "next/link";

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
};

const TOTAL_POKEMON = 20;

export default async function DetallePokemon({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNumero = Number(id);

  let res: Response;
  try {
    res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
      next: { revalidate: 3600 },
    });
  } catch (error) {
    throw new Error("No se pudo conectar con la PokéAPI. Revisá tu conexión.");
  }

  if (res.status === 404) {
    return <p>No existe ese Pokémon.</p>;
  }

  if (!res.ok) {
    throw new Error(`La PokéAPI respondió con un error (${res.status}).`);
  }

  const pokemon: Pokemon = await res.json();

  const hayAnterior = idNumero > 1;
  const haySiguiente = idNumero < TOTAL_POKEMON;

  return (
    <div>
      <Link href="/">← Volver</Link>
      <h1>{pokemon.name}</h1>
      <p>Número: {pokemon.id}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {hayAnterior ? (
          <Link href={`/pokemon/${idNumero - 1}`} aria-label="Pokémon anterior">
            ← Anterior
          </Link>
        ) : (
          <span style={{ color: "#ccc" }}>← Anterior</span>
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
          <Link href={`/pokemon/${idNumero + 1}`} aria-label="Pokémon siguiente">
            Siguiente →
          </Link>
        ) : (
          <span style={{ color: "#ccc" }}>Siguiente →</span>
        )}
      </div>

      <h2>Stats</h2>
      <ul>
        {pokemon.stats.map((s) => (
          <li key={s.stat.name}>
            {s.stat.name}: {s.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
}