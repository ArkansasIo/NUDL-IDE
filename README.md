# NUDL 0.3 Studio — Browser IDE

NUDL-IDE is a browser-based development environment for Noodle Unified Data Language (NUDL) 0.3. It provides source editing, project/workspace management, a lexer/parser, diagnostics, an in-browser interpreter, AST/token inspection, a visual Blueprint editor, examples, and target source generation.

> **Status:** The browser IDE and language front end are under active development. A visible target option or source emitter is not proof that every feature compiles or behaves equivalently in that target language.

## Open the IDE

- **GitHub Pages:** https://arkansasio.github.io/NUDL-IDE/
- **Source repository:** https://github.com/ArkansasIo/NUDL-IDE
- **Language specification and native reference implementation:** https://github.com/ArkansasIo/NUDL-0.3

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm install
npm run dev
```

Vite normally serves the IDE at `http://localhost:3000`.

## Test and build

```sh
npm test
npm run lint
npm run build
npm run preview
```

Run these commands locally or inspect the GitHub Actions workflow before claiming a build or deployment is verified.

## Documentation

- [IDE architecture](docs/IDE-ARCHITECTURE.md)
- [Language support matrix](docs/LANGUAGE-SUPPORT-MATRIX.md)
- [Standard-library reference](docs/STANDARD-LIBRARY-REFERENCE.md)
- [Testing guide](docs/TESTING.md)
- [Build and deployment](docs/BUILD-AND-DEPLOY.md)
- [Native NUDL language specification](https://github.com/ArkansasIo/NUDL-0.3/tree/main/spec)

## Source layout

- `src/nudl/types.ts`: token, AST, diagnostic, target-language, and Blueprint types.
- `src/nudl/lexer.ts`: tokenization.
- `src/nudl/parser.ts`: syntax parser.
- `src/nudl/analyzer.ts`: diagnostics and semantic checks.
- `src/nudl/interpreter.ts`: bounded in-browser runtime and built-ins.
- `src/nudl/codegen.ts`: target source emitters.
- `src/nudl/blueprintEngine.ts` and `src/components/BlueprintEditor.tsx`: visual graph tooling.
- `tests/nudl.test.ts`: baseline compiler-pipeline regression tests.
- `public/NUDL-0.3/`: vendored language specification, documentation, examples, and native compiler reference snapshot.

## Workspace handling

Use the File menu to create/open files and export/import a portable workspace JSON. Workspace files are browser-local unless downloaded. Export important work regularly.

## Important limitations

- The browser interpreter is a TypeScript implementation; it does not invoke the native C++ compiler automatically.
- Generated C/C++/Rust/Python/etc. files are source text. A corresponding toolchain is required to compile or run them.
- Backend correctness must be validated with target-specific tests.
- Native C++ and browser TypeScript behavior is not guaranteed to be identical until shared conformance fixtures are in place.
- Optional AI features may require configuration and should never expose API keys in client-side code.

## Development priorities

1. Keep parser/runtime behavior covered by tests.
2. Maintain the language-support matrix as features change.
3. Add shared native/browser conformance fixtures.
4. Validate generated source with real target toolchains in CI.
5. Keep the Pages base path correct and check the live deployment for missing assets.
