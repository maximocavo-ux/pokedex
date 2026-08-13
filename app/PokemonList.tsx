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
import { capitalizar } from "./capitalizar";
import SortByModal from "./SortByModal";

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
      className="relative rounded-lg bg-white overflow-hidden shadow-[0_1px_3px_1px_rgba(0,0,0,0.20)]"
      style={{ width: CARD_ANCHO, height: CARD_ALTO }}
    >
      <div className="absolute top-1 left-2 w-6 h-2 rounded bg-[#e0e0e0] skeleton-shimmer" />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#e0e0e0] skeleton-shimmer"
        style={{ top: "18px", width: SPRITE_TAMANIO, height: SPRITE_TAMANIO }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-[#f0f0f0] flex items-end justify-center pb-2"
        style={{ height: NOMBRE_ALTO }}
      >
        <div className="w-[60px] h-2.5 rounded bg-[#e0e0e0] skeleton-shimmer" />
      </div>
    </div>
  );
}

function PokemonCard({
  id,
  name,
  onKeyDown,
}: {
  id: number;
  name: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
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
      id={`card-${detalle.id}`}
      href={`/pokemon/${detalle.id}`}
      className="no-underline text-inherit"
      onKeyDown={onKeyDown}
    >
      <div
        className="relative rounded-lg bg-white shadow-[0_1px_3px_1px_rgba(0,0,0,0.20)]"
        style={{ width: CARD_ANCHO, height: CARD_ALTO }}
      >
        <p
          className="absolute top-1 left-2 right-2 m-0 text-[8px] text-[#999]"
          style={{ height: NUMERO_ALTO }}
        >
          #{detalle.id}
        </p>

        {detalle.sprites.front_default && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "18px",
              width: SPRITE_TAMANIO,
              height: SPRITE_TAMANIO,
            }}
          >
            <Image
              src={detalle.sprites.front_default}
              alt={name}
              fill
              sizes="72px"
              className="object-contain"
            />
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-lg flex items-end justify-center pb-1"
          style={{ height: NOMBRE_ALTO, backgroundColor: `${colorFondo}33` }}
        >
          <span className="text-[10px] text-center">{capitalizar(name)}</span>
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
  const [modalAbierto, setModalAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaDebounced(busqueda);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  useEffect(() => {
    TIPOS_DISPONIBLES.forEach((tipo) => {
      getPokemonPorTipo(tipo).then((nombres) => {
        setNombresPorTipo((prev) => ({ ...prev, [tipo]: nombres }));
      });
    });
  }, []);

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
    overscan: 8,
  });

  function moverFoco(indiceActual: number, delta: number) {
    const nuevoIndice = indiceActual + delta;
    if (nuevoIndice < 0 || nuevoIndice >= ordenados.length) return;

    const filaDestino = Math.floor(nuevoIndice / COLUMNAS);
    virtualizer.scrollToIndex(filaDestino, { align: "auto" });

    setTimeout(() => {
      const pokemonDestino = ordenados[nuevoIndice];
      const elemento = document.getElementById(`card-${pokemonDestino.id}`);
      elemento?.focus();
    }, 50);
  }

  function manejarTeclaEnCard(e: React.KeyboardEvent, indiceActual: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moverFoco(indiceActual, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moverFoco(indiceActual, -1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moverFoco(indiceActual, COLUMNAS);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moverFoco(indiceActual, -COLUMNAS);
    }
  }

  return (
    <div>
      <div
        className="px-3 pt-3 pb-4"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Image src="/pokeball.svg" alt="" width={24} height={24} />
          <h1 className="text-white text-2xl font-bold m-0">Pokédex</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[280px] h-8 rounded-2xl bg-white pl-3 pr-4 py-2 box-border">
            <Image
              src="/search.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <label htmlFor="busqueda-pokemon" className="hidden">
              Buscar Pokémon por nombre
            </label>
            <input
              id="busqueda-pokemon"
              type="search"
              placeholder="Buscar Pokémon..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border-none outline-none flex-1 text-sm"
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

          <div className="relative">
            <button
              onClick={() => setModalAbierto((prev) => !prev)}
              aria-label="Ordenar lista"
              aria-haspopup="dialog"
              className="w-8 h-8 rounded-full border-none bg-white cursor-pointer text-sm"
            >
              #
            </button>

            {modalAbierto && (
              <SortByModal
                orden={orden}
                onCambiarOrden={(nuevoOrden) => {
                  cambiarOrden(nuevoOrden);
                  setModalAbierto(false);
                }}
                onCerrar={() => setModalAbierto(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="m-3">
        <div className="flex flex-wrap gap-1.5">
          {TIPOS_DISPONIBLES.map((tipo) => {
            const seleccionado = tiposSeleccionados.includes(tipo);
            return (
              <button
                key={tipo}
                onClick={() => alternarTipo(tipo)}
                aria-pressed={seleccionado}
                className="text-[10px] px-2 py-0.5 rounded-[10px] cursor-pointer"
                style={{
                  border: seleccionado
                    ? `2px solid ${coloresPorTipo[tipo]}`
                    : "1px solid #ccc",
                  backgroundColor: seleccionado
                    ? coloresPorTipo[tipo]
                    : "white",
                  color: seleccionado ? "white" : "#333",
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
            className="mt-2 text-xs bg-transparent border-none text-[#666] cursor-pointer underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {ordenados.length === 0 ? (
        <p className="m-3">No se encontró ningún Pokémon con esos criterios.</p>
      ) : (
        <div
          ref={contenedorRef}
          className="h-[640px] overflow-auto relative px-3"
        >
          <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
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
                  className="absolute top-0 left-0 w-full flex"
                  style={{
                    height: `${filaVirtual.size}px`,
                    transform: `translateY(${filaVirtual.start}px)`,
                    gap: `${GAP}px`,
                  }}
                >
                  {pokemonesDeFila.map((pokemon, indiceEnFila) => {
                    const indiceGlobal = inicio + indiceEnFila;
                    return (
                      <PokemonCard
                        key={pokemon.id}
                        id={pokemon.id}
                        name={pokemon.name}
                        onKeyDown={(e) => manejarTeclaEnCard(e, indiceGlobal)}
                      />
                    );
                  })}
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
