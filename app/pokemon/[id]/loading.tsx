export default function LoadingDetalle() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando Pokémon"
      style={{
        padding: "24px",
        minHeight: "100vh",
        backgroundColor: "#eee",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "16px",
          borderRadius: "4px",
          backgroundColor: "#ddd",
        }}
        className="skeleton-shimmer"
      />

      <div
        style={{
          width: "150px",
          height: "24px",
          borderRadius: "4px",
          backgroundColor: "#ddd",
          margin: "16px 0 8px",
        }}
        className="skeleton-shimmer"
      />

      <div
        style={{
          width: "100px",
          height: "14px",
          borderRadius: "4px",
          backgroundColor: "#ddd",
        }}
        className="skeleton-shimmer"
      />

      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          backgroundColor: "#ddd",
          margin: "24px auto",
        }}
        className="skeleton-shimmer"
      />

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "4px",
            backgroundColor: "#eee",
          }}
          className="skeleton-shimmer"
        />

        <div
          style={{
            width: "60%",
            height: "16px",
            borderRadius: "4px",
            backgroundColor: "#eee",
            margin: "16px 0",
          }}
          className="skeleton-shimmer"
        />

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: "12px",
              borderRadius: "4px",
              backgroundColor: "#eee",
              margin: "8px 0",
            }}
            className="skeleton-shimmer"
          />
        ))}
      </div>
    </div>
  );
}