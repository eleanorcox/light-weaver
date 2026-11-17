# Ideas

Every idea so far, each with the smallest version worth building. Sizes are rough guesses: **S** is a few days, **M** is a week or two, **L** is a month or more.

## Summary

| Idea | Size | Needs hardware |
| --- | --- | --- |
| The weave core: which thread is on top | S | no |
| Loom drafts | M | no |
| Tartan from a stripe sequence | S | no |
| A catalogue of traditions | M, then ongoing | no |
| Weaving it in light | M | no |
| Strip weaving (kente) | M | no |
| Tapestry weaving (kilim) | M | no |
| Dyed before weaving (ikat, kasuri) | M | no |
| A slowly changing pattern | S | no |
| Showing where it comes from | S | no |
| Projected on a wall or hanging cloth | S | projector |
| Projection-mapped onto real spools and a frame | L | projector |
| A TouchDesigner version (not planned: browser chosen) | M | Windows or Mac (unchecked) |
| Knitting | L | no |

## The weave core: which thread is on top

At every crossing of a warp and a weft thread, one is on top. The whole cloth is a grid of those choices plus the colour of each thread. Every kind of weaving below is a different way of filling in the grid. Kept free of drawing code, it can be tested against known patterns.

- **Smallest version:** plain weave (over one, under one), printed as a grid in a test.

## Loom drafts

On a **shaft loom**, each warp thread passes through one of a few frames (**shafts**); pressing a pedal (a **treadle**) lifts some shafts, and the weft passes under the lifted threads. A **draft** has three parts: the **threading** (which shaft each warp thread is on), the **tie-up** (which shafts each treadle lifts) and the **treadling** (the order the treadles are pressed). The pattern, the **drawdown**, follows from those (unchecked, but standard and easy to source).

- **Smallest version:** a 2/2 twill and a herringbone from their drafts, matching published drawdowns.
- Covers tweeds, overshot coverlets, Welsh double cloth, and perhaps Dumbara.

## Tartan from a stripe sequence

A tartan is one sequence of coloured stripes (its **sett**) used for both the warp and the weft, woven in a 2/2 twill so the colours blend where they cross. The Scottish Register of Tartans records each one (unchecked).

- **Smallest version:** one registered tartan from its sett, matching the register's picture.

## A catalogue of traditions

One file per tradition, like the aquarium's one file per species: name, where it comes from, how it is woven, typical colours and yarns, a few patterns, what is and is not appropriate to reproduce, and sources. Adding a file adds a tradition.

British traditions come first ([decision 6](decisions.md#6-british-traditions-first)); their candidates and what needs researching are in [research/british-traditions.md](research/british-traditions.md). Later candidates (all unchecked): Harris Tweed, Scottish tartan, Welsh double cloth (carthen), American and Welsh overshot coverlets, Sri Lankan Dumbara weaving, Ghanaian kente, Anatolian and Persian kilims, Indonesian and Central Asian ikat, Japanese kasuri, Andean weaving, Sámi band weaving.

## Weaving it in light

The look: glowing threads on darkness, the weft carried across by a moving point of light, the cloth building row by row and scrolling away, threads catching light where they rise over each other.

## Strip weaving (kente)

Narrow strips woven separately with their own patterns, then sewn edge to edge so the blocks form a checkerboard.

## Tapestry weaving (kilim)

The weft does not run edge to edge: each colour is woven back and forth in its own area, leaving small slits where colours meet. Closer to drawing a picture with weft than following a draft.

## Dyed before weaving (ikat, kasuri)

Bundles of thread are tied and dyed before weaving, so the pattern is already in the threads, and it blurs slightly where they do not line up exactly. In light: a pattern that sharpens as the threads settle into place.

## Classic weaves and checks

Built so far, from drafts and colour orders: see the [design gallery](designs.md). Gingham, windowpane, tattersall and Prince of Wales check colour orders are also from memory and unchecked. The colour orders for houndstooth (four and four), Glen check (blocks of four-and-four and two-and-two) and gun club check (two check colours, one in the warp and one in the weft) are from memory and unchecked; they look right, but need sources before they are named as traditions in the catalogue.

Next candidates: barleycorn (named in the Hebridean tweed research), birdseye, overshot (a second, thicker weft floating over a plain ground), and double cloth for the Welsh blankets, which needs each crossing to know which layer is on top.

## Favourite seeds

Made-up tartans worth keeping, to become named scenes or a playlist:

- `?scene=tartan&seed=780891`: sett B6 G6 B6 R2 Y4. Blue ground with green, and red and yellow accents.

## A slowly changing pattern

One small change to the draft or sett at a time, so the cloth evolves as it is woven. Within a tradition's rules, so it stays recognisably that tradition.

## Showing where it comes from

A quiet caption as each cloth is woven: the tradition, where it is from, and what the pattern is called. Optional, so the piece can also be watched without words.

## Projected on a wall or hanging cloth

The aquarium's display window and corner correction would make this quick to try. Projecting woven light onto real woven cloth.

## Projection-mapped onto real spools and a frame

Real objects, such as spools and a frame, with the light threads running from them into the cloth. The point closest to Moyer's piece, so the one where Light Weaver most needs its own take.

## A TouchDesigner version

TouchDesigner is a tool for live visuals built by wiring boxes together instead of writing code, and the one Moyer's work appears to have used (unchecked). Not planned: Light Weaver is built in the browser ([decision 5](decisions.md#5-built-in-the-browser)). Kept here in case a TouchDesigner version is wanted later for an installation.

## Knitting

Fair Isle and Aran have strict rules too, so they could follow weaving, as a second kind of cloth.
