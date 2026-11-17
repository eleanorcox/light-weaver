import { describe, expect, it } from 'vitest';
import { parseColours } from './palette';

describe('parseColours', () => {
  it('reads colour letters and hex values, without the # that web addresses cannot carry', () => {
    expect(parseColours('B-2a4bd7,Y-FFD23A')).toEqual({ B: '#2a4bd7', Y: '#ffd23a' });
  });

  it('accepts short hex values and lower-case letters', () => {
    expect(parseColours('p-f0c')).toEqual({ P: '#f0c' });
  });

  it('accepts a # when one is given, and multi-letter codes', () => {
    expect(parseColours('DB-#123456')).toEqual({ DB: '#123456' });
  });

  it('refuses anything else, quoting it', () => {
    expect(() => parseColours('B-blue')).toThrow(/B-blue/);
    expect(() => parseColours('B2a4bd7')).toThrow(/B2a4bd7/);
  });
});
