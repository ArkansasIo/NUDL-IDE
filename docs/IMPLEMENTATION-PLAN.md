# NUDL IDE implementation plan

## Phase 1 — Reliability and architecture
- [x] Inventory existing modules and feature boundaries.
- [x] Add defensive storage access and workspace validation.
- [x] Define typed API contracts and an optional HTTP client.
- [x] Add declarative menu, feature and tool registries.
- [ ] Wire all existing menu rendering to the central registry.
- [ ] Run typecheck, unit tests and the production build in CI.

## Phase 2 — Language conformance
- [ ] Define shared fixtures for TypeScript and native C++ implementations.
- [ ] Add coverage for parser productions and malformed-input recovery.
- [ ] Compare interpreter results with native results for supported syntax.
- [ ] Emit explicit diagnostics for unsupported code-generation cases.

## Phase 3 — Editor workflow
- [ ] Add syntax-aware formatting and undo/redo command coverage.
- [ ] Add multi-tab dirty state, file rename and folder operations.
- [ ] Add cursor-safe snippets and find/replace.
- [ ] Add a bounded step debugger and execution trace.

## Phase 4 — Runtime and API
- [ ] Implement backend health, projects, compile and diagnostics endpoints.
- [ ] Add authentication and per-project authorization before remote persistence.
- [ ] Add timeout, cancellation, request correlation and telemetry.
- [ ] Keep secret-bearing operations server-side.

## Phase 5 — Delivery and extensibility
- [ ] Package desktop builds after the browser workflow is stable.
- [ ] Define plugin manifests, API versioning, capability permissions and sandboxing.
- [ ] Add CI jobs for browser tests and target-specific compilation toolchains.
- [ ] Verify GitHub Pages paths and the published artifact after each deployment.
