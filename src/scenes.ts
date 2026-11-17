import { brokenTwill, basketWeave, diamondTwill, herringbone, plainWeave, pointTwill, satin, twill, twill22, type Draft } from './core/draft';
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
// any of its colours can be changed from the address.
interface Design {
  draft: () => Draft;
  warp: string;
  weft: string;
  palette: Palette;
  caption: string;
}

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
  tattersall: { draft: plainWeave, warp: 'W10 R2 W10 G2', weft: 'W10 R2 W10 G2', palette: { W: '#f4ecd8', R: '#ff3b4a', G: '#2fd27a' }, caption: 'Tattersall: thin lines of two colours, alternating, crossing a light ground' },
};

export const SCENE_NAMES = ['tartan', ...Object.keys(DESIGNS)];

interface Settings {
  colours: Palette;
  picks: number;
  note: string; // anything the caption should say about the address
}

function design(name: string, s: Settings): Piece {
  const d = DESIGNS[name]!;
  const palette = { ...d.palette, ...s.colours };
  return { cloth: woven(d.draft(), d.warp, d.weft, palette), caption: s.note + d.caption, picks: s.picks };
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

  const typed = params.get('sett');
  if (typed !== null) {
    try {
      const sett = formatSett(parseSett(typed));
      const cloth = tartan({ sett, symmetry: 'symmetric', colours: { ...LIGHT, ...settings.colours } });
      return { name: 'sett', pieces: [{ cloth, caption: `${settings.note}Your tartan · sett ${sett}`, picks: settings.picks }] };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      settings.note += `Could not weave that sett: ${reason}. Showing instead: `;
      return { name: 'tartan', seed, pieces: [madeUpTartan(seed, settings)] };
    }
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
