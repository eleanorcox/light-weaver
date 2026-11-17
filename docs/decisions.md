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
