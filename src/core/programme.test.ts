import { describe, expect, it } from 'vitest';
import type { Cloth } from './cloth';
import { programme, type Piece } from './programme';

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

  it('draws a different line at each change, the same every time round', () => {
    const line = (j0: number): number[] => columns.map((i) => Array.from({ length: 40 }, (_, k) => p.crossing(i, j0 + k).index).indexOf(p.row(j0 + 20).index));
    expect(line(80)).not.toEqual(line(140));
    expect(line(80 + 160)).toEqual(line(80));
    expect(programme(pieces, 20).crossing(7, 95)).toEqual(p.crossing(7, 95));
  });

  it('hands over from the last piece back to the first', () => {
    const indices = new Set(columns.map((i) => p.crossing(i, 160).index));
    expect(indices).toEqual(new Set([0, 1]));
    expect(p.row(160 * 3 + 5)).toEqual({ index: 0, pick: 5, piece: pieces[0] });
    expect(p.crossing(0, -5).index).toBe(p.crossing(0, 155).index);
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
