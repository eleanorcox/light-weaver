import type { WarpUp } from './draft';

// Everything needed to draw a piece of cloth: which thread is on top at each crossing,
// and the colour of every warp thread and every weft pick. All repeat for ever.
export interface Cloth {
  warpUp: WarpUp;
  warpColour(i: number): string;
  weftColour(j: number): string;
}

export function repeating<T>(items: readonly T[]): (n: number) => T {
  if (items.length === 0) throw new Error('Nothing to repeat');
  return (n) => items[((n % items.length) + items.length) % items.length]!;
}
