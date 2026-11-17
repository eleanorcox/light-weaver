# Light Weaver

Threads of light weaving themselves into cloth, row by row, in the patterns of heritage textiles from around the world: tartan, tweed, double cloth, kente, kilim, ikat. Made to be watched, and eventually projected onto real surfaces.

Light Weaver is a working name. Inspired by Todd Moyer's Illoominated II; see [docs/vision.md](docs/vision.md).

The plan is in [docs/](docs/README.md); what has changed is in the [changelog](CHANGELOG.md).

## Run it

Needs Node.js 22.12 or newer (`.nvmrc` pins 24).

```sh
npm install
npm run dev      # then open the address it prints
npm test
npm run build    # static files in dist/
```

Choose what is woven in the address: `?scene=tartan&seed=12` (a made-up tartan; leave out the seed for a new one each time), `plain`, `twill`, `herringbone` or `houndstooth`. Also `?speed=` (rows per second), `?cell=` (pixels per thread) and `?caption=off`.
