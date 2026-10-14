# Noodle Regex Extension

The Regex extension provides regular-expression matching and transformation as a Noodle standard extension.

## Operations

- match(pattern, input) -> bool
- find(pattern, input) -> Match[]
- replace(pattern, input, replacement) -> string
- split(pattern, input) -> string[]
- test(pattern, input) -> RegexResult

Patterns use an explicit Regex value so applications can compile a pattern once and reuse it.

## Semantic requirements

The extension must define:
- UTF-8 behavior
- invalid-pattern diagnostics
- capture-group numbering
- greediness and backtracking
- replacement escaping
- empty-match behavior
- catastrophic-backtracking limits for sandboxed runtimes

Regex is an extension rather than a new Noodle operator. This keeps the core language deterministic and keeps implementation-specific regex engines behind an API boundary.
