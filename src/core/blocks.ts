import type { Cloth } from './cloth';
import { drawdown, plainWeave, satin } from './draft';

// A motif in blocks, as rows of '#' (the figure) and '.' (the ground), each cell `block`
// threads wide and `block` picks high, repeating in both directions. Both damask and double
// cloth are drawn this way: the motif says where the figure is, the weave how it is made.
export interface BlockMotif {
  motif: readonly string[];
  block: number;
}

function figure({ motif, block }: BlockMotif): (i: number, j: number) => boolean {
  const columns = motif[0]?.length ?? 0;
  if (motif.length === 0 || columns === 0 || motif.some((r) => r.length !== columns)) {
    throw new Error('A block motif needs rows of equal length');
  }
  if (block < 1) throw new Error('A block needs at least one thread');
  const wrap = (n: number, length: number): number => ((n % length) + length) % length;
  return (i, j) => motif[wrap(Math.floor(j / block), motif.length)]![wrap(Math.floor(i / block), columns)] === '#';
}

export interface DamaskSpec extends BlockMotif {
  ends: number; // threads in the satin's repeat
  step: number; // how far the satin's crossing moves each pick
  colours: { warp: string; weft: string };
}

// Linen damask: "one warp and one weft in which, generally, warp-satin and weft-sateen weaves
// interchange" (Ferguson's). Over the figure the warp lies on top, a warp satin; over the
// ground the same satin reversed puts the weft on top. One colour of thread can show both,
// as the light catches warp and weft differently.
export function damask(spec: DamaskSpec): Cloth {
  const inFigure = figure(spec);
  const weftFaced = drawdown(satin(spec.ends, spec.step)); // one warp lifted in each `ends`
  return {
    warpUp: (i, j) => (inFigure(i, j) ? !weftFaced(i, j) : weftFaced(i, j)),
    warpColour: () => spec.colours.warp,
    weftColour: () => spec.colours.weft,
  };
}

export interface Layer {
  warp: string;
  weft: string;
}

export interface DoubleClothSpec extends BlockMotif {
  colours: { a: Layer; b: Layer };
}

// Double cloth, as in the Welsh carthen: two layers woven at once, each in plain weave, which
// swap places to make the pattern. Layer A is on the face over the figure, layer B over the
// ground, and the back is the reverse. Only the face is drawn; the layer beneath is hidden.
export function doubleCloth(spec: DoubleClothSpec): Cloth {
  const inFigure = figure(spec);
  const layer = (i: number, j: number): Layer => (inFigure(i, j) ? spec.colours.a : spec.colours.b);
  return {
    warpUp: drawdown(plainWeave()),
    warpColour: (i, j) => layer(i, j).warp,
    weftColour: (j, i) => layer(i, j).weft,
  };
}
