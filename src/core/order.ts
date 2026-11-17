import type { Cloth } from './cloth';
import { repeating } from './cloth';
import { drawdown, type Draft } from './draft';
import { expandSett, parseSett } from './tartan';

// A colour order written like a thread count ("D4 L4": four dark, four light), repeated as
// written, giving each thread's colour.
export function colourOrder(order: string, colours: Readonly<Record<string, string>>): (n: number) => string {
  return repeating(
    expandSett(parseSett(order), 'asymmetric').map((code) => {
      const colour = colours[code];
      if (!colour) throw new Error(`The colour order uses ${code}, which has no colour value`);
      return colour;
    }),
  );
}

// Cloth from a draft and colour orders for warp and weft. Many classic checks, houndstooth
// among them, come from the colour order as much as from the weave.
export function woven(
  draft: Draft,
  warpOrder: string,
  weftOrder: string,
  colours: Readonly<Record<string, string>>,
): Cloth {
  return {
    warpUp: drawdown(draft),
    warpColour: colourOrder(warpOrder, colours),
    weftColour: colourOrder(weftOrder, colours),
  };
}
