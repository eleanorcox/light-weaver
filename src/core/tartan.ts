import { repeating, type Cloth } from './cloth';
import { drawdown, twill22 } from './draft';

export interface Stripe {
  colour: string;
  count: number;
}

export type Symmetry = 'symmetric' | 'asymmetric';

// Reads a thread count such as "K4 R24 K24 Y4": colour letters, then a number of threads.
export function parseSett(text: string): Stripe[] {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) throw new Error('The thread count is empty');
  return parts.map((part) => {
    if (part.includes('/')) {
      throw new Error(`"${part}" is a half count at a pivot, which is not supported yet`);
    }
    const match = /^([A-Z]+)(\d+)$/.exec(part);
    if (!match || Number(match[2]) === 0) {
      throw new Error(`"${part}" is not a colour letter followed by a number of threads`);
    }
    return { colour: match[1]!, count: Number(match[2]) };
  });
}

// One colour code per thread for a single repeat of the sett. A symmetric sett runs forward
// then back, turning at the first and last stripes (the pivots) without doubling them.
export function expandSett(stripes: readonly Stripe[], symmetry: Symmetry): string[] {
  const order =
    symmetry === 'symmetric' && stripes.length > 2
      ? [...stripes, ...stripes.slice(1, -1).reverse()]
      : stripes;
  return order.flatMap((s) => Array<string>(s.count).fill(s.colour));
}

export interface TartanSpec {
  sett: string;
  symmetry: Symmetry;
  colours: Readonly<Record<string, string>>;
}

// A tartan: the same sett for warp and weft, woven in 2/2 twill.
export function tartan(spec: TartanSpec): Cloth {
  const threads = expandSett(parseSett(spec.sett), spec.symmetry).map((code) => {
    const colour = spec.colours[code];
    if (!colour) throw new Error(`The sett uses colour ${code}, which has no colour value`);
    return colour;
  });
  const colour = repeating(threads);
  return { warpUp: drawdown(twill22()), warpColour: colour, weftColour: colour };
}
