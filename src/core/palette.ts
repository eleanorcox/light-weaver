export type Palette = Readonly<Record<string, string>>;

// Reads colours from a web address, where # cannot be used: "B-2a4bd7,Y-ffd23a" gives each
// colour letter a hex value. A # is still accepted if given.
export function parseColours(text: string): Record<string, string> {
  const colours: Record<string, string> = {};
  for (const part of text.split(',').map((p) => p.trim()).filter(Boolean)) {
    const match = /^([A-Za-z]+)-#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(part);
    if (!match) throw new Error(`"${part}" is not a colour letter, a dash and a hex value such as B-2a4bd7`);
    colours[match[1]!.toUpperCase()] = `#${match[2]!.toLowerCase()}`;
  }
  return colours;
}
