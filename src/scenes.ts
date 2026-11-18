import { damask, doubleCloth } from './core/blocks';
import { birdsEye, brokenTwill, basketWeave, diamondTwill, monksBelt, herringbone, plainWeave, pointTwill, satin, twill, twill22, type Draft } from './core/draft';
import type { Cloth } from './core/cloth';
import { kasuri } from './core/kasuri';
import { woven } from './core/order';
import { parseColours, type Palette } from './core/palette';
import type { Piece } from './core/programme';
import { generateSett, seededRandom } from './core/random';
import { formatSett, parseSett, tartan } from './core/tartan';

export interface Scene {
  name: string;
  pieces: Piece[];
  seed?: number;
}

// Thread colours as light: bright where a thread catches it; black stays nearly dark.
// Made-up and typed tartans use these letters.
const LIGHT: Palette = {
  K: '#1c1c30',
  R: '#ff3b4a',
  G: '#2fd27a',
  B: '#3a7bff',
  Y: '#ffd23a',
  W: '#f4ecd8',
};

// A design is a draft and colour orders for warp and weft, written with colour letters, so
// any of its colours can be changed from the address; or, for cloth that is more than a draft
// and colour orders, a function that makes it from the colours.
type Design = { palette: Palette; caption: string } & (
  | { draft: () => Draft; warp: string; weft: string }
  | { make: (palette: Palette) => Cloth }
);

// Our own kasuri motif, not a traditional one: small crosses, each row of them half a repeat
// along from the last.
const CROSSES = Array.from({ length: 16 }, (_, y) =>
  Array.from({ length: 16 }, (_, x) => {
    const cross = (cx: number, cy: number): boolean =>
      (Math.abs(x - cx) <= 3 && y >= cy - 1 && y <= cy) || (Math.abs(y - cy + 0.5) <= 3.5 && x >= cx - 1 && x <= cx);
    return cross(4, 4) || cross(12, 12) ? '#' : '.';
  }).join(''),
);

// Our own damask motif, not a traditional one: a diamond ring around a small diamond, with
// quarter diamonds meeting at the corners as it repeats.
const LOZENGE = Array.from({ length: 20 }, (_, y) =>
  Array.from({ length: 20 }, (_, x) => {
    const d = Math.abs(x - 9.5) + Math.abs(y - 9.5);
    return (d >= 6 && d <= 8) || d <= 2 || d >= 15 ? '#' : '.';
  }).join(''),
);

// Our own double cloth motif, not a mill design: squares within squares.
const SQUARES = Array.from({ length: 12 }, (_, y) =>
  Array.from({ length: 12 }, (_, x) => {
    const ring = Math.max(Math.abs(x - 5.5), Math.abs(y - 5.5));
    return ring > 4.5 || (ring > 2 && ring < 3.5) || ring < 1 ? '#' : '.';
  }).join(''),
);

const GLEN = 'L4 K4 L4 K4 L4 K4 L2 K2 L2 K2 L2 K2 L2 K2 L2 K2 L2 K2';

const DESIGNS: Record<string, Design> = {
  plain: { draft: plainWeave, warp: 'T1', weft: 'O1', palette: { T: '#2fd2c8', O: '#ffb23a' }, caption: 'Plain weave: over one, under one' },
  basket: { draft: basketWeave, warp: 'O1', weft: 'V1', palette: { O: '#ff8a3c', V: '#3a2a6e' }, caption: 'Basket weave: plain weave with every thread doubled' },
  gingham: { draft: plainWeave, warp: 'W8 R8', weft: 'W8 R8', palette: { W: '#f4ecd8', R: '#ff3b4a' }, caption: 'Gingham: plain weave with even stripes of white and one colour, the same both ways' },
  twill: { draft: twill22, warp: 'B1', weft: 'W1', palette: { B: '#3a7bff', W: '#f4ecd8' }, caption: '2/2 twill: over two, under two, stepping one thread each row' },
  denim: { draft: () => twill(3, 1), warp: 'I1', weft: 'W1', palette: { I: '#3d5fd6', W: '#e8e4d8' }, caption: 'Denim: 3/1 twill with a blue warp and a pale weft, so the front is mostly blue' },
  broken: { draft: brokenTwill, warp: 'C1', weft: 'N1', palette: { C: '#9fd8ff', N: '#22305a' }, caption: 'Broken twill: a 2/2 twill whose diagonal keeps breaking' },
  point: { draft: pointTwill, warp: 'P1', weft: 'N1', palette: { P: '#ff4fb0', N: '#1c1c40' }, caption: 'Point twill: the threading runs up the shafts and back down, so the twill zigzags' },
  diamond: { draft: diamondTwill, warp: 'Y1', weft: 'N1', palette: { Y: '#ffd23a', N: '#1a3a5c' }, caption: 'Diamond twill: the zigzag turns back down the cloth too, making diamonds' },
  herringbone: { draft: () => herringbone(8), warp: 'S1', weft: 'B1', palette: { S: '#e8d9b5', B: '#4a6fa5' }, caption: 'Herringbone: a twill that turns back on itself, with a clean break at each turn' },
  satin: { draft: () => satin(5, 2), warp: 'L1', weft: 'V1', palette: { L: '#c8d8ff', V: '#3a1a4a' }, caption: 'Satin: long smooth floats, each crossing two threads along from the last, spreading the crossings out' },
  houndstooth: { draft: twill22, warp: 'L4 K4', weft: 'L4 K4', palette: { L: '#f4ecd8', K: '#1c1c30' }, caption: 'Houndstooth: 2/2 twill with four light and four dark threads each way' },
  glen: { draft: twill22, warp: GLEN, weft: GLEN, palette: { L: '#f4ecd8', K: '#1c1c30' }, caption: 'Glen check: blocks of houndstooth crossing blocks of fine two-and-two hairline' },
  prince: {
    draft: twill22,
    warp: GLEN.replace(/L2 K2$/, 'B2 K2'),
    weft: GLEN.replace(/L2 K2$/, 'B2 K2'),
    palette: { L: '#f4ecd8', K: '#1c1c30', B: '#3a7bff' },
    caption: 'Prince of Wales check: a Glen check with a coloured overcheck',
  },
  gunclub: { draft: twill22, warp: 'W6 G6', weft: 'W6 R6', palette: { W: '#f4ecd8', G: '#2f9a5a', R: '#c8502a' }, caption: 'Gun club check: a three-colour twill check, one colour crossing the warp and another the weft' },
  windowpane: { draft: twill22, warp: 'G30 W2', weft: 'G30 W2', palette: { G: '#2f6a4a', W: '#f4ecd8' }, caption: 'Windowpane: a plain ground crossed by thin lines, like panes of glass' },
  kasuri: {
    make: (p) => kasuri({ motif: CROSSES, colours: { dyed: p.I!, undyed: p.W! }, drift: 1, seed: 1 }),
    palette: { I: '#2f4fb0', W: '#f4ecd8' },
    caption: 'Kasuri, in the tradition of Kurume: warp and weft tied and dyed with indigo before weaving, so the pattern forms with soft edges as the threads meet. Our own motif',
  },
  monksbelt: {
    draft: monksBelt,
    warp: 'T1',
    weft: 'P1 T1',
    palette: { T: '#f4ecd8', P: '#ff3b4a' },
    caption: "Monk's belt: two blocks of threads, each in turn covered by long floats of colour, with a plain-weave pick between every two",
  },
  birdseye: { draft: birdsEye, warp: 'G1', weft: 'N1', palette: { G: '#2fd27a', N: '#1c2a40' }, caption: "Bird's eye: a point twill making small diamonds, each with a dot at its centre" },
  damask: {
    make: (p) => damask({ motif: LOZENGE, block: 2, ends: 5, step: 2, colours: { warp: p.W!, weft: p.S! } }),
    palette: { W: '#eef2ff', S: '#7f8cb0' },
    caption: 'Linen damask, in the tradition of Lisburn: one warp and one weft, the figure in warp satin and the ground in weft sateen, so the pattern is drawn by light alone. Our own motif',
  },
  doublecloth: {
    make: (p) => doubleCloth({ motif: SQUARES, block: 4, colours: { a: { warp: p.C!, weft: p.D! }, b: { warp: p.R!, weft: p.M! } } }),
    palette: { C: '#f4ecd8', D: '#e0d2b0', R: '#d8343e', M: '#a8243a' },
    caption: 'Welsh double cloth, in the tradition of the carthen: two layers woven at once that swap places to make the pattern, the back the reverse of the front. Our own design',
  },
  tattersall: { draft: plainWeave, warp: 'W10 R2 W10 G2', weft: 'W10 R2 W10 G2', palette: { W: '#f4ecd8', R: '#ff3b4a', G: '#2fd27a' }, caption: 'Tattersall: thin lines of two colours, alternating, crossing a light ground' },
};

export const SCENE_NAMES = ['tartan', ...Object.keys(DESIGNS)];

// A short name for each design, for the settings panel: its caption up to the colon, without
// "in the tradition of", which the caption still says in full.
export const DESIGN_LABELS: Record<string, string> = {
  tartan: 'A made-up tartan',
  ...Object.fromEntries(Object.entries(DESIGNS).map(([name, d]) => [name, d.caption.split(':')[0]!.split(', in the tradition')[0]!])),
};

interface Settings {
  colours: Palette;
  picks: number;
  note: string; // anything the caption should say about the address
}

function design(name: string, s: Settings): Piece {
  const d = DESIGNS[name]!;
  const palette = { ...d.palette, ...s.colours };
  const cloth = 'make' in d ? d.make(palette) : woven(d.draft(), d.warp, d.weft, palette);
  return { cloth, caption: s.note + d.caption, picks: s.picks };
}

function madeUpTartan(seed: number, s: Settings): Piece {
  const sett = generateSett(seededRandom(seed), Object.keys(LIGHT));
  return {
    cloth: tartan({ sett, symmetry: 'symmetric', colours: { ...LIGHT, ...s.colours } }),
    caption: `${s.note}A made-up tartan · sett ${sett} · seed ${seed}`,
    picks: s.picks,
  };
}

// What to weave, from the address: ?sett= (a typed tartan), ?scene= (one design), ?play= (a
// list of designs, one after another), or with none of these, every design in turn.
// ?colours= changes or adds colour letters, ?picks= sets how long each piece in a programme
// lasts, and ?seed= fixes the made-up tartans so they can be shown again.
export function sceneFromAddress(search: string, random: () => number = Math.random): Scene {
  const params = new URLSearchParams(search);
  const settings: Settings = { colours: {}, picks: Number.parseInt(params.get('picks') ?? '', 10) || 200, note: '' };

  const colours = params.get('colours');
  if (colours !== null) {
    try {
      settings.colours = parseColours(colours);
    } catch (error) {
      settings.note = `Could not read the colours: ${error instanceof Error ? error.message : String(error)}. `;
    }
  }

  const given = Number.parseInt(params.get('seed') ?? '', 10);
  const seed = Number.isFinite(given) ? given : Math.floor(random() * 1_000_000);

  // One or more typed setts (?sett=...&sett=...), each woven into the next.
  const typed = params.getAll('sett');
  if (typed.length > 0) {
    const problems: string[] = [];
    const pieces: Piece[] = [];
    for (const text of typed) {
      try {
        const sett = formatSett(parseSett(text));
        const cloth = tartan({ sett, symmetry: 'symmetric', colours: { ...LIGHT, ...settings.colours } });
        pieces.push({ cloth, caption: `Your tartan · sett ${sett}`, picks: settings.picks });
      } catch (error) {
        problems.push(`Could not weave that sett: ${error instanceof Error ? error.message : String(error)}. `);
      }
    }
    const note = settings.note + problems.join('');
    if (pieces.length === 0) {
      settings.note = `${note}Showing instead: `;
      return { name: 'tartan', seed, pieces: [madeUpTartan(seed, settings)] };
    }
    pieces[0] = { ...pieces[0]!, caption: note + pieces[0]!.caption };
    return { name: pieces.length > 1 ? 'play' : 'sett', pieces };
  }

  const scene = params.get('scene');
  const play = params.get('play');
  if (scene !== null && play === null) {
    if (DESIGNS[scene]) return { name: scene, pieces: [design(scene, settings)] };
    return { name: 'tartan', seed, pieces: [madeUpTartan(seed, settings)] };
  }

  const names = play === null || play === 'all' ? SCENE_NAMES : play.split(',').filter((n) => SCENE_NAMES.includes(n));
  // The first made-up tartan uses the seed itself; any others get seeds drawn from it.
  const tartanSeeds = seededRandom(seed);
  let firstTartan = true;
  const nextSeed = (): number => {
    const next = firstTartan ? seed : Math.floor(tartanSeeds() * 1_000_000);
    firstTartan = false;
    return next;
  };
  const pieces = (names.length > 0 ? names : SCENE_NAMES).map((n) => (n === 'tartan' ? madeUpTartan(nextSeed(), settings) : design(n, settings)));
  return { name: 'play', seed, pieces };
}
