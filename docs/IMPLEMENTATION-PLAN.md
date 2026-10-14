# NUDL IDE implementation plan

## Phase 1 — Reliability and architecture
- [x] Review existing modules and identify extension boundaries.
- [x] Add guarded workspace storage and validation.
- [x] Add typed API contracts and an optional HTTP client.
- [x] Add central feature, menu and tool registries.
- [ ] Wire every UI menu to the central menu registry.
- [ ] Run full typecheck, regression tests and production build on the feature branch.

## Phase 2 — Language conformance
- [ ] Define common fixtures for the TypeScript implementation and native C++ reference compiler.
- [ ] Cover every grammar production and malformed-input recovery paths.
- [ ] Compare interpreter output and native compiler output for supported syntax.
- [ ] Report unsupported source-generation patterns as diagnostics.

## Phase 3 — Editor productivity
- [ ] Add parse-aware formatting and undo/redo coverage.
- [ ] Implement dirty-state indicators, rename/move and folder operations.
- [ ] Add search/replace, snippets and shortcut discovery.
- [ ] Implement safe step debugging, call frames and execution traces.

## Phase 4 — Services and collaboration
- [ ] Implement backend health, projects, compile and diagnostics endpoints.
- [ ] Add authentication and project-scoped authorization.
- [ ] Add cancellation, request IDs, rate limits and telemetry.
- [ ] Keep credentials, native builds and private source processing server-side.

## Phase 5 — Packaging and extensions
- [ ] Define a versioned extension manifest and explicit capability permissions.
- [ ] Add a sandbox before allowing third-party plugin execution.
- [ ] Add target-specific toolchains to CI for generated code.
- [ ] Test GitHub Pages base paths and verify deployment artifacts after each release.
