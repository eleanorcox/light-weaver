import { describe, expect, it } from 'vitest';
import { damask, doubleCloth } from './blocks';

// A motif in blocks: '#' for the figure, '.' for the ground.
const motif = ['#.', '..'];

describe('linen damask', () => {
  const cloth = damask({ motif, block: 5, ends: 5, step: 2, colours: { warp: '#fff', weft: '#888' } });

  it('lays the warp on top over the figure: four threads in five, a warp satin', () => {
    for (let j = 0; j < 5; j++) {
      const row = Array.from({ length: 5 }, (_, i) => cloth.warpUp(i, j));
      expect(row.filter(Boolean)).toHaveLength(4);
    }
  });

  it('lays the weft on top over the ground: the same satin reversed, a weft sateen', () => {
    for (let j = 0; j < 10; j++) for (let i = 5; i < 10; i++) expect(cloth.warpUp(i, j)).toBe(!cloth.warpUp(i - 5, j % 5));
  });

  it('weaves with one warp and one weft throughout', () => {
    expect(new Set([0, 3, 7, 12].map((i) => cloth.warpColour(i, i)))).toEqual(new Set(['#fff']));
    expect(new Set([0, 3, 7, 12].map((j) => cloth.weftColour(j, j)))).toEqual(new Set(['#888']));
  });

  it('repeats the motif in both directions', () => {
    expect(cloth.warpUp(1, 1)).toBe(cloth.warpUp(11, 21));
  });
});

describe('double cloth', () => {
  const colours = { a: { warp: '#f00', weft: '#e00' }, b: { warp: '#00f', weft: '#00e' } };
  const cloth = doubleCloth({ motif, block: 4, colours });
  const shown = (i: number, j: number): string => (cloth.warpUp(i, j) ? cloth.warpColour(i, j) : cloth.weftColour(j, i));

  it('shows layer A on the face where the motif has the figure, and only layer A', () => {
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) expect(['#f00', '#e00']).toContain(shown(i, j));
  });

  it('shows layer B on the face in the ground, the layers having swapped places', () => {
    for (let j = 0; j < 8; j++) for (let i = 4; i < 8; i++) expect(['#00f', '#00e']).toContain(shown(i, j));
  });

  it('weaves the face layer in plain weave', () => {
    expect([0, 1, 2, 3].map((i) => cloth.warpUp(i, 0))).toEqual([true, false, true, false]);
    expect([0, 1, 2, 3].map((i) => cloth.warpUp(i, 1))).toEqual([false, true, false, true]);
  });

  it('refuses a motif with rows of different lengths', () => {
    expect(() => doubleCloth({ motif: ['#.', '#'], block: 4, colours })).toThrow();
  });
});
