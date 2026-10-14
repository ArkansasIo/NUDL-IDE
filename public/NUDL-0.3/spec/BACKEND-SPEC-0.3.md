# NUDL 0.3 Backend Specification

## Purpose

Define how NUDL compiles one semantic language into multiple target languages without creating incompatible dialects.

## Required pipeline

    source.nudl
        |
      Lexer
        |
      Parser
        |
       AST
        |
    Semantic Analysis
        |
     Typed NUDL IR
        |
    Backend Selection
        |
    Target Emitter
        |
    Target Compiler / Runtime

## Backend declaration

Every backend has a stable identifier, version, supported NUDL feature set, runtime dependencies, target language version, capability requirements, and conformance status.

Initial identifiers:

- cpp
- c
- rust
- go
- java
- dotnet
- python
- javascript
- typescript
- wasm
- sql
- llvm

## Conformance levels

- experimental: emitter exists but is not fully conformant
- partial: documented subset passes conformance tests
- conformant: mandatory features for the declared profile pass
- certified: reproducible release and independent conformance run verify the backend

The compiler must report status instead of implying unsupported targets are complete.

## Semantic preservation

Backends must preserve, where applicable:

- integer width and signedness
- floating-point rules
- decimal rules
- string encoding
- null/optional semantics
- collection ordering
- schema constraints
- error behavior
- deterministic operations
- evaluation order when specified
- resource ownership
- concurrency guarantees

When exact preservation is impossible, compilation must fail or require an explicitly documented compatibility mode.

## Source generation

Generated source should be readable, deterministic, reproducible, traceable to NUDL source locations, and compilable by the declared target toolchain.

## Runtime strategies

Backends may use:

1. Pure target-language generation.
2. A small NUDL compatibility runtime.
3. A target-native library implementation.
4. A hybrid approach.

## SQL restriction

SQL is a specialized target, not a general-purpose target. Only operations proven to map to the selected SQL dialect should be emitted.

## FFI

Foreign-function interfaces are explicit and require a target ABI and capability declaration.

## Testing

Every backend receives positive tests, negative tests, semantic-equivalence tests, deterministic-output tests, generated-source compilation tests, and runtime behavior tests.

No backend is advertised as universal until its declared profile passes conformance.
