import { describe, expect, it } from 'vitest';
import type { Cloth } from './cloth';
import { programme, type Piece } from './programme';

const cloth: Cloth = { warpUp: () => true, warpColour: () => '#fff', weftColour: () => '#000' };
const piece = (caption: string, picks: number): Piece => ({ caption, picks, cloth });

describe('programme', () => {
  const at = programme([piece('a', 3), piece('b', 2)], 1);

  it('weaves each piece for its number of picks, counting its own picks from 0', () => {
    expect([0, 1, 2].map((j) => at(j))).toEqual([0, 1, 2].map((pick) => ({ index: 0, pick, piece: expect.objectContaining({ caption: 'a' }) })));
    expect(at(4)).toEqual({ index: 1, pick: 0, piece: expect.objectContaining({ caption: 'b' }) });
  });

  it('leaves a gap of bare loom after each piece', () => {
    expect(at(3)).toBeNull();
    expect(at(6)).toBeNull();
  });

  it('starts again from the first piece after the last, for ever', () => {
    expect(at(7)).toEqual({ index: 0, pick: 0, piece: expect.objectContaining({ caption: 'a' }) });
    expect(at(7 * 100 + 4)?.index).toBe(1);
  });

  it('weaves a single piece for ever with no gaps', () => {
    const one = programme([piece('only', 10)], 0);
    expect(one(12345)?.pick).toBe(5);
  });

  it('refuses an empty programme', () => {
    expect(() => programme([], 0)).toThrow();
  });
});
