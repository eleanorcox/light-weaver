import { repeating, type Cloth } from './core/cloth';
import { drawdown, herringbone, plainWeave, twill22 } from './core/draft';
import { generateSett, seededRandom } from './core/random';
import { tartan } from './core/tartan';

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
  twill: () => ({
    cloth: twoColour(drawdown(twill22()), LIGHT.B, LIGHT.W),
    caption: '2/2 twill: over two, under two, stepping one thread each row',
  }),
  herringbone: () => ({
    cloth: twoColour(drawdown(herringbone(8)), '#e8d9b5', '#4a6fa5'),
    caption: 'Herringbone: a twill that turns back on itself, with a clean break at each turn',
  }),
  houndstooth: () => {
    const fourAndFour = repeating([...Array<string>(4).fill(LIGHT.W), ...Array<string>(4).fill(LIGHT.K)]);
    return {
      cloth: { warpUp: drawdown(twill22()), warpColour: fourAndFour, weftColour: fourAndFour },
      caption: 'Houndstooth: 2/2 twill with four light and four dark threads each way',
    };
  },
};

export const SCENE_NAMES = ['tartan', ...Object.keys(FIXED)];

// The scene named in the address (?scene=name), or a made-up tartan. A tartan's seed comes
// from ?seed= or is drawn at random, and is reported so the same tartan can be shown again.
export function sceneFromAddress(search: string, random: () => number = Math.random): Scene {
  const params = new URLSearchParams(search);
  const name = params.get('scene') ?? '';
  const fixed = FIXED[name];
  if (fixed) return { name, ...fixed() };

  const given = Number.parseInt(params.get('seed') ?? '', 10);
  const seed = Number.isFinite(given) ? given : Math.floor(random() * 1_000_000);
  const sett = generateSett(seededRandom(seed), Object.keys(LIGHT));
  return {
    name: 'tartan',
    seed,
    cloth: tartan({ sett, symmetry: 'symmetric', colours: LIGHT }),
    caption: `A made-up tartan · sett ${sett} · seed ${seed}`,
  };
}
