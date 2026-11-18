import { readSettings, writeAddress, type Settings } from './address';
import { continueWith, programme, type Programme } from './core/programme';
import { startPanel } from './panel';
import { startLoom } from './render/loom';
import { sceneFromAddress } from './scenes';

let settings = readSettings(location.search);
// Made-up tartans with no seed in the address get one now, kept for the whole visit, so a
// change of colour does not also change every tartan.
const chance = Math.random();
const scene = (s: Settings) => sceneFromAddress(writeAddress(s), () => chance);

const caption = document.getElementById('caption')!;
caption.hidden = !settings.caption;

// Each piece hands over to the next thread by thread, over `blend` picks (0 for a straight line).
let woven: Programme = programme(scene(settings).pieces, settings.blend);

const loom = startLoom(document.getElementById('loom') as HTMLCanvasElement, woven, {
  cell: settings.cell,
  picksPerSecond: settings.speed,
  onPiece: (place) => {
    caption.textContent = place.piece.caption;
  },
});

// The settings that change what is woven, rather than how it is shown.
const cloth = (s: Settings): string => writeAddress({ ...s, speed: 0, cell: 0, caption: true, live: false });

// Settings changed as they are made: weave them in without starting again.
function weaveIn(next: Settings): void {
  loom.setSpeed(next.speed);
  loom.setCell(next.cell);
  caption.hidden = !next.caption;
  if (cloth(next) !== cloth(settings)) {
    const pieces = scene(next).pieces;
    const fresh = programme(pieces, next.blend);
    // Carry on in the same design, at the same row, if it is still there; otherwise start the
    // new list from the beginning. The change starts with the next row.
    const at = loom.pick() + 1;
    const now = woven.row(at);
    const same = pieces[now.index]?.name === now.piece.name ? now.index : pieces.findIndex((p) => p.name === now.piece.name);
    const from = same >= 0 ? fresh.start(same) + (now.pick % pieces[same]!.picks) : 0;
    woven = continueWith(woven, fresh, { at, from, blend: next.blend });
    loom.setProgramme(woven);
  }
  settings = next;
}

startPanel(settings, { onLive: weaveIn });
