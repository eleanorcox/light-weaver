import { describe, expect, it } from 'vitest';
import { basketWeave, diamondTwill, drawdown, herringbone, plainWeave, pointTwill, satin, twill22 } from './draft';

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

describe('point twill', () => {
  it('runs up and back down the shafts, so each row mirrors around the turning thread', () => {
    const up = drawdown(pointTwill());
    for (let j = 0; j < 8; j++) for (let k = 1; k < 3; k++) expect(up(3 + k, j)).toBe(up(3 - k, j));
  });

  it('floats a thread over three others at most, at the turns, and over two elsewhere', () => {
    const up = drawdown(pointTwill());
    for (let j = 0; j < 12; j++) {
      const row = Array.from({ length: 24 }, (_, i) => (up(i, j) ? '|' : '-')).join('');
      expect(row).not.toMatch(/\|\|\|\||----/);
    }
  });
});

describe('diamond twill', () => {
  it('mirrors both across and down, making diamonds', () => {
    const up = drawdown(diamondTwill());
    for (let j = 0; j < 6; j++)
      for (let i = 0; i < 6; i++) {
        expect(up(3 + i, j)).toBe(up(3 - i, j));
        expect(up(i, 3 + j)).toBe(up(i, 3 - j));
      }
  });
});

describe('basket weave', () => {
  it('weaves threads in pairs, like plain weave with doubled threads', () => {
    const up = drawdown(basketWeave());
    for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]] as const) expect(up(i, j)).toBe(true);
    expect(up(2, 0)).toBe(false);
    expect(up(0, 2)).toBe(false);
    expect(up(2, 2)).toBe(true);
  });
});

describe('satin', () => {
  const up = drawdown(satin(5, 2));

  it('lifts exactly one warp thread in every five, in every row and every column', () => {
    for (let n = 0; n < 5; n++) {
      expect([0, 1, 2, 3, 4].filter((i) => up(i, n)).length).toBe(1);
      expect([0, 1, 2, 3, 4].filter((j) => up(n, j)).length).toBe(1);
    }
  });

  it('moves two threads along each row, so no diagonal line shows', () => {
    for (let j = 0; j < 5; j++) {
      const here = [0, 1, 2, 3, 4].find((i) => up(i, j))!;
      const next = [0, 1, 2, 3, 4].find((i) => up(i, j + 1))!;
      expect((next - here + 5) % 5).toBe(2);
    }
  });

  it('refuses a step that would make a twill or repeat a thread', () => {
    expect(() => satin(5, 1)).toThrow();
    expect(() => satin(6, 2)).toThrow();
  });
});
