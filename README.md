# Pokédex

Pokédex hecha con Next.js y TypeScript, usando datos de la [PokéAPI](https://pokeapi.co/). Lista virtualizada de los ~1300 Pokémon reales, con búsqueda, ordenamiento, filtro por tipo, y pantalla de detalle con navegación.

## Cómo arrancar

Requiere Node 24 (ver `.nvmrc`).

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript en modo estricto
- **Estilos:** migración gradual a Tailwind (ver `docs/adr/001-estilos.md`); estilos inline conviven mientras se migra componente por componente
- **Tipografía:** Poppins, vía `next/font/google`
- **Virtualización:** `@tanstack/react-virtual`
- **Tests:** Vitest
- **API:** [PokéAPI](https://pokeapi.co/docs/v2) v2, sin autenticación
- **Deploy:** [Vercel](https://vercel.com), automático en cada merge a `main`
- **CI:** GitHub Actions (lint, typecheck, test, build) en cada PR; branch protection en `main`

## Estructura

```
app/
  page.tsx                  → lista de Pokémon (Server Component, trae nombres livianos)
  PokemonList.tsx            → lista virtualizada, búsqueda, orden, filtros (Client Component)
  loading.tsx                 → skeleton de la lista
  error.tsx                   → error boundary de la lista
  coloresPorTipo.ts           → 18 colores de tipo (design system) + cálculo de contraste
  pokemonCardDimensions.ts    → medidas compartidas entre card y skeleton
  TipoChip.tsx                 → chip de tipo reutilizable
  PokeballWatermark.tsx        → marca de agua, asset real exportado de Figma
  design-system/
    page.tsx                   → referencia visual de los tokens (/design-system)
  lib/
    pokeapi.ts                 → cliente centralizado: tipos + fetch con timeout
  pokemon/[id]/
    page.tsx                   → detalle de un Pokémon (Server Component)
    loading.tsx                 → skeleton del detalle
    error.tsx                   → error boundary del detalle
docs/
  adr/001-estilos.md          → decisión de estrategia de estilos
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run test` — tests (Vitest)
- `npm run lint` — ESLint

## Design system

Tokens de color, tipografía y elevation extraídos del Figma del proyecto (conectado vía MCP). Referencia visual en `/design-system`.

## Backlog

El backlog completo del proyecto vive en Notion, no en este repo.
