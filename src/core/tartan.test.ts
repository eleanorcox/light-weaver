import { describe, expect, it } from 'vitest';
import { expandSett, parseSett, tartan } from './tartan';

describe('parseSett', () => {
  it('reads colour letters and thread counts', () => {
    expect(parseSett('K4 R24 K24 Y4')).toEqual([
      { colour: 'K', count: 4 },
      { colour: 'R', count: 24 },
      { colour: 'K', count: 24 },
      { colour: 'Y', count: 4 },
    ]);
  });

  it('accepts multi-letter colour codes such as DB for dark blue', () => {
    expect(parseSett('DB12 W2')).toEqual([
      { colour: 'DB', count: 12 },
      { colour: 'W', count: 2 },
    ]);
  });

  it('refuses half counts at the pivots until we know how to read them', () => {
    expect(() => parseSett('K/2 R24 Y/2')).toThrow(/half count/);
  });

  it('refuses anything that is not a thread count, saying where', () => {
    expect(() => parseSett('K4 banana')).toThrow(/banana/);
    expect(() => parseSett('')).toThrow(/empty/);
    expect(() => parseSett('K0')).toThrow(/K0/);
  });
});

describe('expandSett', () => {
  it('mirrors a symmetric sett at each pivot without repeating the pivot stripes', () => {
    const threads = expandSett(parseSett('K2 R3 Y1'), 'symmetric');
    expect(threads.join('')).toBe('KKRRRYRRR');
  });

  it('repeats an asymmetric sett as written', () => {
    const threads = expandSett(parseSett('K2 R3 Y1'), 'asymmetric');
    expect(threads.join('')).toBe('KKRRRY');
  });
});

describe('tartan', () => {
  const colours = { K: '#101010', R: '#b01020', Y: '#e0c020' };
  const cloth = tartan({ sett: 'K2 R3 Y1', symmetry: 'symmetric', colours });

  it('uses the same sett for warp and weft', () => {
    for (let n = 0; n < 18; n++) expect(cloth.warpColour(n)).toBe(cloth.weftColour(n));
  });

  it('colours the threads from the sett, repeating it', () => {
    expect([0, 2, 5, 6, 9].map((n) => cloth.warpColour(n))).toEqual([
      '#101010',
      '#b01020',
      '#e0c020',
      '#b01020',
      '#101010',
    ]);
  });

  it('is woven in 2/2 twill', () => {
    expect([0, 1, 2, 3].map((i) => cloth.warpUp(i, 0))).toEqual([true, true, false, false]);
    expect([0, 1, 2, 3].map((i) => cloth.warpUp(i, 1))).toEqual([false, true, true, false]);
  });

  it('refuses a sett with a colour it has no value for', () => {
    expect(() => tartan({ sett: 'K2 G4', symmetry: 'symmetric', colours })).toThrow(/G/);
  });
});
