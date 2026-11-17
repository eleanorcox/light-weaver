import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SCENE_NAMES } from './scenes';

// Every design has a screenshot and an entry in the gallery. Run `npm run screenshots <name>`
// after adding one, and add it to docs/designs.md.
describe('the design gallery', () => {
  const gallery = readFileSync('docs/designs.md', 'utf8');

  it.each(SCENE_NAMES)('has a screenshot of %s', (name) => {
    expect(existsSync(`docs/designs/${name}.png`)).toBe(true);
  });

  it.each(SCENE_NAMES)('shows %s in docs/designs.md', (name) => {
    expect(gallery).toContain(`designs/${name}.png`);
  });
});
