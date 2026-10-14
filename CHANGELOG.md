# Changelog

## Unreleased — NUDL-IDE development

### IDE architecture
- Added defensive workspace storage and validation.
- Added typed HTTP API contracts and an optional client.
- Added feature, menu and tool registries plus module documentation.


### Language tooling
- Added baseline regression tests for lexer, parser/interpreter execution, required schema fields, and code generation.
- Improved delimiter diagnostics to use lexer tokens rather than counting raw characters, so delimiters inside strings and comments do not create false positives.
- Added diagnostics for duplicate type declarations, duplicate schema fields, and fields not declared by a referenced schema.
- Added tests for delimiter handling and schema diagnostics.

### Documentation and CI
- Added IDE architecture, language support matrix, standard-library, testing, workspace-format, and build/deployment guides.
- Updated the deployment workflow to run regression tests and TypeScript checks before building and deploying GitHub Pages.

### Known limitations
- Browser and native implementations remain separate.
- The current analyzer is not a full static type checker.
- Registered target emitters are not equivalent to verified target compilers; native compilation/execution tests are still required for each backend.
