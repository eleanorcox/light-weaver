import { startLoom } from './render/loom';
import { sceneFromAddress } from './scenes';

const params = new URLSearchParams(location.search);
const scene = sceneFromAddress(location.search);

const caption = document.getElementById('caption')!;
caption.textContent = scene.caption;
caption.hidden = params.get('caption') === 'off';

startLoom(document.getElementById('loom') as HTMLCanvasElement, scene.cloth, {
  cell: Number(params.get('cell')) || 8,
  picksPerSecond: Number(params.get('speed')) || 8,
});
