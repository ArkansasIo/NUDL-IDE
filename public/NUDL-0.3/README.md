# NUDL 0.3 — Nudl Data Format

NUDL is a proposed programming and data language. JSON, CSV, SQL, spreadsheets, CSS, and existing programming languages are design influences only; they are not embedded syntaxes.

## Project status

Version 0.3 is a framework/specification starting point. The syntax below is intentionally small and testable. It is not presented as a finished compiler or registered standard.

## Repository layout

- `docs/` — language documentation and design notes
- `spec/` — normative/proposed language rules
- `grammar/` — grammar source
- `examples/` — sample `.nudl` programs and datasets
- `compiler/` — compiler-front-end framework
- `runtime/` — runtime framework
- `stdlib/` — standard-library framework
- `tests/` — conformance and parser tests

## Build direction

The intended native implementation is C++23 with CMake. The first milestone is a lexer, parser, AST, diagnostics, and a small interpreter/runtime.

## Design principle

NUDL should be readable by humans, deterministic for machines, strongly typed where useful, and capable of representing data schemas, records, transformations, validation rules, and program logic in one coherent language.

## Related ChatGPT material

The initial project structure was derived from the NUDL design material stored in the ChatGPT Library, including the NUDL README describing `spec/`, `grammar/`, `compiler/`, `runtime/`, `stdlib/`, `examples/`, `tests/`, and `docs/`.
