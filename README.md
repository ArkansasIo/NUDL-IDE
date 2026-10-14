# NUDL 0.3 Studio

A browser-based IDE for the Noodle Unified Data Language (NUDL) with a text editor, visual blueprint editor, lexer/parser/semantic diagnostics, an interpreter, AST/token inspectors, and target-code generation.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:3000`).

## Build, test, and verify

```bash
npm test
npm run build
npm run preview
```

- `npm test` runs the Node test-runner regression suite through `tsx`, covering lexer tokens/diagnostics, parser plus interpreter execution, required schema fields, and code-generation output.
- `npm run build` runs TypeScript checking before creating the static site in `dist/`.
- `npm run preview` serves the built site locally.

Tests should be expanded alongside language features. The current suite is a baseline regression suite, not proof of full NUDL 0.3 specification conformance or that every generated target compiles natively.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the application and deploys `dist/` to GitHub Pages after each push to `main`. The Vite base path is set to `/NUDL-IDE/` in GitHub Actions so asset URLs work for this project site.

In repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. Then inspect the Actions tab for the first deployment. Published URL should be:

https://arkansasio.github.io/NUDL-IDE/

## Included modules

- `src/nudl/lexer.ts`, `parser.ts`, `analyzer.ts`: language front end and diagnostics.
- `src/nudl/interpreter.ts`: in-browser NUDL interpreter.
- `src/nudl/codegen.ts`: target source code generation.
- `src/nudl/blueprintEngine.ts` and `src/components/BlueprintEditor.tsx`: visual graph model and editor.
- `src/components/`: IDE chrome, editor, inspectors, terminal, and documentation modal.
- `src/nudl/examples.ts`: starter projects.
- `tests/nudl.test.ts`: baseline compiler-pipeline regression tests.

## Notes and limitations

This is a client-side IDE. Files are stored in browser local storage unless downloaded; clearing browser site data may remove the workspace. Generated C/C++/Rust/etc. source is exported source code, not a guarantee that a native compiler is available in the browser. Browser execution is limited to the bundled interpreter.

## Workspace projects

Use **File → Export Workspace (.json)** to save every open source file and blueprint graph in a portable `nudl-workspace.json` file. Use **File → Import Workspace (.json)** to restore an exported project. Workspace imports are validated for the expected format, non-empty file lists, relative paths, and duplicate names before replacing the current workspace. Create files with relative paths such as `src/main.nudl` to organize files into folders; the Solution Explorer displays these paths as a collapsible folder tree.

## Vendored NUDL 0.3 reference library

The full tracked source snapshot from [ArkansasIo/NUDL-0.3](https://github.com/ArkansasIo/NUDL-0.3) is mirrored in `public/NUDL-0.3/` and published with the IDE. It includes the specification, grammar, C++ reference compiler, runtime/standard-library notes, examples, tests, self-hosting and Noodle-source experiments, education material, interoperability docs, plugins, and the upstream documentation mini-site.

- Deployed library entry: `/NUDL-IDE/NUDL-0.3/index.html`
- Mirror integration notes: `public/NUDL-0.3/IDE-INTEGRATION.md`
- Upstream revision: `39d3571a888094fe8d908b67133fbaaf8241d38d`

The vendored C++ and Noodle sources are reference material. The browser IDE continues to execute through the TypeScript implementation under `src/nudl/` until cross-implementation conformance and integration are implemented.
