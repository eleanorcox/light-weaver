// Colours for the settings panel's picker: hex values, and hue, saturation and lightness, which
// are easier to move between by hand.

export interface Hsl {
  h: number; // 0 to 360
  s: number; // 0 to 100
  l: number; // 0 to 100
}

export function sixDigits(hex: string): string {
  const h = hex.toLowerCase();
  return h.length === 4 ? `#${[...h.slice(1)].map((d) => d + d).join('')}` : h;
}

// Rounded to whole numbers for sliders, unless `exact`.
export function hexToHsl(hex: string, exact = false): Hsl {
  const n = Number.parseInt(sixDigits(hex).slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  const round = (v: number): number => (exact ? v : Math.round(v));
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToHex({ h, s, l }: Hsl): string {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return `#${[r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')}`;
}
