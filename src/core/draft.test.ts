import { describe, expect, it } from 'vitest';
import { basketWeave, birdsEye, brokenTwill, diamondTwill, monksBelt, drawdown, herringbone, plainWeave, pointTwill, satin, twill, twill22 } from './draft';

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

describe('twill by its counts', () => {
  it('weaves 3/1 twill: over three, under one, stepping one thread each pick', () => {
    expect(picture(twill(3, 1), 8, 4)).toEqual(['|||-|||-', '-|||-|||', '|-|||-||', '||-|||-|']);
  });

  it('weaves 2/1 twill on three shafts', () => {
    expect(picture(twill(2, 1), 6, 3)).toEqual(['||-||-', '-||-||', '|-||-|']);
  });

  it('gives the same cloth as the named 2/2 twill', () => {
    expect(picture(twill(2, 2), 12, 8)).toEqual(picture(twill22(), 12, 8));
  });

  it('refuses counts below one', () => {
    expect(() => twill(0, 2)).toThrow();
  });
});

describe('broken twill', () => {
  it('keeps two up and two down in every row, but swaps the last two picks so no diagonal runs on', () => {
    expect(picture(brokenTwill(), 4, 4)).toEqual(['||--', '-||-', '|--|', '--||']);
  });
});

describe("monk's belt", () => {
  // Block A is threads 0 to 5 (shafts 0 and 1), block B threads 6 to 11 (shafts 2 and 3).
  const up = drawdown(monksBelt());

  it('floats the pattern weft over block A and under block B on a block A pick', () => {
    for (let i = 0; i < 6; i++) expect(up(i, 0)).toBe(false);
    for (let i = 6; i < 12; i++) expect(up(i, 0)).toBe(true);
  });

  it('floats the pattern weft over block B on a block B pick', () => {
    for (let i = 0; i < 6; i++) expect(up(i, 6)).toBe(true);
    for (let i = 6; i < 12; i++) expect(up(i, 6)).toBe(false);
  });

  it('weaves a plain-weave tabby pick between every two pattern picks', () => {
    for (const j of [1, 3, 5, 7, 9, 11]) {
      const row = Array.from({ length: 12 }, (_, i) => up(i, j));
      for (let i = 1; i < 12; i++) expect(row[i]).not.toBe(row[i - 1]);
    }
  });
});

describe("bird's eye", () => {
  it('threads 4,3,2,3,4,1,2,3,4,3,2,1 on four shafts, as Schacht gives it', () => {
    expect(birdsEye().threading).toEqual([3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 1, 0]);
  });

  it('is woven as drawn in: the treadling follows the threading', () => {
    expect(birdsEye().treadling).toEqual(birdsEye().threading);
  });

  // A point threading turning back on itself floats a thread over three at each turn.
  it('never floats a thread over more than three others, either way', () => {
    const rows = picture(birdsEye(), 48, 48);
    for (const row of rows) expect(row).not.toMatch(/\|{4}|-{4}/);
    for (let i = 0; i < 48; i++) expect(rows.map((r) => r[i]).join('')).not.toMatch(/\|{4}|-{4}/);
  });
});
