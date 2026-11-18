import { formatColours, parseColours, type Palette } from './core/palette';
import { SCENE_NAMES } from './scenes';

// Everything that can be chosen before Light Weaver starts. The settings panel edits these and
// writes them into the address, so every choice can be shared as a link.
export interface Settings {
  play: string[]; // designs, in order
  picks: number; // rows each design is woven for
  speed: number; // picks per second
  blend: number; // rows a change from one design to the next is spread over
  cell: number; // pixels per thread
  seed?: number; // for made-up tartans; a new one each time if not given
  caption: boolean;
  setts: string[]; // typed tartans, which replace the designs when given
  colours: string; // colours for every design, as typed in ?colours=
  designColours: Record<string, Palette>; // each design's own changed colours, ?colours.<design>=
  live: boolean; // settings change the cloth as they are made, rather than when Weave is pressed
}

export const DEFAULTS: Settings = { play: SCENE_NAMES, picks: 200, speed: 8, blend: 32, cell: 8, caption: true, setts: [], colours: '', designColours: {}, live: false };

function number(params: URLSearchParams, name: string, fallback: number, least: number): number {
  const n = Number(params.get(name));
  return params.has(name) && Number.isFinite(n) && n >= least ? n : fallback;
}

export function readSettings(search: string): Settings {
  const params = new URLSearchParams(search);
  const scene = params.get('scene');
  const play = params.get('play');
  const listed = play !== null && play !== 'all' ? play.split(',') : scene !== null ? [scene] : SCENE_NAMES;
  const known = listed.filter((n) => SCENE_NAMES.includes(n));
  const seed = Number.parseInt(params.get('seed') ?? '', 10);
  return {
    play: known.length > 0 ? known : SCENE_NAMES,
    picks: Math.round(number(params, 'picks', DEFAULTS.picks, 1)),
    speed: number(params, 'speed', DEFAULTS.speed, 0.1),
    blend: Math.round(number(params, 'blend', DEFAULTS.blend, 0)),
    cell: number(params, 'cell', DEFAULTS.cell, 1),
    ...(Number.isFinite(seed) ? { seed } : {}),
    caption: params.get('caption') !== 'off',
    setts: params.getAll('sett'),
    live: params.get('live') === 'on',
    colours: params.get('colours') ?? '',
    designColours: Object.fromEntries(
      SCENE_NAMES.flatMap((name) => {
        try {
          const text = params.get(`colours.${name}`);
          return text === null ? [] : [[name, parseColours(text)]];
        } catch {
          return []; // the caption says what was wrong
        }
      }),
    ),
  };
}

// The address for some settings, leaving out anything at its default. Commas are kept as
// written, so a list of designs stays readable.
export function writeAddress(s: Settings): string {
  const parts: string[] = [];
  const all = s.play.length === SCENE_NAMES.length && s.play.every((n, k) => n === SCENE_NAMES[k]);
  if (!all) parts.push(s.play.length === 1 ? `scene=${s.play[0]}` : `play=${s.play.join(',')}`);
  for (const sett of s.setts) parts.push(`sett=${encodeURIComponent(sett)}`);
  if (s.picks !== DEFAULTS.picks) parts.push(`picks=${s.picks}`);
  if (s.speed !== DEFAULTS.speed) parts.push(`speed=${s.speed}`);
  if (s.blend !== DEFAULTS.blend) parts.push(`blend=${s.blend}`);
  if (s.cell !== DEFAULTS.cell) parts.push(`cell=${s.cell}`);
  if (s.seed !== undefined) parts.push(`seed=${s.seed}`);
  if (!s.caption) parts.push('caption=off');
  if (s.live) parts.push('live=on');
  if (s.colours) parts.push(`colours=${s.colours}`);
  for (const [name, colours] of Object.entries(s.designColours)) {
    if (Object.keys(colours).length > 0) parts.push(`colours.${name}=${formatColours(colours)}`);
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}
