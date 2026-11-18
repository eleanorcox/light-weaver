# Light Weaver

Light Weaver is the working name. A passive visual: threads of light weave cloth in the patterns of heritage textiles, generated from real weaving rules, for a screen and later projection. TypeScript, Vite, Vitest, drawn with Canvas 2D for now. British traditions come first. Read [docs/vision.md](docs/vision.md) and [docs/open-questions.md](docs/open-questions.md) before planning or building anything.

How we work, git, writing and subagent rules are shared by all the projects and live in [../CLAUDE.md](../CLAUDE.md). This file adds what is specific to Light Weaver.

## Rules that already hold

- **The pattern comes from weaving rules.** The core works out which thread is on top at every crossing from the tradition's own structure (a loom draft, a tartan's stripe sequence, a strip layout), never from a picture of the finished cloth. Drawing only reads the result. Same input, same cloth.
- **Every tradition has sources.** A tradition is added only with sources for where it comes from, how it is woven and its patterns. Facts without a source are labelled unchecked.
- **Respect is part of the catalogue.** Each tradition's file records what is appropriate to reproduce. Restricted or sacred designs are left out. Traditions are named accurately, not as a country or a vague region, and are not mixed into hybrids unless Eleanor chooses to.
- **Protected names stay off our cloth.** "Harris Tweed" and its Orb are protected by law and by the Harris Tweed Authority: our output is never called Harris Tweed. Use "tweed in the tradition of Hebridean weaving". Named mill designs (such as Melin Tregwynt's) are not reproduced without permission. See [docs/research/british-traditions.md](docs/research/british-traditions.md).
- **Every design is in the gallery.** A new design gets a screenshot (`npm run screenshots <name>`) and an entry in [docs/designs.md](docs/designs.md), in the same commit. A test checks both.
- **It is only watched while it plays.** Settings are chosen before it starts, in the address or the settings panel (which writes the address and starts again); the button hides itself when nobody is moving the mouse.
- **Our own piece, not a copy.** Moyer's Illoominated II is the inspiration and is credited; the plan does not reproduce its look or set-up.

## Commands

```sh
nvm use            # Node 24, pinned in .nvmrc
npm install
npm run dev        # local dev server
npm test           # all tests, once
npm run typecheck  # type check only
npm run build      # type check, then build into dist/
```

Run `npm test` and `npm run typecheck` before calling anything done.

## Code rules

- `src/core/` is the weave core, "the core" in the shared rules: drafts, drawdowns, setts, the seeded random generator. No DOM, no browser APIs, no clock, no `Math.random`.
- `src/render/` only reads a `Cloth`. Timing and animation live here.
- `src/core/order.ts` turns colour orders ("L4 K4") into thread colours; `woven()` combines one with a draft.
- `src/core/blocks.ts` weaves a block motif (figure and ground) as damask or double cloth.
- `src/core/programme.ts` plays pieces one after another, each turning into the next thread by thread; `src/core/palette.ts` reads `?colours=`.
- `src/scenes.ts` holds every design (a draft and colour orders in lettered colours) and builds the programme from the address.
- `src/address.ts` reads and writes the settings in the address; `src/panel.ts` is the settings panel.
- Address settings (query parameters), also set from the panel: `?scene=`, `?play=`, `?picks=`, `?colours=`, `?seed=`, `?sett=` (repeatable), `?blend=` (rows a change between pieces is spread over), `?speed=` (picks per second), `?cell=` (pixels per thread), `?caption=off`.
