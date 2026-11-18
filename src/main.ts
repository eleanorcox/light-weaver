import { programme } from './core/programme';
import { startLoom } from './render/loom';
import { sceneFromAddress } from './scenes';

const params = new URLSearchParams(location.search);
const scene = sceneFromAddress(location.search);

const caption = document.getElementById('caption')!;
caption.hidden = params.get('caption') === 'off';

// Each piece hands over to the next thread by thread, over ?blend= picks (0 for a straight line).
const blend = Number.parseInt(params.get('blend') ?? '', 10);
const woven = programme(scene.pieces, Number.isFinite(blend) && blend >= 0 ? blend : 32);

startLoom(document.getElementById('loom') as HTMLCanvasElement, woven, {
  cell: Number(params.get('cell')) || 8,
  picksPerSecond: Number(params.get('speed')) || 8,
  onPiece: (place) => {
    caption.textContent = place.piece.caption;
  },
});
