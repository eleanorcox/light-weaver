import { describe, expect, it } from 'vitest';
import { count, move, setCount, tick } from './playlist';

describe('the playlist the settings panel edits', () => {
  it('adds a newly ticked design at the end, and removes every copy of an unticked one', () => {
    expect(tick(['glen', 'satin'], 'kasuri', true)).toEqual(['glen', 'satin', 'kasuri']);
    expect(tick(['tartan', 'glen', 'tartan'], 'tartan', false)).toEqual(['glen']);
  });

  it('does not add a design twice by ticking it again', () => {
    expect(tick(['glen'], 'glen', true)).toEqual(['glen']);
  });

  it('counts how many times a design is played', () => {
    expect(count(['tartan', 'glen', 'tartan'], 'tartan')).toBe(2);
  });

  it('adds more made-up tartans at the end, and takes away the last ones first', () => {
    expect(setCount(['tartan', 'glen'], 'tartan', 3)).toEqual(['tartan', 'glen', 'tartan', 'tartan']);
    expect(setCount(['tartan', 'glen', 'tartan', 'satin'], 'tartan', 1)).toEqual(['tartan', 'glen', 'satin']);
    expect(setCount(['tartan', 'glen'], 'tartan', 0)).toEqual(['glen']);
  });

  it('moves one entry to a new place, the others keeping their order', () => {
    expect(move(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(move(['a', 'b', 'c', 'd'], 3, 0)).toEqual(['d', 'a', 'b', 'c']);
  });

  it('leaves the list alone for a move off either end', () => {
    expect(move(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
    expect(move(['a', 'b'], 1, 2)).toEqual(['a', 'b']);
  });
});
