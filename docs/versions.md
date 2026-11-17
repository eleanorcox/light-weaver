# Version log

A record of each version of Light Weaver: what it could do, how it differed from the version before, and the screencast that shows it.

The [changelog](../CHANGELOG.md) lists what changed in each version. This log says what each version was like to use and where its screencast is. The [decision log](decisions.md) says why.

## How this log works

- **A version is a point worth showing**, usually the end of a roadmap stage.
- **Each version has a git tag** (`v1`, `v2`, ...) on the commit it was recorded from.
- **Each version has a screencast**, recorded by Eleanor and kept in `~/Videos/Screencasts/`, listed here by file name. Small ones are also kept in [screencasts/](screencasts/), so the history can be watched from the repository.
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

