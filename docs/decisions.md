# Decision log

A record of the design decisions in this project: what was decided, when, what prompted it, and what it replaced. It exists so the reasoning can be found later, in particular when writing about the work.

## How this log works

- **One entry per decision**, numbered in the order they were made, newest at the bottom.
- **Entries are not rewritten.** When a decision changes, a new entry is added that says what changed and why, and the old entry's status becomes "Replaced by" with a link.
- **Add the entry when the decision is made**, in the same piece of work.
- **"What prompted it"** records the situation at the time, in gist, not word for word.
- **Record the alternatives**, including the ones that lost, and why.

Statuses: **Proposed**, **Decided**, **Built**, **Replaced by N**.

Template:

```markdown
## N. Title

- **Date:**
- **Status:**
- **What prompted it:**
- **Decision:**
- **Alternatives considered:**
- **What follows from it:**
```

## Index

| No. | Decision | Date | Status |
| --- | --- | --- | --- |
| [1](#1-working-name-light-weaver) | Working name: Light Weaver | 17 Nov 2026 | Decided |
| [2](#2-heritage-textiles-woven-from-their-own-rules) | Heritage textiles, woven from their own rules | 17 Nov 2026 | Decided |
| [3](#3-woven-textiles-only-for-now) | Woven textiles only, for now | 17 Nov 2026 | Decided |
| [4](#4-a-passive-visual) | A passive visual | 17 Nov 2026 | Decided |
| [5](#5-built-in-the-browser) | Built in the browser | 17 Nov 2026 | Decided |
| [6](#6-british-traditions-first) | British traditions first | 17 Nov 2026 | Decided |
| [7](#7-the-same-set-up-as-the-aquarium-canvas-2d-first) | The same set-up as the aquarium; Canvas 2D first | 17 Nov 2026 | Built |
| [8](#8-made-up-tartans-before-registered-ones) | Made-up tartans before registered ones | 17 Nov 2026 | Built |
| [9](#9-one-cloth-after-another) | One cloth after another | 17 Nov 2026 | Replaced by 11 |
| [10](#10-kasuri-first-kente-and-dumbara-wait) | Kasuri first; kente and Dumbara wait | 17 Nov 2026 | Built |
| [11](#11-one-cloth-turns-into-the-next) | One cloth turns into the next | 18 Nov 2026 | Built |
| [12](#12-block-weaves-damask-and-double-cloth-face-only) | Block weaves: damask and double cloth, face only | 18 Nov 2026 | Built |

## 1. Working name: Light Weaver

- **Date:** 17 November 2026
- **Status:** Decided
- **What prompted it:** Setting up a repository for a generative weaving piece, inspired by Todd Moyer's laser-weaving installation Illoominated II.
- **Decision:** Light Weaver, as a working name; the repository and folder are `light-weaver`.
- **Alternatives considered:** Warp (the lengthwise threads, and the projection-mapping term for bending a picture to fit a surface), Selvedge, Weft, Shuttle, Drawdown, Jacquard.
- **What follows from it:** The name may be associated with Moyer's work; open question 6.

## 2. Heritage textiles, woven from their own rules

- **Date:** 17 November 2026
- **Status:** Decided
- **What prompted it:** Eleanor wanted it to weave different heritage textiles, not invented patterns alone.
- **Decision:** The piece weaves real traditions, each from its own structure: loom drafts, tartan setts, strip layouts, tapestry areas, pre-dyed threads. Traditions live in a catalogue, one file each with sources and a note on what is appropriate to reproduce, as the aquarium's species do.
- **Alternatives considered:** Invented patterns only, which is simpler but loses the meaning; drawing traditions from pictures of finished cloth, which is quicker but not real weaving and cannot vary within a tradition's rules.
- **What follows from it:** The weave core needs several kinds of pattern, not one. Sources and respect are designed in from the start.

## 3. Woven textiles only, for now

- **Date:** 17 November 2026
- **Status:** Decided
- **What prompted it:** Eleanor asked whether all the suggested traditions were woven. They were, but some well-known heritage textiles, including Sri Lankan batik, are not.
- **Decision:** Only woven textiles, including those patterned by dyeing the threads before weaving (ikat, kasuri). Batik, knitting, embroidery and block printing are out for now.
- **Alternatives considered:** Any heritage textile. Lost because most of those have no thread structure for the core to work out, so they would be pictures, not weaving.
- **What follows from it:** Knitting is noted as the likeliest extension.

## 4. A passive visual

- **Date:** 17 November 2026
- **Status:** Decided
- **What prompted it:** Described from the start as another passive visual, like Cat's Eyes.
- **Decision:** No controls while it plays; anything that varies is chosen before it starts.
- **Alternatives considered:** None discussed.
- **What follows from it:** It suits leaving running and projecting.

## 5. Built in the browser

- **Date:** 17 November 2026
- **Status:** Decided
- **What prompted it:** The first open question was browser or TouchDesigner. Eleanor chose the browser.
- **Decision:** TypeScript in the browser, like the aquarium, with the weave core free of drawing code and tested. The drawing library is still to be chosen.
- **Alternatives considered:** TouchDesigner, the tool Moyer's work appears to use and the standard for projection installations. Lost: it probably needs a Windows or Mac machine (unchecked), cannot be shared as a link, and is harder to test. Both at once was also suggested.
- **What follows from it:** The aquarium's projector window and corner correction can be copied over for projection. The TouchDesigner idea stays in the ideas list, not planned.

## 6. British traditions first

- **Date:** 17 November 2026
- **Status:** Decided
- **What prompted it:** Choosing which traditions to start with. Eleanor chose British ones, noting that the patterns need researching.
- **Decision:** The first traditions in the catalogue are British. Which one comes first waits on research into where real patterns are published and what may be reproduced.
- **Alternatives considered:** Starting with a mix from around the world, or with one with a personal link such as Dumbara. Lost for now: British traditions are close to home, well documented and a coherent first set.
- **What follows from it:** A research plan, [research/british-traditions.md](research/british-traditions.md). Traditions from elsewhere follow once the catalogue format has been proven.

## 7. The same set-up as the aquarium; Canvas 2D first

- **Date:** 17 November 2026
- **Status:** Built
- **What prompted it:** Starting to build, with the browser already chosen.
- **Decision:** TypeScript, Vite and Vitest, configured as in the aquarium. The weave core in `src/core/` has no drawing code and is tested; the first renderer uses Canvas 2D, drawing each crossing as a short glowing dash, and only redraws the newest row.
- **Alternatives considered:** WebGL or Three.js from the start. Lost for now: the look is not decided (open question 4), and Canvas 2D was enough to see whether the idea works. The aquarium made the same choice for its first renderer.
- **What follows from it:** A WebGL renderer can replace it without touching the core, if more threads, bigger screens or real lighting need it.

## 8. Made-up tartans before registered ones

- **Date:** 17 November 2026
- **Status:** Built
- **What prompted it:** The research found that real thread counts need an account with the Scottish Register of Tartans, and bulk use needs their permission.
- **Decision:** The first tartans are made up from a seed: 3 to 7 stripes, even counts, wide grounds and narrow accents, never one colour twice in a row. Each says on screen that it is made up and shows its sett and seed.
- **Alternatives considered:** Waiting for access to registered tartans; using the third-party copy of the register, whose terms are unclear.
- **What follows from it:** Registered tartans join the catalogue once access is agreed, credited to the register and their designers.

## 9. One cloth after another

- **Date:** 17 November 2026
- **Status:** Replaced by [11](#11-one-cloth-turns-into-the-next)
- **What prompted it:** Eleanor asked for weaving one cloth into another. A passive piece should move through designs by itself.
- **Decision:** A programme of pieces, each woven for a number of picks, with 16 picks of bare loom between them, repeating for ever. With no address, every design plays in turn; `?play=` chooses a list. The unwoven warp and the caption change with each piece.
- **Alternatives considered:** Changing the weft and treadling on the same warp, as a real loom would between pieces. Truer to weaving, but most designs differ in their warp too.
- **What follows from it:** Rows of a piece are counted from 0, so each piece starts at the beginning of its pattern.

## 10. Kasuri first; kente and Dumbara wait

- **Date:** 17 November 2026
- **Status:** Built
- **What prompted it:** Eleanor asked for heritage weaves from outside Britain. Research ([elsewhere.md](research/elsewhere.md)) recommended kasuri, kente and Dumbara, and found that kente designs are held in trust for the people of Ghana, with permission needed from the National Folklore Board for use outside their customary context, and that no sources for Dumbara motifs are published.
- **Decision:** Build kasuri now, with our own motif, called "kasuri, in the tradition of Kurume". Kente waits until Eleanor decides whether to ask the National Folklore Board; Dumbara waits for motif sources.
- **Alternatives considered:** Building kente from structure alone without asking; lost because the Board's position on artistic use is unclear and asking is the respectful order.
- **What follows from it:** Thread colours may now change along a thread's length (`warpColour(i, j)`), which ikat and other dyed traditions will also need.

## 11. One cloth turns into the next

- **Date:** 18 November 2026
- **Status:** Built
- **What prompted it:** Eleanor asked for the change from one weave to another to be seamless, and for a way to weave tartans one into another.
- **Decision:** No bare loom between pieces. Each warp thread changes to the next piece at its own pick, within a band (32 picks by default, `?blend=`) around where the new piece starts, so the two cloths meet along a soft, wavy line that differs at every change and is the same each time round. The unwoven warp changes thread by thread with it. Several setts can be typed (`?sett=...&sett=...`) and are woven one into the next.
- **Alternatives considered:** A cross-fade of colours, which would blend two cloths into a third that neither tradition has; a straight line, which is what a real loom gives but reads as a cut (still available as `?blend=0`); keeping one warp and changing only the weft, which most pairs of designs cannot do because their warps differ.
- **What follows from it:** Replaces the 16 picks of bare loom from [decision 9](#9-one-cloth-after-another); the rest of 9 stands. Every crossing, not every row, now asks which piece it belongs to.

## 12. Block weaves: damask and double cloth, face only

- **Date:** 18 November 2026
- **Status:** Built
- **What prompted it:** Eleanor asked for more heritage designs, skipping anything that needs someone's permission for now. A second round of research ([structures.md](research/structures.md)) found four that could be built with checked sources: monk's belt, bird's eye, linen damask and Welsh double cloth.
- **Decision:** Monk's belt and bird's eye are drafts like the others. Damask and double cloth are drawn from a block motif (a grid of figure and ground, as a Jacquard or a profile draft gives it) with a weave for each: warp satin and weft sateen for damask; two plain-weave layers for double cloth, of which only the face is drawn. The motifs are our own. Rosepath, shepherd's check, estate checks, Witney bands and the Hudson's Bay stripe wait, for sources or permission.
- **Alternatives considered:** Drawing both layers of double cloth thread by thread, which would show the hidden layer speckled through the face, which real cloth does not; writing damask as a many-shaft draft, which would be long and say nothing a block grid does not.
- **What follows from it:** `src/core/blocks.ts` can carry other block weaves later (summer and winter, overshot) from the same kind of motif.
