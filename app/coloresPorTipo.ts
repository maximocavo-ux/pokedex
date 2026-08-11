export const coloresPorTipo: Record<string, string> = {
  bug: "#A7B723",
  dark: "#75574C",
  dragon: "#7037FF",
  electric: "#F9CF30",
  fairy: "#E69EAC",
  fighting: "#C12239",
  fire: "#F57D31",
  flying: "#A891EC",
  ghost: "#70559B",
  grass: "#74CB48",
  ground: "#DEC16B",
  ice: "#9AD6DF",
  normal: "#AAA67F",
  poison: "#A43E9E",
  psychic: "#FB5584",
  rock: "#B69E31",
  steel: "#B7B9D0",
  water: "#6493EB",
};

export function colorDeTexto(colorHex: string) {
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  const brillo = (r * 299 + g * 587 + b * 114) / 1000;

  return brillo > 150 ? "#000000" : "#ffffff";
}
