/**
 * Orden alfabético ascendente por el campo `name` sin usar Array.prototype.sort,
 * toSorted ni métodos nativos equivalentes (requisito de la prueba).
 * Algoritmo: merge sort + comparación de strings carácter a carácter.
 */

/** Par nombre + peso tal como viene de la API `pokemon` (weight en hectogramos). */
export type NamedWeight = { name: string; weight: number };

/**
 * Compara dos strings en orden lexicográfico (como orden alfabético ASCII para a-z).
 * Devuelve -1 si a < b, 1 si a > b, 0 si son iguales.
 */
function compareStringsAsc(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ca = a.charCodeAt(i);
    const cb = b.charCodeAt(i);
    if (ca !== cb) return ca < cb ? -1 : 1;
  }
  if (a.length === b.length) return 0;
  return a.length < b.length ? -1 : 1;
}

/** Une dos mitades ya ordenadas por `name`, manteniendo el orden alfabético. */
function mergeByName<T extends { name: string }>(left: T[], right: T[]): T[] {
  const out: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compareStringsAsc(left[i].name, right[j].name) <= 0) {
      out.push(left[i]);
      i += 1;
    } else {
      out.push(right[j]);
      j += 1;
    }
  }
  while (i < left.length) {
    out.push(left[i]);
    i += 1;
  }
  while (j < right.length) {
    out.push(right[j]);
    j += 1;
  }
  return out;
}

/**
 * Ordena el array por `name` de forma alfabética ascendente.
 * Divide la lista en dos, ordena cada mitad recursivamente y las fusiona.
 */
export function sortAlphabeticallyByName<T extends { name: string }>(items: T[]): T[] {
  const n = items.length;
  if (n <= 1) {
    return n === 0 ? [] : [items[0]];
  }
  const mid = Math.floor(n / 2);
  const left = sortAlphabeticallyByName(items.slice(0, mid));
  const right = sortAlphabeticallyByName(items.slice(mid));
  return mergeByName(left, right);
}
