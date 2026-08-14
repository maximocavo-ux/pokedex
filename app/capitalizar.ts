export function capitalizar(texto: string) {
  return texto
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join("-");
}
