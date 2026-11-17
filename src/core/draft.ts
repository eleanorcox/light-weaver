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

// Threading that runs up the four shafts and back down (0 1 2 3 2 1), so the twill zigzags.
const POINT = [0, 1, 2, 3, 2, 1];

export function pointTwill(): Draft {
  return { threading: POINT, tieUp: TWILL_22_TIE_UP, treadling: [0, 1, 2, 3] };
}

// Point threading and point treadling: the zigzag turns back down the cloth too, making diamonds.
export function diamondTwill(): Draft {
  return { threading: POINT, tieUp: TWILL_22_TIE_UP, treadling: POINT };
}

// Plain weave with every thread doubled, warp and weft.
export function basketWeave(): Draft {
  return { threading: [0, 0, 1, 1], tieUp: [[0], [1]], treadling: [0, 0, 1, 1] };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// A warp-faced satin: one warp thread lifted in every `ends`, moving `step` threads along each
// pick. The step must share no factor with `ends` (or some threads are never lifted) and must
// not be 1 or ends − 1 (which would be a twill).
export function satin(ends: number, step: number): Draft {
  if (step <= 1 || step >= ends - 1 || gcd(ends, step) !== 1) {
    throw new Error(`A ${ends}-end satin cannot step ${step}`);
  }
  const shafts = Array.from({ length: ends }, (_, k) => k);
  return { threading: shafts, tieUp: shafts.map((t) => [(t * step) % ends]), treadling: shafts };
}

// A twill named by its counts: over `over` threads, under `under`, on over + under shafts,
// stepping one thread each pick. 3/1 is the twill of denim.
export function twill(over: number, under: number): Draft {
  if (over < 1 || under < 1) throw new Error(`A ${over}/${under} twill is not possible`);
  const shafts = Array.from({ length: over + under }, (_, k) => k);
  return {
    threading: shafts,
    tieUp: shafts.map((t) => Array.from({ length: over }, (_, k) => (t + k) % shafts.length)),
    treadling: shafts,
  };
}

// A 2/2 twill with the last two picks of each repeat swapped, so the diagonal keeps breaking.
export function brokenTwill(): Draft {
  return { threading: [0, 1, 2, 3], tieUp: TWILL_22_TIE_UP, treadling: [0, 1, 3, 2] };
}
