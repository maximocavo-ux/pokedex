import { PokemonCardSkeleton } from "./PokemonList";
import { CARD_ANCHO } from "./pokemonCardDimensions";

const CANTIDAD_SKELETONS = 12;

export default function Loading() {
  return (
    <div>
      <h1>Pokédex</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, ${CARD_ANCHO}px)`,
          gap: "8px",
          padding: "12px 0",
        }}
      >
        {Array.from({ length: CANTIDAD_SKELETONS }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}