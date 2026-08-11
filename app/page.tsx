import PokemonList from "./PokemonList";
import { getPokemonList, idDesdeUrl } from "./lib/pokeapi";

const TOTAL_POKEMON = 1302;

export default async function Home() {
  const lista = await getPokemonList(TOTAL_POKEMON);

  const pokemonesLivianos = lista.results.map((item) => ({
    name: item.name,
    id: idDesdeUrl(item.url),
  }));

  return (
    <div>
      <h1>Pokédex</h1>
      <PokemonList pokemones={pokemonesLivianos} />
    </div>
  );
}
