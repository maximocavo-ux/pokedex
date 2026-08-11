import { coloresPorTipo } from "./coloresPorTipo";

export default function TipoChip({ tipo }: { tipo: string }) {
  return (
    <span
      className="text-white text-xs rounded-full mr-1"
      style={{
        backgroundColor: coloresPorTipo[tipo] || "#999",
        padding: "2px 8px",
      }}
    >
      {tipo}
    </span>
  );
}
