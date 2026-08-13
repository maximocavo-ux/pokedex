const BASE_URL = "https://pokeapi.co/api/v2";
const TIMEOUT_MS = 8000;
const REVALIDATE_SEGUNDOS = 3600;

export const TOTAL_POKEMON = 1302;

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type NamedAPIResourceList = {
  count: number;
  results: NamedAPIResource[];
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: {
    type: { name: string };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  abilities: {
    ability: { name: string };
    is_hidden: boolean;
  }[];
};

export type PokemonLiviano = {
  name: string;
  id: number;
};

export type PokemonSpecies = {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
};

async function fetchConTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SEGUNDOS },
      signal: controller.signal,
    });
    return res;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`La PokéAPI no respondió en ${TIMEOUT_MS / 1000}s.`);
    }
    throw new Error("No se pudo conectar con la PokéAPI. Revisá tu conexión.");
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getPokemonList(
  limit: number
): Promise<NamedAPIResourceList> {
  const res = await fetchConTimeout(`${BASE_URL}/pokemon?limit=${limit}`);

  if (!res.ok) {
    throw new Error(`Error al obtener la lista de Pokémon: ${res.status}`);
  }

  return res.json();
}

async function fetchPokemonDetail(
  idOrName: string | number
): Promise<Pokemon | null> {
  const res = await fetchConTimeout(`${BASE_URL}/pokemon/${idOrName}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error al obtener el Pokémon ${idOrName}: ${res.status}`);
  }

  return res.json();
}

const cacheDetalle = new Map<string, Promise<Pokemon | null>>();

export function getPokemonDetail(
  idOrName: string | number
): Promise<Pokemon | null> {
  const clave = String(idOrName);

  if (!cacheDetalle.has(clave)) {
    const promesa = fetchPokemonDetail(idOrName).catch((error) => {
      cacheDetalle.delete(clave);
      throw error;
    });
    cacheDetalle.set(clave, promesa);
  }

  return cacheDetalle.get(clave)!;
}

export async function getPokemonSpecies(
  idOrName: string | number
): Promise<PokemonSpecies | null> {
  const res = await fetchConTimeout(`${BASE_URL}/pokemon-species/${idOrName}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error al obtener la especie ${idOrName}: ${res.status}`);
  }

  return res.json();
}
export type PokemonPorTipo = {
  pokemon: {
    pokemon: NamedAPIResource;
  }[];
};

async function fetchPokemonPorTipo(tipo: string): Promise<string[]> {
  const res = await fetchConTimeout(`${BASE_URL}/type/${tipo}`);

  if (!res.ok) {
    throw new Error(`Error al obtener el tipo ${tipo}: ${res.status}`);
  }

  const data: PokemonPorTipo = await res.json();
  return data.pokemon.map((p) => p.pokemon.name);
}

const cachePorTipo = new Map<string, Promise<string[]>>();

export function getPokemonPorTipo(tipo: string): Promise<string[]> {
  if (!cachePorTipo.has(tipo)) {
    const promesa = fetchPokemonPorTipo(tipo).catch((error) => {
      cachePorTipo.delete(tipo);
      throw error;
    });
    cachePorTipo.set(tipo, promesa);
  }

  return cachePorTipo.get(tipo)!;
}

export function idDesdeUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}
