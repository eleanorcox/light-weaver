// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULTS, readSettings, type Settings } from './address';
import { startPanel } from './panel';

// Clicks as a person would: the browser sends input, then change, as the box ticks.
function click(box: HTMLInputElement): void {
  box.click();
}

const box = (name: string): HTMLInputElement => document.querySelector(`.designs input[value="${name}"]`)!;
const order = (): string[] => [...document.querySelectorAll('.order .name')].map((n) => n.textContent ?? '');

describe('the settings panel', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    startPanel(readSettings('?play=glen'));
  });

  it('ticks a design when its box is clicked, adding it to the order', () => {
    click(box('kasuri'));
    expect(box('kasuri').checked).toBe(true);
    expect(order()).toEqual(['Glen check', 'Kasuri']);
  });

  it('unticks a design when its box is clicked again, taking it out of the order', () => {
    click(box('glen'));
    expect(box('glen').checked).toBe(false);
    expect(order()).toEqual([]);
  });

  it('shows there are changes waiting for Weave once a box is ticked', () => {
    const weave = document.querySelector<HTMLButtonElement>('.weave')!;
    expect(weave.classList.contains('changed')).toBe(false);
    click(box('satin'));
    expect(weave.classList.contains('changed')).toBe(true);
  });

  it('starts with every design ticked when the address names none', () => {
    document.body.replaceChildren();
    startPanel(DEFAULTS);
    expect(box('satin').checked).toBe(true);
  });
});

describe('changing settings as they are made', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.useFakeTimers();
  });

  it('weaves a change in straight away in that mode, without starting again', () => {
    const seen: Settings[] = [];
    startPanel(readSettings('?play=glen&live=on'), { onLive: (s) => seen.push(s) });
    click(box('kasuri'));
    vi.runAllTimers();
    expect(seen.at(-1)?.play).toEqual(['glen', 'kasuri']);
    expect(document.querySelector<HTMLButtonElement>('.weave')!.hidden).toBe(true);
  });

  it('waits for Weave in the usual mode', () => {
    const seen: Settings[] = [];
    startPanel(readSettings('?play=glen'), { onLive: (s) => seen.push(s) });
    click(box('kasuri'));
    vi.runAllTimers();
    expect(seen).toEqual([]);
  });

  it('switches to changing as they are made, weaving in any changes already waiting', () => {
    const seen: Settings[] = [];
    startPanel(readSettings('?play=glen'), { onLive: (s) => seen.push(s) });
    click(box('kasuri'));
    click(document.querySelector<HTMLInputElement>('.mode input[value="live"]')!);
    vi.runAllTimers();
    expect(seen.at(-1)).toMatchObject({ play: ['glen', 'kasuri'], live: true });
  });
});

describe('the colour picker', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    startPanel(readSettings('?play=glen'));
  });

  it('opens inside the panel when a colour is clicked', () => {
    document.querySelector<HTMLButtonElement>('.swatch')!.click();
    const editor = document.querySelector('.colour-editor');
    expect(editor).not.toBeNull();
    expect(editor!.closest('.panel')).not.toBeNull();
  });

  it('changes the colour to a chosen one, and shows there is a change waiting', () => {
    const swatch = document.querySelector<HTMLButtonElement>('.swatch')!;
    swatch.click();
    const preset = [...document.querySelectorAll<HTMLButtonElement>('.colour-editor .preset')].find((p) => p.dataset.colour !== swatch.dataset.colour)!;
    preset.click();
    expect(swatch.dataset.colour).toBe(preset.dataset.colour);
    expect(document.querySelector('.weave')!.classList.contains('changed')).toBe(true);
  });

  it('takes a typed hex value', () => {
    const swatch = document.querySelector<HTMLButtonElement>('.swatch')!;
    swatch.click();
    const hex = document.querySelector<HTMLInputElement>('.colour-editor input.hex')!;
    hex.value = '#123456';
    hex.dispatchEvent(new Event('input', { bubbles: true }));
    expect(swatch.dataset.colour).toBe('#123456');
  });
});
