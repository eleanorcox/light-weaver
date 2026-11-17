import { describe, expect, it } from 'vitest';
import { generateSett, seededRandom } from './random';
import { parseSett } from './tartan';

describe('seededRandom', () => {
  it('gives the same numbers from the same seed', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    for (let n = 0; n < 10; n++) expect(a()).toBe(b());
  });

  it('gives numbers from 0 up to but not including 1', () => {
    const r = seededRandom(7);
    for (let n = 0; n < 1000; n++) {
      const x = r();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe('generateSett', () => {
  const letters = ['K', 'R', 'G', 'Y', 'W'];

  it('makes the same sett from the same seed', () => {
    expect(generateSett(seededRandom(3), letters)).toBe(generateSett(seededRandom(3), letters));
  });

  it('makes setts that read back as valid thread counts, with even counts and no colour next to itself', () => {
    for (let seed = 0; seed < 200; seed++) {
      const stripes = parseSett(generateSett(seededRandom(seed), letters));
      expect(stripes.length).toBeGreaterThanOrEqual(3);
      for (const [n, s] of stripes.entries()) {
        expect(s.count % 2).toBe(0);
        expect(letters).toContain(s.colour);
        if (n > 0) expect(s.colour).not.toBe(stripes[n - 1]!.colour);
      }
    }
  });
});
