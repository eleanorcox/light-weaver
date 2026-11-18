import { DEFAULTS, writeAddress, type Settings } from './address';
import { hexToHsl, hslToHex, sixDigits } from './colour';
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

// Ready-made colours for the picker, chosen to glow on the dark loom.
const PRESETS = ['#f4ecd8', '#ffffff', '#ffd23a', '#ffb23a', '#ff8a3c', '#ff3b4a', '#ff4fb0', '#b04fff', '#3a7bff', '#2fd2c8', '#2fd27a', '#9fd8ff', '#c8502a', '#2f6a4a', '#2f4fb0', '#1c1c30'];

// How long after the last change the cloth takes it up, when changes are woven as they are
// made, so dragging a slider does not start a new hand-over at every step.
const SETTLE_MS = 200;

export interface PanelOptions {
  // Called with new settings when they are woven in as they are made.
  onLive?: (settings: Settings) => void;
  open?: boolean; // start with the panel open
}

export interface Panel {
  destroy(): void;
}

// A settings panel, hidden while the cloth weaves. It works in one of two ways. Usually, Weave
// writes the new settings into the address and starts again, so the same address always gives
// the same cloth. Changing as you go weaves each change in without starting again, for people
// coming up to play with it; the address keeps up, so it can still be shared.
export function startPanel(settings: Settings, options: PanelOptions = {}): Panel {
  let play = [...settings.play];
  let live = settings.live;

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
  // design alone; Default puts its colours back. The picker opens inside the panel, as the
  // browser's own can open off the edge of the screen.
  const designColours: Record<string, Record<string, string>> = Object.fromEntries(Object.entries(settings.designColours).map(([n, p]) => [n, { ...p }]));
  const everywhere = ((): Palette => {
    try {
      return parseColours(settings.colours);
    } catch {
      return {};
    }
  })();
  const usualFor = (name: string): Palette => ({ ...DESIGN_PALETTES[name], ...everywhere });
  const colourList = el('div', { className: 'colours' });
  let colourKey = '';
  let editor: HTMLElement | null = null;
  let editing: HTMLButtonElement | null = null;

  function setColour(name: string, code: string, swatch: HTMLButtonElement, hex: string): void {
    const colour = sixDigits(hex);
    swatch.dataset.colour = colour;
    swatch.style.background = colour;
    const own = (designColours[name] ??= {});
    if (colour === sixDigits(usualFor(name)[code]!)) delete own[code];
    else own[code] = colour;
    refresh();
  }

  function openEditor(name: string, code: string, swatch: HTMLButtonElement, row: HTMLElement): void {
    editor?.remove();
    editing?.classList.remove('editing');
    if (editing === swatch) {
      editor = editing = null;
      return;
    }
    editing = swatch;
    swatch.classList.add('editing');
    const hsl = hexToHsl(swatch.dataset.colour!);
    const part = (title: string, value: number, max: number): HTMLInputElement => el('input', { type: 'range', min: '0', max: String(max), value: String(value), ariaLabel: title, className: title.toLowerCase() });
    const hue = part('Hue', hsl.h, 359);
    const sat = part('Saturation', hsl.s, 100);
    const light = part('Lightness', hsl.l, 100);
    const hex = el('input', { type: 'text', className: 'hex', value: swatch.dataset.colour!, spellcheck: false, ariaLabel: 'Hex value', maxLength: 7 });
    const sync = (from?: HTMLElement): void => {
      const c = swatch.dataset.colour!;
      if (from !== hex) hex.value = c;
      if (from === undefined) {
        const now = hexToHsl(c);
        hue.value = String(now.h);
        sat.value = String(now.s);
        light.value = String(now.l);
      }
    };
    const presets = PRESETS.map((p) => {
      const b = el('button', { type: 'button', className: 'preset', title: p, ariaLabel: `Use ${p}` });
      b.dataset.colour = p;
      b.style.background = p;
      b.addEventListener('click', () => {
        setColour(name, code, swatch, p);
        sync();
      });
      return b;
    });
    for (const slider of [hue, sat, light]) {
      slider.addEventListener('input', () => {
        setColour(name, code, swatch, hslToHex({ h: Number(hue.value), s: Number(sat.value), l: Number(light.value) }));
        sync(slider);
      });
    }
    hex.addEventListener('input', () => {
      const typed = hex.value.trim().replace(/^#?/, '#');
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(typed)) {
        setColour(name, code, swatch, typed);
        sync(hex);
      }
    });
    editor = el(
      'div',
      { className: 'colour-editor' },
      el('div', { className: 'presets' }, ...presets),
      el('label', { className: 'row tight' }, el('span', {}, 'Hue'), hue),
      el('label', { className: 'row tight' }, el('span', {}, 'Saturation'), sat),
      el('label', { className: 'row tight' }, el('span', {}, 'Lightness'), light),
      el('label', { className: 'row tight' }, el('span', {}, 'Hex'), hex),
    );
    row.after(editor);
  }

  function drawColours(): void {
    const names = [...new Set(play.length > 0 ? play : DEFAULTS.play)];
    if (names.join() === colourKey) return;
    colourKey = names.join();
    editor = editing = null;
    colourList.replaceChildren(
      ...names.map((name) => {
        const codes = Object.keys(DESIGN_PALETTES[name] ?? {});
        // Made-up and typed tartans share these colours.
        const title = name === 'tartan' ? 'Tartans' : label(name);
        const row = el('div', { className: 'colour-row' });
        const swatches = codes.map((code) => {
          const colour = sixDigits(designColours[name]?.[code] ?? usualFor(name)[code]!);
          const swatch = el('button', { type: 'button', className: 'swatch', title: `Colour ${code}`, ariaLabel: `${title}, colour ${code}` });
          swatch.dataset.colour = colour;
          swatch.style.background = colour;
          swatch.addEventListener('click', () => openEditor(name, code, swatch, row));
          return swatch;
        });
        const usualButton = el('button', { type: 'button', textContent: 'Default', ariaLabel: `Default colours for ${title}` });
        usualButton.addEventListener('click', () => {
          delete designColours[name];
          swatches.forEach((sw, k) => {
            sw.dataset.colour = sixDigits(usualFor(name)[codes[k]!]!);
            sw.style.background = sw.dataset.colour;
          });
          if (editing && swatches.includes(editing)) openEditor(name, '', editing, row);
          refresh();
        });
        row.append(el('span', { className: 'name', title }, title), el('span', { className: 'swatches' }, ...swatches), usualButton);
        return row;
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

  // How changes are taken up: when Weave is pressed, or as they are made.
  const modes = (['weave', 'live'] as const).map((mode) =>
    el('input', { type: 'radio', name: 'mode', value: mode, checked: (mode === 'live') === live }),
  );
  const modeChoice = el(
    'div',
    { className: 'mode', role: 'radiogroup', ariaLabel: 'When changes are woven' },
    el('label', {}, modes[0]!, 'Change when I press Weave'),
    el('label', {}, modes[1]!, 'Change as I go'),
  );
  const note = el('span', { className: 'note', textContent: 'Changes weave in as you make them' });
  const weave = el('button', { type: 'submit', className: 'weave' });
  const reset = el('button', { type: 'button', textContent: 'Reset' });
  const close = el('button', { type: 'button', className: 'close', textContent: '×', ariaLabel: 'Close the settings' });

  panel.append(
    el('header', {}, el('h2', {}, 'Light Weaver'), close),
    modeChoice,
    el(
      'div',
      { className: 'body' },
      section('Designs', true, el('div', { className: 'pair' }, all, none), designs),
      section('Order', true, order),
      section('Colours', false, colourList),
      section('Weaving', false, picks.row, speed.row, blend.row, cell.row, el('label', { className: 'row' }, el('span', {}, 'Captions'), caption)),
      section('Tartans', false, el('label', { className: 'row' }, el('span', {}, 'Seed for made-up tartans'), seed), el('label', { className: 'stack' }, el('span', {}, 'Your own setts, one a line, woven instead of the designs'), setts)),
    ),
    el('footer', {}, note, weave, reset),
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
      live,
    };
  }

  // Weaves the chosen settings in now, and keeps the address up to date with them.
  let settle = 0;
  function apply(): void {
    window.clearTimeout(settle);
    const next = chosen();
    settings = next;
    history.replaceState(null, '', location.pathname + writeAddress(next));
    options.onLive?.(next);
    refresh();
  }

  // Shows the ticks, the order and whether anything differs from what is weaving now. When
  // changes are woven as they are made, they are taken up shortly after; otherwise the Weave
  // button says there are changes waiting.
  function refresh(): void {
    for (const b of boxes) b.box.checked = play.includes(b.name);
    many.hidden = !play.includes('tartan');
    if (!many.hidden && document.activeElement !== many) many.value = String(count(play, 'tartan'));
    drawOrder();
    drawColours();
    const changed = writeAddress(chosen()) !== writeAddress(settings);
    weave.hidden = live;
    note.hidden = !live;
    weave.textContent = changed ? 'Weave with these changes' : 'Weaving these settings';
    weave.classList.toggle('changed', changed);
    if (live && changed) {
      window.clearTimeout(settle);
      settle = window.setTimeout(apply, SETTLE_MS);
    }
  }
  for (const radio of modes) {
    radio.addEventListener('input', () => {
      live = radio.value === 'live';
      if (live) return; // refresh, which follows, weaves in anything waiting
      // Back to waiting for Weave: only the address changes, to say so.
      settings = { ...settings, live: false };
      history.replaceState(null, '', location.pathname + writeAddress(settings));
    });
  }
  panel.addEventListener('input', refresh);
  panel.addEventListener('change', refresh);
  refresh();

  const go = (search: string): void => location.assign(location.pathname + search);
  panel.addEventListener('submit', (event) => {
    event.preventDefault();
    go(writeAddress(chosen()));
  });
  reset.addEventListener('click', () => {
    if (!live) return go('');
    // Reset without starting again: a fresh panel, with the usual settings woven in.
    const fresh: Settings = { ...DEFAULTS, live: true };
    destroy();
    history.replaceState(null, '', location.pathname + writeAddress(fresh));
    options.onLive?.(fresh);
    startPanel(fresh, { ...options, open: true });
  });

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
  const escape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && !panel.hidden) open(false);
  };
  for (const kind of ['pointermove', 'pointerdown', 'keydown']) window.addEventListener(kind, wake);
  window.addEventListener('keydown', escape);
  button.addEventListener('focus', wake);
  button.addEventListener('click', () => open(true));
  close.addEventListener('click', () => open(false));
  if (options.open) open(true);

  function destroy(): void {
    window.clearTimeout(settle);
    window.clearTimeout(idle);
    for (const kind of ['pointermove', 'pointerdown', 'keydown']) window.removeEventListener(kind, wake);
    window.removeEventListener('keydown', escape);
    button.remove();
    panel.remove();
  }
  return { destroy };
}
