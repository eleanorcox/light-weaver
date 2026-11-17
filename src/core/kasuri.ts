import type { Cloth } from './cloth';
import { drawdown, plainWeave } from './draft';
import { seededRandom } from './random';

export interface KasuriSpec {
  // The motif as rows of '#' (left undyed by tying) and '.' (dyed), repeated across the cloth.
  motif: readonly string[];
  colours: { dyed: string; undyed: string };
  // How many threads each thread may be shifted from where it should be, blurring the edges.
  drift: number;
  seed: number;
}

// Kasuri, both warp and weft tie-dyed before weaving (tate-yoko), in plain weave. Every
// thread carries the motif along its length; each is shifted a little, as tied bundles never
// line up exactly, so the pattern forms with soft edges where the threads meet.
export function kasuri(spec: KasuriSpec): Cloth {
  const rows = spec.motif.length;
  const columns = spec.motif[0]?.length ?? 0;
  if (rows === 0 || columns === 0 || spec.motif.some((r) => r.length !== columns)) {
    throw new Error('A kasuri motif needs rows of equal length');
  }
  const random = seededRandom(spec.seed);
  const shift = (): number => Math.floor(random() * (2 * spec.drift + 1)) - spec.drift;
  const warpShift = Array.from({ length: columns }, shift);
  const weftShift = Array.from({ length: rows }, shift);

  const wrap = (n: number, length: number): number => ((n % length) + length) % length;
  const undyed = (i: number, j: number): boolean => spec.motif[wrap(j, rows)]![wrap(i, columns)] === '#';
  const colour = (tied: boolean): string => (tied ? spec.colours.undyed : spec.colours.dyed);

  return {
    warpUp: drawdown(plainWeave()),
    // A warp thread is shifted along its length; a weft pick, across the cloth.
    warpColour: (i, j) => colour(undyed(i, j + warpShift[wrap(i, columns)]!)),
    weftColour: (j, i) => colour(undyed(i + weftShift[wrap(j, rows)]!, j)),
  };
}
