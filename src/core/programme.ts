import type { Cloth } from './cloth';

export interface Piece {
  cloth: Cloth;
  caption: string;
  picks: number; // how many picks this piece is woven for before the next
  name?: string; // the design it is, so a change of settings can carry on in the same one
}

export interface Place {
  index: number; // which piece
  pick: number; // the pick within that piece, from 0 at its start (negative where it starts early)
  piece: Piece;
}

export interface Programme {
  // The piece a whole row belongs to, for the caption: the next piece takes over at its start.
  row(j: number): Place;
  // The piece woven at one crossing. Near a change, some warp threads have already moved on to
  // the next piece and some have not, so the two cloths meet along an uneven line.
  crossing(i: number, j: number): Place;
  // The first pick of piece `index`, the first time round.
  start(index: number): number;
}

// Threads between the points that set the line's height; the line curves smoothly between them.
const SPAN = 24;

// A repeatable number from 0 to 1 for a pair of whole numbers.
function hash(a: number, b: number): number {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b ^ 0xc2b2ae35, 0x27d4eb2f);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

// How far from -1 to 1 thread i changes early or late at change k: a gentle wave across the
// cloth, different at every change. k counts every change since the start, not which piece
// begins, so a piece coming round again meets the last one along a new line.
function wave(i: number, k: number): number {
  const knot = Math.floor(i / SPAN);
  const t = (1 - Math.cos(((i - knot * SPAN) / SPAN) * Math.PI)) / 2;
  const a = hash(k, knot);
  const b = hash(k, knot + 1);
  return 2 * (a + (b - a) * t) - 1;
}

// One cloth after another, for ever, with no bare loom between: each piece for its number of
// picks, the next taking over warp thread by warp thread within `blend` picks of its start.
export function programme(pieces: readonly Piece[], blend: number): Programme {
  if (pieces.length === 0) throw new Error('A programme needs at least one piece');
  const starts: number[] = [];
  let total = 0;
  for (const p of pieces) {
    starts.push(total);
    total += p.picks;
  }
  // Half the blend, kept inside the shortest piece so a thread never skips a whole piece.
  const shortest = Math.min(...pieces.map((p) => p.picks));
  const half = pieces.length > 1 ? Math.max(0, Math.min(Math.floor(blend / 2), Math.floor((shortest - 1) / 2))) : 0;

  // The piece at pick j for a straight change, and where that piece started.
  function plain(j: number): { index: number; start: number } {
    const round = Math.floor(j / total);
    const t = j - round * total;
    let index = pieces.length - 1;
    while (starts[index]! > t) index--;
    return { index, start: round * total + starts[index]! };
  }

  const place = (index: number, start: number, j: number): Place => ({ index, pick: j - start, piece: pieces[index]! });

  // The pick at which thread i changes to the piece `index` starting at `start`.
  const change = (i: number, index: number, start: number): number => {
    const round = Math.floor(start / total);
    return start + Math.round(half * wave(i, round * pieces.length + index));
  };

  return {
    start: (index) => starts[index]!,
    row(j) {
      const { index, start } = plain(j);
      return place(index, start, j);
    },
    crossing(i, j) {
      const { index, start } = plain(j);
      if (half === 0) return place(index, start, j);
      // Not yet changed to this piece: still weaving the one before.
      if (j < change(i, index, start)) {
        const before = plain(start - 1);
        return place(before.index, before.start, j);
      }
      // Already changed to the next piece.
      const nextStart = start + pieces[index]!.picks;
      const next = (index + 1) % pieces.length;
      if (j >= change(i, next, nextStart)) return place(next, nextStart, j);
      return place(index, start, j);
    },
  };
}

export interface Splice {
  at: number; // the first pick of the old programme to change
  from: number; // the pick of the new programme to carry on from
  blend: number; // picks after `at` over which the threads change over
}

// Changes to a new programme part-way through, for settings changed while it weaves. Picks
// before `at` stay as they were, so the cloth already woven never changes; after it each warp
// thread changes over at its own pick, along a wave, as between pieces.
export function continueWith(old: Programme, next: Programme, { at, from, blend }: Splice): Programme {
  const shift = from - at;
  const half = Math.max(0, Math.floor(blend / 2));
  // The wave's number is the pick it happens at, so each change has its own line.
  const change = (i: number): number => at + half + Math.round(half * wave(i, at));
  return {
    start: next.start,
    row: (j) => (j < at ? old.row(j) : next.row(j + shift)),
    crossing: (i, j) => (j < change(i) ? old.crossing(i, j) : next.crossing(i, j + shift)),
  };
}
