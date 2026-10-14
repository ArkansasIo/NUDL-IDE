# NUDL IDE module reference

The IDE has two layers: the working browser implementation, and extension contracts for capabilities that need a backend or native runtime.

## Existing language modules

- `src/nudl/lexer.ts`, `parser.ts`, `analyzer.ts`: tokenize, parse and diagnose source.
- `src/nudl/interpreter.ts`: run the supported in-browser language subset.
- `src/nudl/codegen.ts`: emit target source text for supported constructs.
- `src/nudl/blueprintEngine.ts`: visual graph data and conversion helpers.
- `src/components/`: React editor, menus, sidebars, panels and Blueprint UI.

## Added modules

- `src/nudl/workspace.ts`: best-effort browser storage with strict workspace validation.
- `src/api/types.ts` and `src/api/client.ts`: typed API contracts and opt-in health/compile HTTP requests.
- `src/features/registry.ts`: capability inventory with status and prerequisites.
- `src/menus/registry.ts`: central menu and command inventory.
- `src/tools/toolRegistry.ts`: tool descriptions and explicit availability state.

## API boundaries

The API client defaults to `/api` but does not create a backend. Until a compatible service is deployed, health and compile calls can return network errors. Do not put secrets in browser bundles. Use server-side authentication, authorization and secret management for remote builds or saved projects.

## Workspace safeguards

Imported workspace JSON is restricted to relative file paths, unique case-insensitive names, at most 500 files, 240-character file names, 2 MB per source file and 20 MB total text/import size. Browser storage is optional; download workspace JSON for backup.
