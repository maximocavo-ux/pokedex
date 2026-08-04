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

export default async function DetallePokemon({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!res.ok) {
    return <p>No existe ese Pokémon.</p>;
  }

  const pokemon: Pokemon = await res.json();

  return (
    <div>
      <Link href="/">← Volver</Link>
      <h1>{pokemon.name}</h1>
      <p>Número: {pokemon.id}</p>
      {pokemon.sprites.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      )}
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