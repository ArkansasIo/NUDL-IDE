# NUDL-IDE Testing Guide

## Commands

```sh
npm test
npm run lint
npm run build
```

## Regression coverage

The baseline suite in `tests/nudl.test.ts` covers:
- Token categories, comments, and unterminated strings.
- Parsing and executing a simple `main` function.
- Required schema field diagnostics.
- Python source generation.
- Lexical error reporting.

## Recommended next fixtures

- Precedence and associativity for arithmetic, comparison, and logical operators.
- Nested blocks, `else if`, and loop step limits.
- Function arity errors, undefined names, recursion limits, and runtime exceptions.
- Schema default values, unknown fields, and invalid record values.
- Escaping strings and Unicode in every code generator.
- Workspace import rejection for absolute paths, duplicates, and malformed JSON.
- Blueprint graph creation, editing, serialization, and round-trip behavior.

## Honest status reporting

A test being present is not the same as a test passing. Record the command and result from the actual CI run. Generated code must be compiled or executed with its target toolchain before describing that backend as verified.
