// A loom draft: which shaft each warp thread is on, which shafts each treadle lifts,
// and the order the treadles are pressed. Shafts and treadles count from 0.
export interface Draft {
  threading: readonly number[];
  tieUp: readonly (readonly number[])[];
  treadling: readonly number[];
}

// Whether warp thread i is on top at pick j (a pick is one pass of the weft).
export type WarpUp = (i: number, j: number) => boolean;

function wrap(n: number, length: number): number {
  return ((n % length) + length) % length;
}

// The drawdown: the pattern a draft makes, repeating for ever in both directions.
export function drawdown(draft: Draft): WarpUp {
  const lifted = draft.tieUp.map((shafts) => new Set(shafts));
  return (i, j) => {
    const shaft = draft.threading[wrap(i, draft.threading.length)]!;
    const treadle = draft.treadling[wrap(j, draft.treadling.length)]!;
    return lifted[treadle]!.has(shaft);
  };
}

export function plainWeave(): Draft {
  return { threading: [0, 1], tieUp: [[0], [1]], treadling: [0, 1] };
}

const TWILL_22_TIE_UP = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

export function twill22(): Draft {
  return { threading: [0, 1, 2, 3], tieUp: TWILL_22_TIE_UP, treadling: [0, 1, 2, 3] };
}

// A 2/2 twill whose threading reverses every `block` threads. The reversed block starts two
// shafts along, so the threads either side of each join are always opposite: the clean
// "break" that makes a herringbone rather than a zigzag.
export function herringbone(block: number): Draft {
  const forward = Array.from({ length: block }, (_, k) => k % 4);
  const start = (block - 1 + 2) % 4;
  const back = Array.from({ length: block }, (_, k) => wrap(start - k, 4));
  return { threading: [...forward, ...back], tieUp: TWILL_22_TIE_UP, treadling: [0, 1, 2, 3] };
}
