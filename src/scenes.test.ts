import { describe, expect, it } from 'vitest';
import { sceneFromAddress, SCENE_NAMES } from './scenes';

describe('scenes', () => {
  it('builds every named scene as a single piece', () => {
    for (const name of SCENE_NAMES) {
      const scene = sceneFromAddress(`?scene=${name}`);
      expect(scene.name).toBe(name);
      expect(scene.pieces).toHaveLength(1);
      expect(typeof scene.pieces[0]!.cloth.warpUp(0, 0)).toBe('boolean');
      expect(scene.pieces[0]!.caption.length).toBeGreaterThan(0);
    }
  });

  it('falls back to a made-up tartan for an unknown scene', () => {
    expect(sceneFromAddress('?scene=nonsense').name).toBe('tartan');
  });

  it('gives the same made-up tartan for the same seed, and says it is made up', () => {
    const a = sceneFromAddress('?scene=tartan&seed=12').pieces[0]!;
    const b = sceneFromAddress('?scene=tartan&seed=12').pieces[0]!;
    expect(a.caption).toBe(b.caption);
    expect(a.caption).toMatch(/made-up/i);
    for (let n = 0; n < 50; n++) expect(a.cloth.warpColour(n, 0)).toBe(b.cloth.warpColour(n, 0));
  });

  it('reports the seed it used, so a drawn tartan can be shown again', () => {
    expect(sceneFromAddress('?scene=tartan&seed=12').seed).toBe(12);
  });
});

describe('playing one cloth after another', () => {
  it('plays every design when the address names none', () => {
    const scene = sceneFromAddress('');
    expect(scene.name).toBe('play');
    expect(scene.pieces.length).toBe(SCENE_NAMES.length);
  });

  it('plays the designs listed in ?play=, in order, skipping names it does not know', () => {
    const scene = sceneFromAddress('?play=glen,nonsense,satin,tartan&seed=3');
    expect(scene.pieces.map((p) => p.caption.split(':')[0])).toEqual(['Glen check', 'Satin', expect.stringMatching(/made-up tartan/)]);
  });

  it('weaves each piece for ?picks= rows, 200 by default', () => {
    expect(sceneFromAddress('?play=glen').pieces[0]!.picks).toBe(200);
    expect(sceneFromAddress('?play=glen&picks=50').pieces[0]!.picks).toBe(50);
  });

  it('gives each made-up tartan in a programme its own seed', () => {
    const scene = sceneFromAddress('?play=tartan,tartan&seed=3');
    expect(scene.pieces[0]!.caption).not.toBe(scene.pieces[1]!.caption);
  });
});

describe('a sett typed into the address', () => {
  it('weaves the given sett and says so, written out in the usual form', () => {
    const piece = sceneFromAddress('?sett=B6G6B6R2Y4').pieces[0]!;
    expect(piece.caption).toMatch(/B6 G6 B6 R2 Y4/);
    expect(piece.cloth.warpColour(0, 0)).toBe(piece.cloth.weftColour(0, 0));
  });

  it('weaves several typed setts one into another, in the order given', () => {
    const scene = sceneFromAddress('?sett=B6G6B6R2Y4&sett=K4R24K24Y4&picks=80');
    expect(scene.name).toBe('play');
    expect(scene.pieces.map((p) => p.caption)).toEqual([expect.stringMatching(/B6 G6 B6 R2 Y4/), expect.stringMatching(/K4 R24 K24 Y4/)]);
    expect(scene.pieces.every((p) => p.picks === 80)).toBe(true);
  });

  it('weaves the setts it can read when one of several cannot be, and says which', () => {
    const scene = sceneFromAddress('?sett=B6G6&sett=banana&sett=K4R24');
    expect(scene.pieces).toHaveLength(2);
    expect(scene.pieces[0]!.caption).toMatch(/banana/);
  });

  it('falls back to a made-up tartan and says what was wrong with a sett it cannot read', () => {
    const scene = sceneFromAddress('?sett=B6 banana');
    expect(scene.name).toBe('tartan');
    expect(scene.pieces[0]!.caption).toMatch(/banana/);
  });
});

describe('colours in the address', () => {
  it('changes the colours a design uses', () => {
    const piece = sceneFromAddress('?scene=houndstooth&colours=L-ff0000').pieces[0]!;
    expect(piece.cloth.warpColour(0, 0)).toBe('#ff0000');
  });

  it('adds new colour letters that a typed sett can use', () => {
    const piece = sceneFromAddress('?sett=P4K4&colours=P-9b4dff').pieces[0]!;
    expect(piece.cloth.warpColour(0, 0)).toBe('#9b4dff');
  });

  it('says so in the caption when the colours cannot be read, and uses the usual ones', () => {
    const piece = sceneFromAddress('?scene=houndstooth&colours=L-red').pieces[0]!;
    expect(piece.caption).toMatch(/L-red/);
    expect(piece.cloth.warpColour(0, 0)).not.toBe('red');
  });
});

describe('the named weaves and checks', () => {
  it('includes denim, broken twill, gingham, windowpane, tattersall and Prince of Wales check', () => {
    for (const name of ['denim', 'broken', 'gingham', 'windowpane', 'tattersall', 'prince']) expect(SCENE_NAMES).toContain(name);
  });
});
