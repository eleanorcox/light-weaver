import { describe, expect, it } from 'vitest';
import type { Cloth } from './cloth';
import { continueWith, programme, type Piece } from './programme';

const cloth: Cloth = { warpUp: () => true, warpColour: () => '#fff', weftColour: () => '#000' };
const piece = (caption: string, picks: number): Piece => ({ caption, picks, cloth });

describe('programme', () => {
  const pieces = [piece('a', 100), piece('b', 60)];
  const p = programme(pieces, 20);
  const columns = Array.from({ length: 300 }, (_, i) => i);

  it('weaves each piece for its number of picks, counting its own picks from 0', () => {
    expect(p.row(10)).toEqual({ index: 0, pick: 10, piece: pieces[0] });
    expect(p.row(100)).toEqual({ index: 1, pick: 0, piece: pieces[1] });
    expect(p.row(130)).toEqual({ index: 1, pick: 30, piece: pieces[1] });
  });

  it('weaves every crossing well away from a change in the piece of its row', () => {
    for (const i of columns) {
      expect(p.crossing(i, 50)).toEqual(p.row(50));
      expect(p.crossing(i, 130)).toEqual(p.row(130));
    }
  });

  it('leaves no bare loom between pieces', () => {
    for (let j = 0; j < 160; j++) for (const i of columns) expect(p.crossing(i, j)).not.toBeNull();
  });

  it('hands over from one piece to the next along an uneven line, not all at once', () => {
    const atStart = new Set(columns.map((i) => p.crossing(i, 100).index));
    expect(atStart).toEqual(new Set([0, 1]));
  });

  it('changes each warp thread over once, within half the blend either side of the new piece', () => {
    for (const i of columns) {
      const indices = Array.from({ length: 40 }, (_, k) => p.crossing(i, 80 + k).index);
      const change = indices.indexOf(1);
      expect(change).toBeGreaterThanOrEqual(10);
      expect(change).toBeLessThanOrEqual(30);
      expect(indices.slice(change).every((n) => n === 1)).toBe(true);
    }
  });

  it('counts the new piece from its start even where a thread changes early or late', () => {
    for (const i of columns) {
      for (let j = 85; j < 115; j++) {
        const place = p.crossing(i, j);
        expect(place.pick).toBe(place.index === 1 ? j - 100 : j);
      }
    }
  });

  it('keeps the line smooth: neighbouring threads change within a few picks of each other', () => {
    const changes = columns.map((i) => Array.from({ length: 40 }, (_, k) => p.crossing(i, 80 + k).index).indexOf(1));
    for (let i = 1; i < changes.length; i++) expect(Math.abs(changes[i]! - changes[i - 1]!)).toBeLessThanOrEqual(3);
  });

  it('draws a new line at every change, even when the same piece comes round again', () => {
    const line = (j0: number): number[] => columns.map((i) => Array.from({ length: 40 }, (_, k) => p.crossing(i, j0 + k).index).indexOf(p.row(j0 + 20).index));
    expect(line(80)).not.toEqual(line(140));
    expect(line(80 + 160)).not.toEqual(line(80));
    expect(line(80 + 320)).not.toEqual(line(80 + 160));
  });

  it('draws the same lines for the same programme, so it can be shown again', () => {
    for (const j of [95, 95 + 160, 95 + 1600]) expect(programme(pieces, 20).crossing(7, j)).toEqual(p.crossing(7, j));
  });

  it('hands over from the last piece back to the first', () => {
    const indices = new Set(columns.map((i) => p.crossing(i, 160).index));
    expect(indices).toEqual(new Set([0, 1]));
    expect(p.row(160 * 3 + 5)).toEqual({ index: 0, pick: 5, piece: pieces[0] });
  });

  it('keeps the blend inside short pieces', () => {
    const short = programme([piece('a', 10), piece('b', 10)], 64);
    for (const i of columns) {
      expect(short.crossing(i, 5).index).toBe(0);
      expect(short.crossing(i, 15).index).toBe(1);
    }
  });

  it('changes in a straight line with no blend', () => {
    const straight = programme(pieces, 0);
    expect(new Set(columns.map((i) => straight.crossing(i, 99).index))).toEqual(new Set([0]));
    expect(new Set(columns.map((i) => straight.crossing(i, 100).index))).toEqual(new Set([1]));
  });

  it('weaves a single piece for ever, never blending', () => {
    const one = programme([piece('only', 10)], 20);
    expect(one.row(12345).pick).toBe(5);
    expect(new Set(columns.map((i) => one.crossing(i, 10).pick))).toEqual(new Set([0]));
  });

  it('refuses an empty programme', () => {
    expect(() => programme([], 0)).toThrow();
  });
});

describe('where each piece starts', () => {
  it('gives the first pick of each piece in the first time round', () => {
    const p = programme([piece('a', 100), piece('b', 60), piece('c', 10)], 20);
    expect([0, 1, 2].map((k) => p.start(k))).toEqual([0, 100, 160]);
  });
});

describe('changing to a new programme part-way through', () => {
  const old = programme([piece('a', 100), piece('b', 100)], 20);
  const next = programme([piece('c', 50), piece('d', 50)], 20);
  const columns = Array.from({ length: 300 }, (_, i) => i);
  // From pick 130 of the old programme, carry on from pick 20 of the new one.
  const both = continueWith(old, next, { at: 130, from: 20, blend: 24 });

  it('leaves everything before the change as it was, so woven rows stay the same', () => {
    for (let j = 0; j < 130; j++) {
      expect(both.row(j)).toEqual(old.row(j));
      for (const i of [0, 77, 299]) expect(both.crossing(i, j)).toEqual(old.crossing(i, j));
    }
  });

  it('weaves the new programme after the change, carrying on from where it was asked to', () => {
    expect(both.row(130)).toEqual(next.row(20));
    for (let j = 130 + 24; j < 300; j++) for (const i of [0, 77, 299]) expect(both.crossing(i, j)).toEqual(next.crossing(i, j - 110));
  });

  it('changes each warp thread over once, within the blend after the change, along an uneven line', () => {
    const changes = columns.map((i) => {
      const fromNext = Array.from({ length: 40 }, (_, k) => both.crossing(i, 125 + k).piece !== old.crossing(i, 125 + k).piece);
      const first = fromNext.indexOf(true);
      expect(fromNext.slice(first).every(Boolean)).toBe(true);
      return 125 + first;
    });
    expect(Math.min(...changes)).toBeGreaterThanOrEqual(130);
    expect(Math.max(...changes)).toBeLessThanOrEqual(130 + 24);
    expect(new Set(changes).size).toBeGreaterThan(1);
  });

  it('changes in a straight line with no blend', () => {
    const straight = continueWith(old, next, { at: 130, from: 20, blend: 0 });
    for (const i of columns) {
      expect(straight.crossing(i, 129)).toEqual(old.crossing(i, 129));
      expect(straight.crossing(i, 130)).toEqual(next.crossing(i, 20));
    }
  });
});
