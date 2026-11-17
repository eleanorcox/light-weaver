import { type Cloth } from './core/cloth';
import { basketWeave, diamondTwill, drawdown, herringbone, plainWeave, pointTwill, satin, twill22 } from './core/draft';
import { woven } from './core/order';
import { generateSett, seededRandom } from './core/random';
import { formatSett, parseSett, tartan } from './core/tartan';

export interface Scene {
  name: string;
  cloth: Cloth;
  caption: string;
  seed?: number;
}

// Thread colours as light: bright where a thread catches it, black stays nearly dark.
const LIGHT = {
  K: '#1c1c30',
  R: '#ff3b4a',
  G: '#2fd27a',
  B: '#3a7bff',
  Y: '#ffd23a',
  W: '#f4ecd8',
} as const;

function twoColour(warpUp: Cloth['warpUp'], warp: string, weft: string): Cloth {
  return { warpUp, warpColour: () => warp, weftColour: () => weft };
}

const FIXED: Record<string, () => Omit<Scene, 'name'>> = {
  plain: () => ({
    cloth: twoColour(drawdown(plainWeave()), '#2fd2c8', '#ffb23a'),
    caption: 'Plain weave: over one, under one',
  }),
  basket: () => ({
    cloth: twoColour(drawdown(basketWeave()), '#ff8a3c', '#3a2a6e'),
    caption: 'Basket weave: plain weave with every thread doubled',
  }),
  twill: () => ({
    cloth: twoColour(drawdown(twill22()), LIGHT.B, LIGHT.W),
    caption: '2/2 twill: over two, under two, stepping one thread each row',
  }),
  point: () => ({
    cloth: twoColour(drawdown(pointTwill()), '#ff4fb0', '#1c1c40'),
    caption: 'Point twill: the threading runs up the shafts and back down, so the twill zigzags',
  }),
  diamond: () => ({
    cloth: twoColour(drawdown(diamondTwill()), '#ffd23a', '#1a3a5c'),
    caption: 'Diamond twill: the zigzag turns back down the cloth too, making diamonds',
  }),
  herringbone: () => ({
    cloth: twoColour(drawdown(herringbone(8)), '#e8d9b5', '#4a6fa5'),
    caption: 'Herringbone: a twill that turns back on itself, with a clean break at each turn',
  }),
  satin: () => ({
    cloth: twoColour(drawdown(satin(5, 2)), '#c8d8ff', '#3a1a4a'),
    caption: 'Satin: long smooth floats, each crossing two threads along from the last, spreading the crossings out',
  }),
  houndstooth: () => ({
    cloth: woven(twill22(), 'L4 K4', 'L4 K4', { L: LIGHT.W, K: LIGHT.K }),
    caption: 'Houndstooth: 2/2 twill with four light and four dark threads each way',
  }),
  glen: () => {
    const order = 'L4 K4 L4 K4 L4 K4 L2 K2 L2 K2 L2 K2 L2 K2 L2 K2 L2 K2';
    return {
      cloth: woven(twill22(), order, order, { L: LIGHT.W, K: LIGHT.K }),
      caption: 'Glen check: blocks of houndstooth crossing blocks of fine two-and-two hairline',
    };
  },
  gunclub: () => ({
    cloth: woven(twill22(), 'W6 G6', 'W6 R6', { W: '#f4ecd8', G: '#2f9a5a', R: '#c8502a' }),
    caption: 'Gun club check: a three-colour twill check, one colour crossing the warp and another the weft',
  }),
};

export const SCENE_NAMES = ['tartan', ...Object.keys(FIXED)];

function madeUpTartan(params: URLSearchParams, random: () => number, note = ''): Scene {
  const given = Number.parseInt(params.get('seed') ?? '', 10);
  const seed = Number.isFinite(given) ? given : Math.floor(random() * 1_000_000);
  const sett = generateSett(seededRandom(seed), Object.keys(LIGHT));
  return {
    name: 'tartan',
    seed,
    cloth: tartan({ sett, symmetry: 'symmetric', colours: LIGHT }),
    caption: `${note}A made-up tartan · sett ${sett} · seed ${seed}`,
  };
}

// The scene named in the address (?scene=name), a tartan from a typed sett (?sett=), or a
// made-up tartan. A tartan's seed comes from ?seed= or is drawn at random, and is reported so
// the same tartan can be shown again.
export function sceneFromAddress(search: string, random: () => number = Math.random): Scene {
  const params = new URLSearchParams(search);

  const typed = params.get('sett');
  if (typed !== null) {
    try {
      return {
        name: 'sett',
        cloth: tartan({ sett: typed, symmetry: 'symmetric', colours: LIGHT }),
        caption: `Your tartan · sett ${formatSett(parseSett(typed))}`,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      return madeUpTartan(params, random, `Could not weave that sett: ${reason}. Showing instead: `);
    }
  }

  const name = params.get('scene') ?? '';
  const fixed = FIXED[name];
  if (fixed) return { name, ...fixed() };
  return madeUpTartan(params, random);
}
