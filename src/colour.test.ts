import { describe, expect, it } from 'vitest';
import { hexToHsl, hslToHex, sixDigits } from './colour';

describe('colours for the picker', () => {
  it('writes short hex values out in full', () => {
    expect(sixDigits('#f0c')).toBe('#ff00cc');
    expect(sixDigits('#1C1C30')).toBe('#1c1c30');
  });

  it('turns hex into hue, saturation and lightness, and back', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
    expect(hexToHsl('#ffffff')).toEqual({ h: 0, s: 0, l: 100 });
    expect(hslToHex({ h: 120, s: 100, l: 25 })).toBe('#008000');
    for (const hex of ['#3a7bff', '#ffd23a', '#1c1c30', '#f4ecd8']) {
      const back = hslToHex(hexToHsl(hex, true));
      expect(back).toBe(hex);
    }
  });
});
