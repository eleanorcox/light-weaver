import { describe, expect, it } from 'vitest';
import { DEFAULTS, readSettings, writeAddress } from './address';
import { DESIGN_LABELS, SCENE_NAMES } from './scenes';

describe('reading settings from the address', () => {
  it('uses the defaults for an empty address: every design, 200 picks, 8 a second', () => {
    expect(readSettings('')).toEqual(DEFAULTS);
    expect(DEFAULTS.play).toEqual(SCENE_NAMES);
  });

  it('reads one design from ?scene= and a list from ?play=', () => {
    expect(readSettings('?scene=glen').play).toEqual(['glen']);
    expect(readSettings('?play=glen,nonsense,satin').play).toEqual(['glen', 'satin']);
    expect(readSettings('?play=tartan,glen,tartan').play).toEqual(['tartan', 'glen', 'tartan']);
  });

  it('reads the numbers, the seed, captions and typed setts', () => {
    const s = readSettings('?picks=30&speed=16&blend=0&cell=12&seed=780891&caption=off&sett=B6G6&sett=K4R24');
    expect(s).toMatchObject({ picks: 30, speed: 16, blend: 0, cell: 12, seed: 780891, caption: false, setts: ['B6G6', 'K4R24'] });
  });

  it('falls back to the default for numbers it cannot read', () => {
    expect(readSettings('?picks=lots&speed=-3').picks).toBe(200);
    expect(readSettings('?picks=lots&speed=-3').speed).toBe(8);
  });
});

describe('writing settings into the address', () => {
  it('leaves out anything at its default, so the usual address is empty', () => {
    expect(writeAddress(DEFAULTS)).toBe('');
  });

  it('writes one design as ?scene= and several as ?play=', () => {
    expect(writeAddress({ ...DEFAULTS, play: ['glen'] })).toBe('?scene=glen');
    expect(writeAddress({ ...DEFAULTS, play: ['glen', 'kasuri', 'tartan'] })).toBe('?play=glen,kasuri,tartan');
  });

  it('gives back the same settings when read again', () => {
    const s = { ...DEFAULTS, play: ['damask', 'tartan'], picks: 30, speed: 12, blend: 0, cell: 6, seed: 42, caption: false, setts: ['B6G6B6R2Y4', 'K4R24'] };
    expect(readSettings(writeAddress(s))).toEqual(s);
  });
});

describe('design labels', () => {
  it('gives every design a short name to show in the settings', () => {
    for (const name of SCENE_NAMES) expect(DESIGN_LABELS[name]?.length).toBeGreaterThan(0);
    expect(DESIGN_LABELS.glen).toBe('Glen check');
    expect(DESIGN_LABELS.tartan).toBe('A made-up tartan');
    expect(DESIGN_LABELS.kasuri).toBe('Kasuri');
  });
});
