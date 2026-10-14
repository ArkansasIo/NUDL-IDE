# NUDL 0.3 reference mirror in NUDL IDE

This directory is a static snapshot of [ArkansasIo/NUDL-0.3](https://github.com/ArkansasIo/NUDL-0.3).

- Upstream revision: `39d3571a888094fe8d908b67133fbaaf8241d38d`
- Imported upstream files: 211
- Static entry page: `index.html`
- Original mini IDE: `docs/ide/index.html`

The mirror includes specification, EBNF grammar, C++ reference compiler, runtime and standard-library notes, examples, tests, language/logic/math/performance documentation, self-hosting and Noodle-source experiments, education material, interoperability specs, plugin examples, and the upstream documentation mini-site.

Vite publishes files below `public/` into the Pages output. The current TypeScript compiler in `src/nudl/` remains the browser IDE's active implementation; mirrored C++ and self-hosting sources are reference material, not yet wired into the browser execution pipeline.

To refresh this mirror, sync from the upstream `main` branch and update the source revision above.
