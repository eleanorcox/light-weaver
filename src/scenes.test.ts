import { describe, expect, it } from 'vitest';
import { sceneFromAddress, SCENE_NAMES } from './scenes';

describe('scenes', () => {
  it('builds every named scene', () => {
    for (const name of SCENE_NAMES) {
      const scene = sceneFromAddress(`?scene=${name}`);
      expect(scene.name).toBe(name);
      expect(typeof scene.cloth.warpUp(0, 0)).toBe('boolean');
      expect(scene.caption.length).toBeGreaterThan(0);
    }
  });

  it('falls back to a made-up tartan for a missing or unknown scene', () => {
    expect(sceneFromAddress('').name).toBe('tartan');
    expect(sceneFromAddress('?scene=nonsense').name).toBe('tartan');
  });

  it('gives the same made-up tartan for the same seed, and says it is made up', () => {
    const a = sceneFromAddress('?scene=tartan&seed=12');
    const b = sceneFromAddress('?scene=tartan&seed=12');
    expect(a.caption).toBe(b.caption);
    expect(a.caption).toMatch(/made-up/i);
    for (let n = 0; n < 50; n++) expect(a.cloth.warpColour(n)).toBe(b.cloth.warpColour(n));
  });

  it('reports the seed it used, so a drawn tartan can be shown again', () => {
    expect(sceneFromAddress('?scene=tartan&seed=12').seed).toBe(12);
    expect(sceneFromAddress('?scene=tartan', () => 0.5).seed).toBeTypeOf('number');
  });
});
