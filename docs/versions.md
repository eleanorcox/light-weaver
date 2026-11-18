# Version log

A record of each version of Light Weaver: what it could do, how it differed from the version before, and the screencast that shows it.

The [changelog](../CHANGELOG.md) lists what changed in each version. This log says what each version was like to use and where its screencast is. The [decision log](decisions.md) says why.

## How this log works

- **A version is a point worth showing**, usually the end of a roadmap stage.
- **Each version has a git tag** (`v1`, `v2`, ...) on the commit it was recorded from.
- **Each version has a screencast**, recorded by Eleanor and kept in `~/Videos/Screencasts/`, listed here by file name, as `Light Weaver vN - what it shows.webm`. Each is also a GIF on the [screencasts page](screencasts.md), so the history can be watched from the repository.
- **Entries are not rewritten** once the next version exists, apart from fixing mistakes.
- Newest at the bottom.

Template:

```markdown
## vN: short name

- **Date:**
- **Tag:**
- **Screencast:**
- **What it could do:**
- **How it felt compared with the last version:**
```

## v1: first light

- **Date:** 17 November 2026
- **Tag:** `v1`
- **Screencast:** `Light Weaver v1 - first light.webm`, also [in the repository](screencasts/v1-first-light.webm); and `Light Weaver v1 - made-up tartan 780891.webm`, also [in the repository](screencasts/v1-tartan-780891.webm), with [a still](screencasts/v1-tartan-780891.png). Eleanor's favourite so far: `?scene=tartan&seed=780891`, sett B6 G6 B6 R2 Y4.
- **What it could do:** Weave cloth in glowing threads on black, row by row, with a point of light carrying each weft across and the unwoven warp glowing below. Five scenes: made-up tartans from a seed, plain weave, 2/2 twill, herringbone and houndstooth, each with a caption. Opens with the screen already woven.
- **How it felt compared with the last version:** The first version. Built in an evening from the weave core up; the patterns come entirely from weaving rules, and houndstooth appearing from nothing but a twill and a colour order was the moment it felt like it worked. The look (glowing dashes) is a first pass.

## v2: one cloth after another

- **Date:** 17 November 2026
- **Tag:** `v2`
- **Screencast:** `Light Weaver v2 - one cloth after another.webm`, also [in the repository](screencasts/v2-one-cloth-after-another.webm)
- **What it could do:** Weave every design in turn, one cloth after another with bare loom between, the caption and the unwoven warp changing with each. Eighteen designs, now in a [gallery](designs.md): plain, basket, gingham, 2/2 twill, denim, broken twill, point and diamond twill, herringbone, satin, houndstooth, Glen check, Prince of Wales check, gun club check, windowpane, tattersall, made-up tartans and kasuri, the first tradition from outside Britain. Tartans typed into the address (`?sett=`), colours changed from it (`?colours=`), and a chosen list played with `?play=`.
- **How it felt compared with the last version:** It became a piece rather than a demo: left alone, it moves through cloths by itself, like a loom being re-dressed between pieces. Kasuri brought the first thread whose colour changes along its length, and its soft, slightly wonky edges look hand-made in a way the drafts do not.

## v3: one cloth into the next

- **Date:** 18 November 2026
- **Tag:** `v3`
- **Screencast:** `Light Weaver v3 - one cloth into the next.webm` (recorded as `Screencast from 18-11-26 13:45:33.webm`), also [in the repository](screencasts/v3-one-cloth-into-the-next.webm). Recorded with `?picks=30`, so a new cloth arrives every few seconds.
- **What it could do:** Turn one cloth into the next with no bare loom: each warp thread changes at its own row, so the cloths meet along a soft wavy line, different at every change (`?blend=` sets how gradual; 0 for a straight cut). Several typed tartans woven one into another. Twenty-two designs, the four new ones from a second round of research: monk's belt, bird's eye, linen damask in the tradition of Lisburn, and Welsh double cloth in the tradition of the carthen.
- **How it felt compared with the last version:** The pauses of bare loom are gone, so it reads as one continuous length of cloth that keeps changing, rather than a series of samples. Short pieces make the hand-overs the main event. Damask brought the first pattern made by light alone, with warp and weft almost the same colour.

## v4: settings to play with

- **Date:** 18 November 2026
- **Tag:** `v4`
- **Screencast:** three, kept in `~/Videos/Screencasts/` only, as each is 50 MB or more, and shown as GIFs on the [screencasts page](screencasts.md#v4-settings-to-play-with):
  - `Light Weaver v4 - settings, weaving and designs.webm`: the settings panel, changing the weaving settings and the designs.
  - `Light Weaver v4 - 100 tartans, changing colours.webm`: 100 made-up tartans, changing their colours as they weave.
  - `Light Weaver v4 - changing the order.webm`: changing the order of the designs.

  Stills of three made-up tartans: [seed 118619](screencasts/v4-tartan-118619.png), [seed 645811](screencasts/v4-tartan-645811.png) and [seed 199162](screencasts/v4-tartan-199162.png).
- **What it could do:** Everything can be chosen from a settings panel in the page as well as from the address: which designs play and in what order (dragged, or moved with arrows), up to 100 made-up tartans, rows per design, speed, blend, thread size, captions, the tartan seed, typed setts, and each design's colours, picked inside the panel. A switch chooses whether changes wait for the Weave button, which starts again from the address, or weave in straight away without starting again, for people who come to play with it. Every change from one cloth to the next now follows its own curve. The panel hides when nobody is using it.
- **How it felt compared with the last version:** It stopped being something only an address could steer and became something to play with. With changes weaving in straight away, a new colour or design rises into the cloth along a wave while the pattern carries on, so playing with it never breaks the weaving. A hundred tartans in a row makes the piece feel endless.

