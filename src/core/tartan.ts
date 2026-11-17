import { repeating, type Cloth } from './cloth';
import { drawdown, twill22 } from './draft';

export interface Stripe {
  colour: string;
  count: number;
}

export type Symmetry = 'symmetric' | 'asymmetric';

// Reads a thread count such as "K4 R24 K24 Y4": colour letters, then a number of threads.
// Stripes may also be run together ("K4R24K24Y4", for web addresses) or separated by commas,
// underscores or dashes. Letters may be lower case.
export function parseSett(text: string): Stripe[] {
  const parts = text.toUpperCase().split(/[\s,_-]+/).filter(Boolean);
  if (parts.length === 0) throw new Error('The thread count is empty');
  return parts.flatMap((part) => {
    if (part.includes('/')) {
      throw new Error(`"${part}" is a half count at a pivot, which is not supported yet`);
    }
    if (!/^([A-Z]+\d+)+$/.test(part)) {
      throw new Error(`"${part}" is not colour letters followed by a number of threads`);
    }
    return [...part.matchAll(/([A-Z]+)(\d+)/g)].map((m) => {
      if (Number(m[2]) === 0) throw new Error(`"${m[0]}" has no threads`);
      return { colour: m[1]!, count: Number(m[2]) };
    });
  });
}

// A sett written out in the usual form, with spaces between stripes.
export function formatSett(stripes: readonly Stripe[]): string {
  return stripes.map((s) => `${s.colour}${s.count}`).join(' ');
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
