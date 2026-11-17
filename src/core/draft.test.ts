import { describe, expect, it } from 'vitest';
import { drawdown, herringbone, plainWeave, twill22 } from './draft';

// Rows of the drawdown as strings: '|' where the warp is on top, '-' where the weft is.
function picture(draft: Parameters<typeof drawdown>[0], ends: number, picks: number): string[] {
  const up = drawdown(draft);
  return Array.from({ length: picks }, (_, j) =>
    Array.from({ length: ends }, (_, i) => (up(i, j) ? '|' : '-')).join(''),
  );
}

describe('plain weave', () => {
  it('alternates over one, under one, and swaps every pick', () => {
    expect(picture(plainWeave(), 6, 3)).toEqual(['|-|-|-', '-|-|-|', '|-|-|-']);
  });
});

describe('2/2 twill', () => {
  it('goes over two, under two, stepping one thread each pick', () => {
    expect(picture(twill22(), 8, 4)).toEqual(['||--||--', '-||--||-', '--||--||', '|--||--|']);
  });

  it('never floats a thread over more than two others', () => {
    const rows = picture(twill22(), 40, 40);
    for (const row of rows) expect(row).not.toMatch(/\|\|\||---/);
  });
});

describe('herringbone', () => {
  it('slopes one way in the first block and the other way in the second', () => {
    const rows = picture(herringbone(4), 8, 4);
    expect(rows.map((r) => r.slice(0, 4))).toEqual(['||--', '-||-', '--||', '|--|']);
    expect(rows.map((r) => r.slice(4, 8))).toEqual(['||--', '|--|', '--||', '-||-']);
  });

  it('has a clean break: the threads either side of it are always on opposite sides', () => {
    const up = drawdown(herringbone(4));
    for (let j = 0; j < 16; j++) {
      expect(up(3, j)).not.toBe(up(4, j));
      expect(up(7, j)).not.toBe(up(8, j));
    }
  });

  it('repeats every two blocks', () => {
    const up = drawdown(herringbone(6));
    for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) expect(up(i + 12, j)).toBe(up(i, j));
  });
});

describe('drawdown', () => {
  it('repeats the threading and treadling for ever, including at negative positions', () => {
    const up = drawdown(twill22());
    expect(up(-1, 0)).toBe(up(3, 0));
    expect(up(1000, 1000)).toBe(up(0, 0));
  });
});
