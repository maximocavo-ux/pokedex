import { coloresPorTipo } from "./coloresPorTipo";

export default function TipoChip({ tipo }: { tipo: string }) {
  return (
    <span
      className="text-white text-xs rounded-full mr-1 px-2 py-0.5"
      style={{
        backgroundColor: coloresPorTipo[tipo] || "#999",
      }}
    >
      {tipo}
    </span>
  );
}
