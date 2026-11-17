import { describe, expect, it } from 'vitest';
import { kasuri } from './kasuri';

const motif = ['....', '.##.', '.##.', '....'];
const colours = { dyed: '#123', undyed: '#fff' };

describe('kasuri', () => {
  it('with no drift, shows the motif white and the ground indigo, whichever thread is on top', () => {
    const cloth = kasuri({ motif, colours, drift: 0, seed: 1 });
    for (let j = 0; j < 8; j++)
      for (let i = 0; i < 8; i++) {
        const inMotif = motif[j % 4]![i % 4] === '#';
        const shown = cloth.warpUp(i, j) ? cloth.warpColour(i, j) : cloth.weftColour(j, i);
        expect(shown).toBe(inMotif ? '#fff' : '#123');
      }
  });

  it('is plain weave underneath', () => {
    const cloth = kasuri({ motif, colours, drift: 0, seed: 1 });
    expect([0, 1, 2, 3].map((i) => cloth.warpUp(i, 0))).toEqual([true, false, true, false]);
  });

  it('dyes each thread along its length, so one thread changes colour as it goes', () => {
    const cloth = kasuri({ motif, colours, drift: 0, seed: 1 });
    expect(cloth.warpColour(1, 0)).toBe('#123');
    expect(cloth.warpColour(1, 1)).toBe('#fff');
  });

  it('shifts each thread a little from where it should be, so the edges blur, by at most the drift', () => {
    const big = ['........', '........', '..####..', '..####..', '..####..', '..####..', '........', '........'];
    const cloth = kasuri({ motif: big, colours, drift: 1, seed: 7 });
    let differs = false;
    for (let j = 0; j < 8; j++)
      for (let i = 0; i < 8; i++) {
        const shown = cloth.warpUp(i, j) ? cloth.warpColour(i, j) : cloth.weftColour(j, i);
        const exact = big[j]![i] === '#' ? '#fff' : '#123';
        if (shown !== exact) differs = true;
        // Two or more threads from any edge, the drift cannot reach.
        const deepInside = i >= 3 && i <= 4 && j >= 3 && j <= 4;
        const farOutside = (i === 0 || i === 7) && (j === 0 || j === 7);
        if (deepInside || farOutside) expect(shown).toBe(exact);
      }
    expect(differs).toBe(true);
  });

  it('gives the same cloth from the same seed', () => {
    const a = kasuri({ motif, colours, drift: 1, seed: 3 });
    const b = kasuri({ motif, colours, drift: 1, seed: 3 });
    for (let n = 0; n < 16; n++) expect(a.warpColour(n, n * 3)).toBe(b.warpColour(n, n * 3));
  });

  it('refuses a motif whose rows are not all the same length', () => {
    expect(() => kasuri({ motif: ['..', '...'], colours, drift: 0, seed: 1 })).toThrow();
  });
});
