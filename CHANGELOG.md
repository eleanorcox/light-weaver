# Changelog

What changed in each version of Light Weaver, as short lists. For what each version was like to use, and its screencast, see the [version log](docs/versions.md).

Versions are numbered v1, v2 and so on, each with a git tag of the same name. Newest first.

## Unreleased

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
