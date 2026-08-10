# ADR 001: Estrategia de estilos

## Estado

Aceptado

## Contexto

El proyecto necesita una forma consistente de manejar estilos. Hasta ahora se usaron estilos inline (`style={{...}}`) para poder avanzar rápido sin bloquear el aprendizaje de React/Next, pero eso no escala: no hay forma de reutilizar valores (colores, espaciados) de forma centralizada, ni de aplicar responsive design de forma cómoda.

## Opciones evaluadas

| Opción                                  | Compatibilidad con RSC                                                                                                  | DX                                   | Tamaño de bundle              | Tokenización                                 | Curva                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------- | -------------------------------------------- | ---------------------- |
| **Tailwind**                            | Buena — clases, sin JS en runtime                                                                                       | Alta, autocompletado en VS Code      | Bajo — purga clases no usadas | Buena, vía `tailwind.config` + CSS variables | Media, sintaxis propia |
| **CSS Modules**                         | Buena                                                                                                                   | Media, sin autocompletado de valores | Bajo                          | Limitada, sin sistema de tokens nativo       | Baja, es CSS común     |
| **Sass**                                | Con fricción — el ticket original la marca como problemática con Server Components                                      | Alta si ya se conoce Sass            | Medio                         | Buena vía variables Sass                     | Baja si ya se sabe CSS |
| **CSS-in-JS** (styled-components, etc.) | Mala — requiere `"use client"` en la mayoría de los casos, va contra el uso extensivo de Server Components del proyecto | Alta                                 | Alto — JS extra en runtime    | Muy buena                                    | Media                  |

## Decisión

**Tailwind CSS + CSS variables para los tokens de diseño** (colores, espaciados).

Razones concretas:

- Ya está instalado desde el bootstrap del proyecto (`create-next-app`), sin costo de instalación adicional.
- Es la opción recomendada explícitamente en el ticket de origen (SETUP-3) para proyectos con App Router/RSC.
- CSS-in-JS queda descartado por la fricción directa con Server Components, que es la base de casi toda la app actual (`page.tsx`, `[id]/page.tsx`).
- Los 18 colores por tipo, ya centralizados en `coloresPorTipo.ts`, se pueden migrar a CSS variables sin perder la lógica de `colorDeTexto()` que ya funciona.

## Consecuencias

- Migración gradual: no se reescribe toda la UI de una — se migra componente por componente en tickets futuros (empezando por SETUP-4, el design system formal).
- Los estilos inline actuales (`style={{...}}`) conviven con Tailwind durante la transición; no es necesario eliminarlos todos de entrada.
- Convención de nomenclatura: ver `AGENTS.md`.
