import PokemonList from "./PokemonList";
import { getPokemonList, getPokemonDetail, type Pokemon } from "./lib/pokeapi";

const LIMITE = 50;

export default async function Home() {
  const lista = await getPokemonList(LIMITE);

  const pokemones = await Promise.all(
    lista.results.map(async (item) => {
      const detalle = await getPokemonDetail(item.name);
      if (!detalle) {
        throw new Error(`No se encontró el Pokémon ${item.name}.`);
      }
      return detalle;
    })
  );

  return (
    <div>
      <h1>Pokédex</h1>
      <PokemonList pokemones={pokemones} />
    </div>
  );
}