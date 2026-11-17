import type { Cloth } from './cloth';

export interface Piece {
  cloth: Cloth;
  caption: string;
  picks: number; // how many picks this piece is woven for before the next
}

export interface Place {
  index: number; // which piece
  pick: number; // the pick within that piece, from 0
  piece: Piece;
}

// One cloth after another, for ever: each piece for its number of picks, then `gap` picks of
// bare loom before the next. Returns what is woven at pick j, or null in a gap.
export function programme(pieces: readonly Piece[], gap: number): (j: number) => Place | null {
  if (pieces.length === 0) throw new Error('A programme needs at least one piece');
  const starts: number[] = [];
  let total = 0;
  for (const p of pieces) {
    starts.push(total);
    total += p.picks + gap;
  }
  return (j) => {
    const t = ((j % total) + total) % total;
    let index = pieces.length - 1;
    while (starts[index]! > t) index--;
    const pick = t - starts[index]!;
    const piece = pieces[index]!;
    return pick < piece.picks ? { index, pick, piece } : null;
  };
}
