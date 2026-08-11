"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import Image from "next/image";
import type { PokemonLiviano, Pokemon } from "./lib/pokeapi";
import { getPokemonDetail, getPokemonPorTipo } from "./lib/pokeapi";
import { coloresPorTipo } from "./coloresPorTipo";
import {
  CARD_ANCHO,
  CARD_ALTO,
  SPRITE_TAMANIO,
  NUMERO_ALTO,
  NOMBRE_ALTO,
} from "./pokemonCardDimensions";

const TIPOS_DISPONIBLES = Object.keys(coloresPorTipo);
const COLUMNAS = 3;
const GAP = 8;

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function PokemonCardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando Pokémon"
      style={{
        width: CARD_ANCHO,
        height: CARD_ALTO,
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 1px rgba(0,0,0,0.20)",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 8,
          width: "24px",
          height: "8px",
          borderRadius: "4px",
          backgroundColor: "#e0e0e0",
        }}
        className="skeleton-shimmer"
      />
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          width: SPRITE_TAMANIO,
          height: SPRITE_TAMANIO,
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
        }}
        className="skeleton-shimmer"
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: NOMBRE_ALTO,
          backgroundColor: "#f0f0f0",
          borderRadius: "0 0 8px 8px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "10px",
            borderRadius: "4px",
            backgroundColor: "#e0e0e0",
          }}
          className="skeleton-shimmer"
        />
      </div>
    </div>
  );
}

function PokemonCard({ id, name }: { id: number; name: string }) {
  const [detalle, setDetalle] = useState<Pokemon | null>(null);

  useEffect(() => {
    let cancelado = false;
    getPokemonDetail(id).then((data) => {
      if (!cancelado) setDetalle(data);
    });
    return () => {
      cancelado = true;
    };
  }, [id]);

  if (!detalle) {
    return <PokemonCardSkeleton />;
  }

  const colorFondo = coloresPorTipo[detalle.types[0]?.type.name] || "#eee";

  return (
    <Link
      href={`/pokemon/${detalle.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: CARD_ANCHO,
          height: CARD_ALTO,
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 1px rgba(0,0,0,0.20)",
          backgroundColor: "white",
        }}
      >
        <p
          style={{
            position: "absolute",
            top: 4,
            left: 8,
            right: 8,
            height: NUMERO_ALTO,
            margin: 0,
            fontSize: "8px",
            color: "#999",
          }}
        >
          #{detalle.id}
        </p>

        {detalle.sprites.front_default && (
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "50%",
              transform: "translateX(-50%)",
              width: SPRITE_TAMANIO,
              height: SPRITE_TAMANIO,
            }}
          >
            <Image
              src={detalle.sprites.front_default}
              alt={name}
              fill
              sizes="72px"
              style={{ objectFit: "contain" }}
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: NOMBRE_ALTO,
            backgroundColor: `${colorFondo}33`,
            borderRadius: "0 0 8px 8px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "4px",
          }}
        >
          <span style={{ fontSize: "10px", textAlign: "center" }}>{name}</span>
        </div>
      </div>
    </Link>
  );
}

function ListaConOrden({ pokemones }: { pokemones: PokemonLiviano[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orden = searchParams.get("orden") || "numero";

  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounced, setBusquedaDebounced] = useState("");
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [nombresPorTipo, setNombresPorTipo] = useState<
    Record<string, string[]>
  >({});

  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  useEffect(() => {
    tiposSeleccionados.forEach((tipo) => {
      if (!nombresPorTipo[tipo]) {
        getPokemonPorTipo(tipo).then((nombres) => {
          setNombresPorTipo((prev) => ({ ...prev, [tipo]: nombres }));
        });
      }
    });
  }, [tiposSeleccionados, nombresPorTipo]);

  useEffect(() => {
    contenedorRef.current?.scrollTo({ top: 0 });
  }, [orden, busquedaDebounced, tiposSeleccionados]);

  function cambiarOrden(nuevoOrden: string) {
    router.push(`?orden=${nuevoOrden}`);
  }

  function alternarTipo(tipo: string) {
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  }

  function limpiarFiltros() {
    setTiposSeleccionados([]);
  }

  const filtrados = pokemones.filter((pokemon) => {
    const coincideBusqueda = normalizar(pokemon.name).includes(
      normalizar(busquedaDebounced)
    );

    if (tiposSeleccionados.length === 0) {
      return coincideBusqueda;
    }

    const coincideTipo = tiposSeleccionados.every((tipo) =>
      nombresPorTipo[tipo]?.includes(pokemon.name)
    );

    return coincideBusqueda && coincideTipo;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    if (orden === "nombre") {
      return a.name.localeCompare(b.name);
    }
    return a.id - b.id;
  });

  const filas = Math.ceil(ordenados.length / COLUMNAS);

  const virtualizer = useVirtualizer({
    count: filas,
    getScrollElement: () => contenedorRef.current,
    estimateSize: () => CARD_ALTO + GAP,
    overscan: 3,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "280px",
          height: "32px",
          borderRadius: "16px",
          border: "1px solid #ccc",
          padding: "8px 16px 8px 12px",
          boxSizing: "border-box",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <label htmlFor="busqueda-pokemon" style={{ display: "none" }}>
          Buscar Pokémon por nombre
        </label>
        <input
          id="busqueda-pokemon"
          type="search"
          placeholder="Buscar Pokémon..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ border: "none", outline: "none", flex: 1, fontSize: "14px" }}
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            aria-label="Limpiar búsqueda"
            className="border-none bg-transparent cursor-pointer text-base p-0"
          >
            ×
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
        <button
          onClick={() => cambiarOrden("numero")}
          style={{
            fontWeight: orden === "numero" ? "bold" : "normal",
            padding: "4px 12px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: orden === "numero" ? "#eee" : "white",
          }}
        >
          Número
        </button>
        <button
          onClick={() => cambiarOrden("nombre")}
          style={{
            fontWeight: orden === "nombre" ? "bold" : "normal",
            padding: "4px 12px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: orden === "nombre" ? "#eee" : "white",
          }}
        >
          Nombre
        </button>
      </div>

      <div style={{ margin: "12px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {TIPOS_DISPONIBLES.map((tipo) => {
            const seleccionado = tiposSeleccionados.includes(tipo);
            return (
              <button
                key={tipo}
                onClick={() => alternarTipo(tipo)}
                aria-pressed={seleccionado}
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  border: seleccionado
                    ? `2px solid ${coloresPorTipo[tipo]}`
                    : "1px solid #ccc",
                  backgroundColor: seleccionado
                    ? coloresPorTipo[tipo]
                    : "white",
                  color: seleccionado ? "white" : "#333",
                  cursor: "pointer",
                }}
              >
                {tipo}
              </button>
            );
          })}
        </div>
        {tiposSeleccionados.length > 0 && (
          <button
            onClick={limpiarFiltros}
            style={{
              marginTop: "8px",
              fontSize: "12px",
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {ordenados.length === 0 ? (
        <p>No se encontró ningún Pokémon con esos criterios.</p>
      ) : (
        <div
          ref={contenedorRef}
          style={{
            height: "640px",
            overflow: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
              width: "100%",
            }}
          >
            {virtualizer.getVirtualItems().map((filaVirtual) => {
              const inicio = filaVirtual.index * COLUMNAS;
              const pokemonesDeFila = ordenados.slice(
                inicio,
                inicio + COLUMNAS
              );

              return (
                <div
                  key={filaVirtual.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${filaVirtual.size}px`,
                    transform: `translateY(${filaVirtual.start}px)`,
                    display: "flex",
                    gap: `${GAP}px`,
                  }}
                >
                  {pokemonesDeFila.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      id={pokemon.id}
                      name={pokemon.name}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PokemonList({
  pokemones,
}: {
  pokemones: PokemonLiviano[];
}) {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ListaConOrden pokemones={pokemones} />
    </Suspense>
  );
}
