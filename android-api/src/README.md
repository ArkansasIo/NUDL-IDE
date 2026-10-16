# Adapter implementation

`nudlApi.ts` is the intended integration boundary. Before production use, its imports must be mapped to the exact exported functions in `src/nudl/lexer.ts`, `parser.ts`, `analyzer.ts`, `interpreter.ts`, and `codegen.ts`.

The adapter deliberately keeps Android transport separate from the language implementation so the NUDL compiler/runtime remains reusable by the browser IDE and Android client.
