import { readSettings } from './address';
import { programme } from './core/programme';
import { startPanel } from './panel';
import { startLoom } from './render/loom';
import { sceneFromAddress } from './scenes';

const settings = readSettings(location.search);
const scene = sceneFromAddress(location.search);

const caption = document.getElementById('caption')!;
caption.hidden = !settings.caption;

// Each piece hands over to the next thread by thread, over `blend` picks (0 for a straight line).
const woven = programme(scene.pieces, settings.blend);

startLoom(document.getElementById('loom') as HTMLCanvasElement, woven, {
  cell: settings.cell,
  picksPerSecond: settings.speed,
  onPiece: (place) => {
    caption.textContent = place.piece.caption;
  },
});

startPanel(settings);
