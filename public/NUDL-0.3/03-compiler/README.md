# Compiler Framework

Planned components:

- `lexer/` — tokenization
- `parser/` — recursive-descent or Pratt parser
- `ast/` — typed abstract syntax tree
- `diagnostics/` — source locations and structured errors
- `sema/` — schema/type checking
- `ir/` — normalized intermediate representation
- `codegen/` — future native/WASM back ends

Recommended implementation language: C++23.
