import Link from "next/link";

type PokemonListItem = {
  name: string;
  url: string;
};

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
};

export default async function Home() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
  const data = await res.json();

  const pokemones: Pokemon[] = await Promise.all(
    data.results.map(async (item: PokemonListItem) => {
      const detalle = await fetch(item.url);
      return detalle.json();
    })
  );

  return (
    <div>
      <h1>Pokédex</h1>
      <ul>
        {pokemones.map((pokemon) => (
          <li key={pokemon.id}>
            <Link href={`/pokemon/${pokemon.id}`}>
              {pokemon.sprites.front_default && (
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              )}
              {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}