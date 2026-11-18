import { DEFAULTS, writeAddress, type Settings } from './address';
import { parseColours, type Palette } from './core/palette';
import { count, move, setCount, tick } from './playlist';
import { DESIGN_LABELS, DESIGN_PALETTES, SCENE_NAMES } from './scenes';

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

// A section whose heading folds it away.
function section(title: string, open: boolean, ...children: Node[]): HTMLDetailsElement {
  return el('details', { open }, el('summary', {}, title), ...children);
}

const label = (name: string): string => DESIGN_LABELS[name] ?? name;

// A settings panel, hidden while the cloth weaves. Weaving with new settings writes them into
// the address and starts again, so the same address always gives the same cloth.
export function startPanel(settings: Settings): void {
  let play = [...settings.play];

  const button = el('button', { className: 'open', type: 'button', textContent: 'Settings', ariaLabel: 'Open the settings' });
  const panel = el('form', { className: 'panel', hidden: true, ariaLabel: 'Settings' });

  // Designs: ticked to play. The made-up tartan can be played several times over.
  const many = el('input', { type: 'number', min: '1', max: '9', step: '1', className: 'many', ariaLabel: 'How many made-up tartans' });
  const boxes = SCENE_NAMES.map((name) => {
    const box = el('input', { type: 'checkbox', value: name });
    const row = el('label', { className: 'design' }, box, el('span', {}, label(name)));
    if (name === 'tartan') row.append(many);
    // On input, not change: input comes first, and the panel's own redraw on input would
    // otherwise put the old tick back before the change arrived.
    box.addEventListener('input', () => {
      play = tick(play, name, box.checked);
      refresh();
    });
    return { name, box };
  });
  many.addEventListener('input', () => {
    const n = Math.max(1, Math.min(9, Number.parseInt(many.value, 10) || 1));
    play = setCount(play, 'tartan', n);
    refresh();
  });
  const designs = el('div', { className: 'designs' }, ...boxes.map((b) => b.box.parentElement!));
  // Fill the first column, then the second, so the list reads down in gallery order.
  designs.style.setProperty('--rows', String(Math.ceil(SCENE_NAMES.length / 2)));
  const all = el('button', { type: 'button', textContent: 'All' });
  const none = el('button', { type: 'button', textContent: 'None' });
  all.addEventListener('click', () => {
    for (const name of SCENE_NAMES) play = tick(play, name, true);
    refresh();
  });
  none.addEventListener('click', () => {
    play = [];
    refresh();
  });

  // The order they are woven in: drag a row, or use its arrows.
  const order = el('ol', { className: 'order' });
  let dragging = -1;
  function drawOrder(): void {
    let tartans = 0;
    order.replaceChildren(
      ...play.map((name, k) => {
        const numbered = name === 'tartan' && count(play, 'tartan') > 1 ? `${label(name)} ${++tartans}` : label(name);
        const up = el('button', { type: 'button', textContent: '↑', ariaLabel: `Move ${numbered} earlier`, disabled: k === 0 });
        const down = el('button', { type: 'button', textContent: '↓', ariaLabel: `Move ${numbered} later`, disabled: k === play.length - 1 });
        up.addEventListener('click', () => reorder(k, k - 1));
        down.addEventListener('click', () => reorder(k, k + 1));
        const row = el('li', { draggable: true }, el('span', { className: 'grip', ariaHidden: 'true', textContent: '⋮⋮' }), el('span', { className: 'name' }, numbered), up, down);
        row.addEventListener('dragstart', (event) => {
          dragging = k;
          event.dataTransfer?.setData('text/plain', String(k));
          row.classList.add('dragging');
        });
        row.addEventListener('dragend', () => row.classList.remove('dragging'));
        row.addEventListener('dragover', (event) => {
          event.preventDefault();
          row.classList.add('target');
        });
        row.addEventListener('dragleave', () => row.classList.remove('target'));
        row.addEventListener('drop', (event) => {
          event.preventDefault();
          reorder(dragging, k);
        });
        return row;
      }),
    );
    if (play.length === 0) order.append(el('li', { className: 'empty' }, 'Nothing ticked: every design will play.'));
  }
  function reorder(from: number, to: number): void {
    play = move(play, from, to);
    refresh();
    // Keep focus on the same arrow, so it can be pressed again to keep moving the row.
    const arrows = order.children[to]?.querySelectorAll('button');
    const arrow = arrows?.[to < from ? 0 : 1] as HTMLButtonElement | undefined;
    (arrow && !arrow.disabled ? arrow : arrows?.[to < from ? 1 : 0])?.focus();
  }

  // Colours: a swatch for each colour of each design being woven. A change applies to that
  // design alone; Default puts its colours back.
  const designColours: Record<string, Record<string, string>> = Object.fromEntries(Object.entries(settings.designColours).map(([n, p]) => [n, { ...p }]));
  const everywhere = ((): Palette => {
    try {
      return parseColours(settings.colours);
    } catch {
      return {};
    }
  })();
  // Colour pickers need six-digit hex, so #f0c becomes #ff00cc.
  const six = (hex: string): string => (hex.length === 4 ? `#${[...hex.slice(1)].map((d) => d + d).join('')}` : hex);
  const colourList = el('div', { className: 'colours' });
  let colourKey = '';
  function drawColours(): void {
    const names = [...new Set(play.length > 0 ? play : DEFAULTS.play)];
    if (names.join() === colourKey) return;
    colourKey = names.join();
    colourList.replaceChildren(
      ...names.map((name) => {
        const usual = { ...DESIGN_PALETTES[name], ...everywhere };
        const swatches = Object.keys(DESIGN_PALETTES[name] ?? {}).map((code) => {
          const swatch = el('input', { type: 'color', value: six(designColours[name]?.[code] ?? usual[code]!), title: `Colour ${code}`, ariaLabel: `${label(name)}, colour ${code}` });
          swatch.addEventListener('input', () => {
            const own = (designColours[name] ??= {});
            if (swatch.value === six(usual[code]!)) delete own[code];
            else own[code] = swatch.value;
          });
          return swatch;
        });
        const usualButton = el('button', { type: 'button', textContent: 'Default', ariaLabel: `Default colours for ${label(name)}` });
        usualButton.addEventListener('click', () => {
          delete designColours[name];
          swatches.forEach((sw, k) => (sw.value = six(usual[Object.keys(DESIGN_PALETTES[name] ?? {})[k]!]!)));
          refresh();
        });
        // Made-up and typed tartans share these colours.
        const title = name === 'tartan' ? 'Tartans' : label(name);
        return el('div', { className: 'colour-row' }, el('span', { className: 'name', title }, title), el('span', { className: 'swatches' }, ...swatches), usualButton);
      }),
    );
  }

  const picks = slider('Rows per design', settings.picks, 10, 400, 10, '');
  const speed = slider('Speed', settings.speed, 1, 40, 1, ' rows a second');
  const blend = slider('Blend', settings.blend, 0, 64, 2, ' rows');
  const cell = slider('Thread size', settings.cell, 3, 24, 1, ' px');
  const caption = el('input', { type: 'checkbox', checked: settings.caption });
  const seed = el('input', { type: 'number', min: '0', step: '1', value: settings.seed === undefined ? '' : String(settings.seed), placeholder: 'new each time' });
  const setts = el('textarea', { rows: 2, value: settings.setts.join('\n'), placeholder: 'B6 G6 B6 R2 Y4', spellcheck: false });

  const weave = el('button', { type: 'submit', className: 'weave' });
  const reset = el('button', { type: 'button', textContent: 'Reset' });
  const close = el('button', { type: 'button', className: 'close', textContent: '×', ariaLabel: 'Close the settings' });

  panel.append(
    el('header', {}, el('h2', {}, 'Light Weaver'), close),
    el(
      'div',
      { className: 'body' },
      section('Designs', true, el('div', { className: 'pair' }, all, none), designs),
      section('Order', true, order),
      section('Colours', false, colourList),
      section('Weaving', false, picks.row, speed.row, blend.row, cell.row, el('label', { className: 'row' }, el('span', {}, 'Captions'), caption)),
      section('Tartans', false, el('label', { className: 'row' }, el('span', {}, 'Seed for made-up tartans'), seed), el('label', { className: 'stack' }, el('span', {}, 'Your own setts, one a line, woven instead of the designs'), setts)),
    ),
    el('footer', {}, weave, reset),
  );
  document.body.append(button, panel);

  function chosen(): Settings {
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
      colours: settings.colours,
      // Only the designs being woven keep their colours, so the address stays short.
      designColours: Object.fromEntries(Object.entries(designColours).filter(([n, p]) => (play.length > 0 ? play : DEFAULTS.play).includes(n) && Object.keys(p).length > 0)),
    };
  }

  // Shows the ticks, the order and whether anything differs from what is weaving now: nothing
  // changes until Weave is pressed, so the button says so.
  function refresh(): void {
    for (const b of boxes) b.box.checked = play.includes(b.name);
    many.hidden = !play.includes('tartan');
    if (!many.hidden && document.activeElement !== many) many.value = String(count(play, 'tartan'));
    drawOrder();
    drawColours();
    const changed = writeAddress(chosen()) !== writeAddress(settings);
    weave.textContent = changed ? 'Weave with these changes' : 'Weaving these settings';
    weave.classList.toggle('changed', changed);
  }
  panel.addEventListener('input', refresh);
  panel.addEventListener('change', refresh);
  refresh();

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
    if (show) close.focus();
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
