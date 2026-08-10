# Pokédex

Pokédex hecha con Next.js y TypeScript, usando datos de la [PokéAPI](https://pokeapi.co/).

## Cómo arrancar

Requiere Node 24 (ver `.nvmrc`).

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript en modo estricto
- **Estilos:** inline styles por ahora; Tailwind instalado pero sin usar todavía (ver SETUP-3 en el backlog)
- **API:** [PokéAPI](https://pokeapi.co/docs/v2) v2, sin autenticación
- **Deploy:** [Vercel](https://vercel.com), automático en cada merge a `main`

## Estructura

```
app/
  page.tsx                  → lista de Pokémon (Server Component)
  PokemonList.tsx            → búsqueda, orden y filtro (Client Component)
  loading.tsx                 → skeleton de la lista
  error.tsx                   → error boundary de la lista
  coloresPorTipo.ts           → colores por tipo + cálculo de contraste
  pokemonCardDimensions.ts    → medidas compartidas entre card y skeleton
  lib/
    pokeapi.ts                 → cliente centralizado: tipos + fetch con timeout
  pokemon/[id]/
    page.tsx                   → detalle de un Pokémon (Server Component)
    loading.tsx                 → skeleton del detalle
    error.tsx                   → error boundary del detalle
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint

## Backlog

El backlog completo del proyecto vive en Notion, no en este repo.
