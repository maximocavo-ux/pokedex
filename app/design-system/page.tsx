import { coloresPorTipo } from "../coloresPorTipo";

const grises = [
  { nombre: "Primary", variable: "--color-primary" },
  { nombre: "Dark", variable: "--color-dark" },
  { nombre: "Medium", variable: "--color-medium" },
  { nombre: "Light", variable: "--color-light" },
  { nombre: "Surface", variable: "--color-surface" },
  { nombre: "White", variable: "--color-white" },
];

const tipografia = [
  { nombre: "Headline", size: "24px", lineHeight: "32px", peso: "Bold" },
  { nombre: "Subtitle 1", size: "14px", lineHeight: "16px", peso: "Bold" },
  { nombre: "Subtitle 2", size: "12px", lineHeight: "16px", peso: "Bold" },
  { nombre: "Subtitle 3", size: "10px", lineHeight: "16px", peso: "Bold" },
  { nombre: "Body 1", size: "14px", lineHeight: "16px", peso: "Regular" },
  { nombre: "Body 2", size: "12px", lineHeight: "16px", peso: "Regular" },
  { nombre: "Body 3", size: "10px", lineHeight: "16px", peso: "Regular" },
  { nombre: "Caption", size: "8px", lineHeight: "12px", peso: "Regular" },
];

const elevaciones = [
  { nombre: "Drop shadow 1 (2dp)", variable: "--elevation-1" },
  { nombre: "Drop shadow 2 (6dp)", variable: "--elevation-2" },
  { nombre: "Inner shadow (2dp)", variable: "--elevation-inner" },
];

export default function DesignSystem() {
  return (
    <div style={{ padding: "24px", maxWidth: "900px" }}>
      <h1>Design System</h1>
      <p style={{ color: "#666" }}>
        Tokens extraídos del Figma. Referencia visual, no editable desde acá.
      </p>

      <h2 style={{ marginTop: "32px" }}>Colores base</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {grises.map((color) => (
          <div key={color.variable} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: `var(${color.variable})`,
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <p style={{ fontSize: "12px", margin: "4px 0 0" }}>
              {color.nombre}
            </p>
            <code style={{ fontSize: "10px", color: "#999" }}>
              {color.variable}
            </code>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "32px" }}>Colores por tipo (18)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {Object.entries(coloresPorTipo).map(([tipo, hex]) => (
          <div key={tipo} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: hex,
                borderRadius: "8px",
              }}
            />
            <p style={{ fontSize: "10px", margin: "4px 0 0" }}>{tipo}</p>
            <code style={{ fontSize: "9px", color: "#999" }}>{hex}</code>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "32px" }}>Tipografía (Poppins)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {tipografia.map((token) => (
          <div key={token.nombre}>
            <p
              style={{
                fontSize: token.size,
                lineHeight: token.lineHeight,
                fontWeight: token.peso === "Bold" ? 700 : 400,
                margin: 0,
              }}
            >
              {token.nombre} — Aa Bb Cc
            </p>
            <code style={{ fontSize: "10px", color: "#999" }}>
              {token.size} / {token.lineHeight} · {token.peso}
            </code>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "32px" }}>Elevation</h2>
      <div style={{ display: "flex", gap: "24px" }}>
        {elevaciones.map((elev) => (
          <div key={elev.variable} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "60px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: `var(${elev.variable})`,
              }}
            />
            <p style={{ fontSize: "12px", margin: "8px 0 0" }}>{elev.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
