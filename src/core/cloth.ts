import type { WarpUp } from './draft';

// Everything needed to draw a piece of cloth: which thread is on top at each crossing,
// and the colour of every warp thread and every weft pick. All repeat for ever. A colour
// may change along a thread's length (as in kasuri, dyed before weaving), so each is also
// given where along the thread: warp thread i at pick j, weft pick j at warp thread i.
export interface Cloth {
  warpUp: WarpUp;
  warpColour(i: number, j: number): string;
  weftColour(j: number, i: number): string;
}

export function repeating<T>(items: readonly T[]): (n: number) => T {
  if (items.length === 0) throw new Error('Nothing to repeat');
  return (n) => items[((n % items.length) + items.length) % items.length]!;
}
