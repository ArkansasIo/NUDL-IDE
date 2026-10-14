# NUDL-IDE Architecture

## Purpose

NUDL-IDE is the browser-based editing environment for NUDL 0.3. It includes the source editor, project explorer, token/AST/diagnostic inspectors, interpreter output, visual Blueprint editor, examples, and target source generation.

## Processing pipeline

```text
Editor source
  -> lexer
  -> tokens + lexical diagnostics
  -> parser
  -> AST + parse diagnostics
  -> semantic analyzer
  -> interpreter OR source generator
  -> output / downloadable generated source
```

The browser TypeScript pipeline is the active browser implementation. The vendored C++ compiler in `public/NUDL-0.3/` is a reference snapshot and is not automatically compiled or invoked by the browser.

## Module responsibilities

- `src/nudl/types.ts`: tokens, AST, diagnostics, target names, and Blueprint graph contracts.
- `src/nudl/lexer.ts`: tokenization and lexical errors.
- `src/nudl/parser.ts`: syntax-to-AST conversion.
- `src/nudl/analyzer.ts`: semantic and structural diagnostics.
- `src/nudl/interpreter.ts`: bounded in-browser evaluation.
- `src/nudl/codegen.ts`: source emitters for registered target languages.
- `src/nudl/blueprintEngine.ts`: visual graph operations.
- `src/components/`: editor chrome and interactive views.
- `public/NUDL-0.3/`: vendored language specification, examples, and native reference implementation.

## Runtime safety

The interpreter should enforce a step limit, avoid arbitrary filesystem/network access, and surface runtime errors in the UI. Code generation produces source text; it does not mean that a target compiler is installed or that the emitted program has been validated by that compiler.

## Development checks

```sh
npm test
npm run lint
npm run build
```

The regression suite is a baseline. A future shared fixture suite should verify parity between the native compiler and the IDE implementation.
