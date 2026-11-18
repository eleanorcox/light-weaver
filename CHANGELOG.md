# Changelog

What changed in each version of Light Weaver, as short lists. For what each version was like to use, and its screencast, see the [version log](docs/versions.md).

Versions are numbered v1, v2 and so on, each with a git tag of the same name. Newest first.

## Unreleased

### Changed

- Every change from one cloth to the next follows a new curve, even when the same design comes round again.

### Added

- A settings panel: move the mouse and a Settings button appears in the bottom right for a few seconds. Choose the designs to play, rows per design, speed, blend, thread size, the tartan seed, your own setts and captions, then press Weave. The choices go into the address, so they can be shared as a link.
- In the settings: play several made-up tartans (a number beside the tartan), drag designs into a new order (or use the arrows), fold sections away, and see when there are changes waiting for Weave. The design list reads down each column, in gallery order. "Start afresh" is now "Reset".
- A switch at the top of the settings, for people coming up to play with it. When on, each change weaves in from the next row without starting again, handing over along a wave, and the address keeps up (`?live=on`). When off, as usual, changes wait for Weave. The switch's label says which it is doing: "Changes weave in straight away" or "Changes wait for the Weave button".
- Colours are picked inside the settings panel (ready-made colours, hue, saturation and lightness, or a hex value), so the picker no longer opens off the edge of the screen.
- Colours in the settings: a swatch for each colour of each design, changed for that design alone. In the address, `?colours.glen=L-ff0000` changes one design's colours; `?colours=` still changes a letter in every design.

## v3: one cloth into the next (18 November 2026)

### Changed

- One cloth now turns into the next with no bare loom between: warp thread by warp thread, along a soft, wavy line, with the unwoven warp changing too. `?blend=` sets how many rows the change is spread over (32 by default; 0 for a straight line).

### Added

- Several tartans woven one into another: repeat `sett=` in the address, as in `?sett=B6G6B6R2Y4&sett=K4R24K24Y4`. Made-up ones: `?play=tartan,tartan,tartan`.
- Four more designs: monk's belt, bird's eye, linen damask in the tradition of Lisburn, and Welsh double cloth in the tradition of the carthen (`?scene=monksbelt`, `birdseye`, `damask`, `doublecloth`), the last two with our own motifs.

## v2: one cloth after another (17 November 2026)

### Added

- With no address, Light Weaver now weaves every design in turn, one cloth after another, with a stretch of bare loom between; the caption follows the cloth being woven. `?play=glen,satin,tartan` plays a chosen list, and `?picks=` sets how long each lasts.
- Colours in the address: `?colours=L-ff0000` changes a design's colours, and new letters can be used in a typed sett.
- Kasuri, in the tradition of Kurume (`?scene=kasuri`): the first tradition from outside Britain. Warp and weft are dyed along their length before weaving, and each thread sits slightly out of place, so the motif's edges blur.
- Six more designs: gingham, denim (3/1 twill), broken twill, Prince of Wales check, windowpane and tattersall.
- A [design gallery](docs/designs.md) with a screenshot of every design, made by `npm run screenshots`.

- Six more designs: point twill (zigzags), diamond twill, basket weave, satin, Glen check and gun club check (`?scene=point`, `diamond`, `basket`, `satin`, `glen`, `gunclub`).
- Type a tartan's thread count into the address to weave it: `?sett=B6G6B6R2Y4`, with no spaces needed (commas, underscores or dashes between stripes work too), using K (black), R, G, B, Y and W. A sett it cannot read is explained in the caption, with a made-up tartan shown instead.

## v1: first light (17 November 2026)

### Added

- Cloth weaves itself in threads of light, row by row: a point of light carries each weft across, alternating direction, and the woven cloth moves up as the unwoven warp glows below. It opens with the screen already woven.
- Made-up tartans from a seed (`?scene=tartan&seed=12`), each saying it is made up and showing its sett.
- Plain weave, 2/2 twill, herringbone and houndstooth scenes (`?scene=plain`, `twill`, `herringbone`, `houndstooth`).
- Address settings: `?speed=`, `?cell=` and `?caption=off`.
