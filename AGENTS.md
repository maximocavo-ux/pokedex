<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Contexto del proyecto Pokédex

## Stack

- Next.js 16 (App Router) + TypeScript en modo estricto
- Estilos: inline (`style={{...}}`) por ahora. Tailwind está instalado pero sin usar — ver SETUP-3 en el backlog antes de introducir clases de Tailwind.
- Datos: [PokéAPI](https://pokeapi.co/docs/v2), sin autenticación
- Deploy: Vercel, automático en cada merge a `main`

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción — correr antes de asumir que algo anda bien,
                  # Next puede fallar en build por cosas que no aparecen en dev
                  # (ej: useSearchParams sin Suspense)
npm run lint      # ESLint
```

No hay `test` ni `typecheck` como scripts separados todavía (pendiente de SETUP-5).

## Estructura — LEER ANTES DE EDITAR

```
app/
  page.tsx                  → LISTA de Pokémon (Server Component, fetch de datos)
  PokemonList.tsx            → búsqueda/orden/filtro de la lista (Client Component)
  loading.tsx / error.tsx     → estados de carga y error de la lista
  coloresPorTipo.ts           → colores por tipo + cálculo de contraste de texto
  pokemonCardDimensions.ts    → medidas compartidas (card real y skeleton)
  lib/pokeapi.ts               → CLIENTE CENTRALIZADO: todos los tipos y fetch a la API van acá
  pokemon/[id]/
    page.tsx                   → DETALLE de un Pokémon (archivo distinto, mismo nombre)
    loading.tsx / error.tsx     → estados de carga y error del detalle
```

**Trampa conocida:** `app/page.tsx` y `app/pokemon/[id]/page.tsx` se llaman igual y están en carpetas distintas. Antes de editar cualquiera de los dos, confirmar la ruta completa del archivo — no asumir por el nombre. Si algo se comporta raro (por ejemplo, la URL cambia al navegar pero el contenido no), sospechar que se editó el archivo equivocado.

## Convenciones

- Todo el acceso a la PokéAPI pasa por `app/lib/pokeapi.ts` — no hacer `fetch` directo a la API en otros archivos.
- Los tipos de datos (`Pokemon`, `PokemonSpecies`, etc.) se importan desde `app/lib/pokeapi.ts`, no se redeclaran en cada componente.
- `sprites.front_default` es `string | null` — siempre contemplar el caso `null` antes de renderizar.
- `fetch` no lanza error en un 404, hay que chequear `res.status` explícitamente.
- Antes de un merge, esperar el check de Vercel en verde, no alcanza con que ande en `npm run dev`.

## Particularidades de la PokéAPI

- `/pokemon?limit=&offset=` devuelve solo `{name, url}`, no el detalle completo.
- `/type/{name}` devuelve una estructura anidada (`pokemon[].pokemon.name`), hay que desanidarla.
- Los datos son prácticamente inmutables — se cachea agresivo (`revalidate: 3600`).
- No hay endpoint de búsqueda ni de filtrado en el listado — todo el filtrado es client-side sobre datos ya traídos.

## Commits

Mensajes en español, en modo imperativo, describiendo qué hace el cambio (ej: "Agrega debounce a la búsqueda"), no el proceso. Un PR por feature, con su propia rama (`feature/nombre-descriptivo`).
