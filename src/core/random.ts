// Mulberry32: a small, fast generator of repeatable random numbers from a seed.
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A made-up tartan sett from the given colour letters: 3 to 7 stripes of even counts,
// never the same colour twice in a row. Wide grounds, narrow accents, as in most tartans.
export function generateSett(random: () => number, letters: readonly string[]): string {
  const stripes = 3 + Math.floor(random() * 5);
  const parts: string[] = [];
  let previous = '';
  for (let n = 0; n < stripes; n++) {
    let colour = previous;
    while (colour === previous) colour = letters[Math.floor(random() * letters.length)]!;
    const wide = random() < 0.5;
    const count = 2 * (wide ? 6 + Math.floor(random() * 15) : 1 + Math.floor(random() * 4));
    parts.push(`${colour}${count}`);
    previous = colour;
  }
  return parts.join(' ');
}
