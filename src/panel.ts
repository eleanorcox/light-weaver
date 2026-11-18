import { DEFAULTS, writeAddress, type Settings } from './address';
import { DESIGN_LABELS, SCENE_NAMES } from './scenes';

// How long the settings button stays after the mouse last moved, so the piece is left alone
// when nobody is touching it.
const IDLE_MS = 3000;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...children: (Node | string)[]): HTMLElementTagNameMap[K] {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function slider(label: string, value: number, min: number, max: number, step: number, unit: string): { row: HTMLElement; input: HTMLInputElement } {
  const input = el('input', { type: 'range', min: String(min), max: String(max), step: String(step), value: String(value) });
  const shown = el('output', { textContent: `${value}${unit}` });
  input.addEventListener('input', () => (shown.textContent = `${input.value}${unit}`));
  return { row: el('label', { className: 'row' }, el('span', {}, label), input, shown), input };
}

// A settings panel, hidden while the cloth weaves. Weaving with new settings writes them into
// the address and starts again, so the same address always gives the same cloth.
export function startPanel(settings: Settings): void {
  const button = el('button', { className: 'open', type: 'button', textContent: 'Settings', ariaLabel: 'Open the settings' });
  const panel = el('form', { className: 'panel', hidden: true, ariaLabel: 'Settings' });

  const boxes = SCENE_NAMES.map((name) => {
    const box = el('input', { type: 'checkbox', value: name, checked: settings.play.includes(name) });
    return { name, box, row: el('label', { className: 'design' }, box, DESIGN_LABELS[name] ?? name) };
  });
  const tick = (on: boolean) => () => boxes.forEach((b) => (b.box.checked = on));
  const all = el('button', { type: 'button', textContent: 'All' });
  const none = el('button', { type: 'button', textContent: 'None' });
  all.addEventListener('click', tick(true));
  none.addEventListener('click', tick(false));

  const picks = slider('Rows per design', settings.picks, 10, 400, 10, '');
  const speed = slider('Speed', settings.speed, 1, 40, 1, ' rows a second');
  const blend = slider('Blend', settings.blend, 0, 64, 2, ' rows');
  const cell = slider('Thread size', settings.cell, 3, 24, 1, ' px');
  const seed = el('input', { type: 'number', min: '0', step: '1', value: settings.seed === undefined ? '' : String(settings.seed), placeholder: 'new each time' });
  const setts = el('textarea', { rows: 2, value: settings.setts.join('\n'), placeholder: 'B6 G6 B6 R2 Y4', spellcheck: false });
  const caption = el('input', { type: 'checkbox', checked: settings.caption });
  const weave = el('button', { type: 'submit', className: 'weave', textContent: 'Weave' });
  const reset = el('button', { type: 'button', textContent: 'Start afresh' });
  const close = el('button', { type: 'button', className: 'close', textContent: '×', ariaLabel: 'Close the settings' });

  panel.append(
    el('header', {}, el('h2', {}, 'Light Weaver'), close),
    el('fieldset', {}, el('legend', {}, 'Designs, woven in turn'), el('div', { className: 'pair' }, all, none), el('div', { className: 'designs' }, ...boxes.map((b) => b.row))),
    el('fieldset', {}, el('legend', {}, 'Weaving'), picks.row, speed.row, blend.row, cell.row),
    el('fieldset', {}, el('legend', {}, 'Tartans'), el('label', { className: 'row' }, el('span', {}, 'Seed for made-up tartans'), seed), el('label', { className: 'stack' }, el('span', {}, 'Your own setts, one a line, woven instead of the designs'), setts)),
    el('label', { className: 'row' }, el('span', {}, 'Captions'), caption),
    el('div', { className: 'pair' }, weave, reset),
  );
  document.body.append(button, panel);

  function chosen(): Settings {
    const ticked = boxes.filter((b) => b.box.checked).map((b) => b.name);
    // Designs already playing keep their order (an address can choose one); new ones follow.
    const play = [...settings.play.filter((n) => ticked.includes(n)), ...ticked.filter((n) => !settings.play.includes(n))];
    const typedSeed = Number.parseInt(seed.value, 10);
    return {
      play: play.length > 0 ? play : DEFAULTS.play,
      picks: Number(picks.input.value),
      speed: Number(speed.input.value),
      blend: Number(blend.input.value),
      cell: Number(cell.input.value),
      ...(Number.isFinite(typedSeed) ? { seed: typedSeed } : {}),
      caption: caption.checked,
      setts: setts.value.split('\n').map((s) => s.trim()).filter(Boolean),
    };
  }

  const go = (search: string): void => location.assign(location.pathname + search);
  panel.addEventListener('submit', (event) => {
    event.preventDefault();
    go(writeAddress(chosen()));
  });
  reset.addEventListener('click', () => go(''));

  let idle = 0;
  const wake = (): void => {
    button.classList.add('awake');
    window.clearTimeout(idle);
    idle = window.setTimeout(() => button.classList.remove('awake'), IDLE_MS);
  };
  const open = (show: boolean): void => {
    panel.hidden = !show;
    button.hidden = show;
    if (show) (boxes[0]?.box ?? weave).focus();
    else button.focus({ preventScroll: true });
  };
  for (const kind of ['pointermove', 'pointerdown', 'keydown']) window.addEventListener(kind, wake);
  button.addEventListener('focus', wake);
  button.addEventListener('click', () => open(true));
  close.addEventListener('click', () => open(false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) open(false);
  });
}
