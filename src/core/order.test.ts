import { describe, expect, it } from 'vitest';
import { twill22 } from './draft';
import { colourOrder, woven } from './order';

describe('colourOrder', () => {
  const colours = { D: '#000', L: '#fff' };

  it('repeats a colour order such as four dark, four light, as written', () => {
    const order = colourOrder('D4 L4', colours);
    expect([0, 3, 4, 7, 8].map(order)).toEqual(['#000', '#000', '#fff', '#fff', '#000']);
  });

  it('refuses a colour it has no value for', () => {
    expect(() => colourOrder('D4 X4', colours)).toThrow(/X/);
  });
});

describe('woven', () => {
  it('combines a draft with colour orders for warp and weft', () => {
    const cloth = woven(twill22(), 'D2 L2', 'L1 D1', { D: '#000', L: '#fff' });
    expect(cloth.warpUp(0, 0)).toBe(true);
    expect([0, 2].map(cloth.warpColour)).toEqual(['#000', '#fff']);
    expect([0, 1].map(cloth.weftColour)).toEqual(['#fff', '#000']);
  });
});
