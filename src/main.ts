import { programme } from './core/programme';
import { startLoom } from './render/loom';
import { sceneFromAddress } from './scenes';

const params = new URLSearchParams(location.search);
const scene = sceneFromAddress(location.search);

const caption = document.getElementById('caption')!;
caption.hidden = params.get('caption') === 'off';

// Pieces in a programme are separated by a short stretch of bare loom.
const at = programme(scene.pieces, scene.pieces.length > 1 ? 16 : 0);

startLoom(document.getElementById('loom') as HTMLCanvasElement, at, {
  cell: Number(params.get('cell')) || 8,
  picksPerSecond: Number(params.get('speed')) || 8,
  onPiece: (place) => {
    caption.textContent = place.piece.caption;
  },
});
