/**
 * Prueba de integración: PokéAPI — cadena de evolución desde Squirtle.
 * Usa el fixture `request` de Playwright (HTTP sin navegador).
 */
import { test, expect } from '@playwright/test';
import { sortAlphabeticallyByName, type NamedWeight } from './helpers/sortAlphabetically';

const API = 'https://pokeapi.co/api/v2';

// --- Tipos JSON mínimos de la API (solo los campos que usamos) ---

interface EvolutionSpecies {
  name: string;
  url: string;
}

/** Un eslabón del árbol: especie actual + siguientes evoluciones. */
interface ChainLink {
  species: EvolutionSpecies;
  evolves_to: ChainLink[];
}

interface PokemonSpeciesResponse {
  evolution_chain: { url: string };
}

interface EvolutionChainResponse {
  chain: ChainLink;
}

interface PokemonResponse {
  name: string;
  weight: number;
}

/**
 * Recorre en profundidad la cadena de evolución y devuelve todos los `species.name`
 * (raíz + cada evolves_to).
 */
function collectSpeciesNames(link: ChainLink): string[] {
  const names: string[] = [link.species.name];
  for (const child of link.evolves_to) {
    names.push(...collectSpeciesNames(child));
  }
  return names;
}

/** Formato tabular para salida legible en consola. */
function formatOutputLines(entries: NamedWeight[]): string[] {
  const nameColumnWidth = Math.max(...entries.map((e) => e.name.length), 'Pokemon'.length);
  const weightColumnWidth = Math.max(...entries.map((e) => String(e.weight).length), 'Peso(hg)'.length);
  const separator = `|-${'-'.repeat(nameColumnWidth)}-|-${'-'.repeat(weightColumnWidth)}-|`;

  const header = `| ${'Pokemon'.padEnd(nameColumnWidth)} | ${'Peso(hg)'.padStart(weightColumnWidth)} |`;
  const rows = entries.map(
    (entry) => `| ${entry.name.padEnd(nameColumnWidth)} | ${String(entry.weight).padStart(weightColumnWidth)} |`,
  );
  const pikachuAscii = [
    '   /\\_/\\  ',
    '  ( o.o ) ',
    '   > ^ <  ',
    '  Pikachu ',
  ];
  return [header, separator, ...rows, '', ...pikachuAscii];
}

test.describe('Squirtle', () => {
  test('200 pesos alfabético', async ({ request }) => {
    const lines: string[] = [];

    // 1) Pokemon inicial: sirve para validar nombre y para obtener la URL de la especie
    const squirtleRes = await request.get(`${API}/pokemon/squirtle`);
    expect(squirtleRes.status()).toBe(200);
    const squirtlePokemon = (await squirtleRes.json()) as PokemonResponse & {
      species: { url: string };
    };
    expect(squirtlePokemon.name).toBe('squirtle');

    // 2) Recurso species: contiene el enlace a la cadena de evolución
    const speciesRes = await request.get(squirtlePokemon.species.url);
    expect(speciesRes.status()).toBe(200);
    const species = (await speciesRes.json()) as PokemonSpeciesResponse;

    // 3) Cadena de evolución: árbol chain → evolves_to con todos los nombres
    const chainRes = await request.get(species.evolution_chain.url);
    expect(chainRes.status()).toBe(200);
    const evolutionChain = (await chainRes.json()) as EvolutionChainResponse;

    const speciesNames = collectSpeciesNames(evolutionChain.chain);
    expect(speciesNames).toEqual(expect.arrayContaining(['squirtle', 'wartortle', 'blastoise']));
    expect(speciesNames.length).toBe(3);

    // 4) Por cada especie, GET pokemon/{name}: el peso solo está en el recurso pokemon
    const withWeights: NamedWeight[] = [];
    for (const name of speciesNames) {
      const pr = await request.get(`${API}/pokemon/${name}`);
      expect(pr.status()).toBe(200);
      const p = (await pr.json()) as PokemonResponse;
      expect(p.name).toBe(name);
      withWeights.push({ name: p.name, weight: p.weight });
    }

    // 5) Orden alfabético manual (sin .sort()) e impresión de la salida
    const sorted = sortAlphabeticallyByName(withWeights);

    const formattedOutput = formatOutputLines(sorted);
    for (const line of formattedOutput) {
      lines.push(line);
      console.log(line);
    }

    // 6) Aserciones: orden alfabético por nombre y pesos asociados
    expect(
      sorted.map((x) => x.name),
      'Orden alfabético ascendente por nombre (sin .sort() nativo)',
    ).toEqual(['blastoise', 'squirtle', 'wartortle']);
    expect(sorted.map((x) => x.weight)).toEqual([855, 90, 225]);

    const joined = lines.join('\n');
    expect(joined).toContain('| blastoise |');
    expect(joined).toContain('| squirtle  |');
    expect(joined).toContain('| wartortle |');
    expect(joined).toContain('|      855 |');
    expect(joined).toContain('|       90 |');
    expect(joined).toContain('|      225 |');
  });
});
