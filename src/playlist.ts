// The list of designs to weave, in order, as the settings panel edits it. A design may appear
// more than once (several made-up tartans, each with its own seed).

export function count(list: readonly string[], name: string): number {
  return list.filter((n) => n === name).length;
}

// Ticking adds a design at the end; unticking removes every copy of it.
export function tick(list: readonly string[], name: string, on: boolean): string[] {
  if (!on) return list.filter((n) => n !== name);
  return list.includes(name) ? [...list] : [...list, name];
}

// Plays a design `wanted` times: extra copies go at the end, and the last copies go first.
export function setCount(list: readonly string[], name: string, wanted: number): string[] {
  const have = count(list, name);
  if (wanted >= have) return [...list, ...Array<string>(wanted - have).fill(name)];
  let drop = have - wanted;
  const kept: string[] = [];
  for (let k = list.length - 1; k >= 0; k--) {
    if (list[k] === name && drop > 0) drop--;
    else kept.unshift(list[k]!);
  }
  return kept;
}

// Moves the entry at `from` to `to`.
export function move(list: readonly string[], from: number, to: number): string[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) return [...list];
  const out = [...list];
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item!);
  return out;
}
