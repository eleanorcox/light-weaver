// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULTS, readSettings } from './address';
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
