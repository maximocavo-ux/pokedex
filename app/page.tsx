import Image from "next/image";
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
  types: {
    type: { name: string };
  }[];
};

async function getPokemon(): Promise<Pokemon[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener la lista de Pokémon: ${res.status}`);
  }

  const data: { results: PokemonListItem[] } = await res.json();

  return Promise.all(
    data.results.map(async (item) => {
      const detalle = await fetch(item.url, { next: { revalidate: 3600 } });
      if (!detalle.ok) {
        throw new Error(`Error al obtener ${item.name}: ${detalle.status}`);
      }
      return detalle.json();
    })
  );
}

export default async function Home() {
  const pokemones = await getPokemon();

  return (
    <div>
      <h1>Pokédex</h1>
      <ul>
        {pokemones.map((pokemon) => (
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