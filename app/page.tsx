import PokemonList from "./PokemonList";
import { getPokemonList, idDesdeUrl, TOTAL_POKEMON } from "./lib/pokeapi";

export default async function Home() {
  const lista = await getPokemonList(TOTAL_POKEMON);

  const pokemonesLivianos = lista.results.map((item) => ({
    name: item.name,
    id: idDesdeUrl(item.url),
  }));

  return (
    <div>
      <PokemonList pokemones={pokemonesLivianos} />
    </div>
  );
}
